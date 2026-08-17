// A small in-memory POSIX-ish filesystem: real path resolution, real
// permission bits, real directory/file nodes. Every shell command in
// commands.js mutates or reads this — nothing here is decorative.

function newDir(mode = 0o755) {
  return { type: "dir", mode, mtime: Date.now(), children: {} };
}

function newFile(content = "", mode = 0o644) {
  return { type: "file", mode, mtime: Date.now(), content };
}

function splitSegments(path) {
  return path.split("/").filter((s) => s.length > 0 && s !== ".");
}

// Resolve a (possibly relative) path against a cwd into a clean absolute
// segment array, handling ".." without ever escaping root.
function resolveSegments(cwd, path) {
  const base = path.startsWith("/") ? [] : splitSegments(cwd);
  const parts = splitSegments(path);
  const stack = [...base];
  for (const part of parts) {
    if (part === "..") stack.pop();
    else stack.push(part);
  }
  return stack;
}

function segmentsToPath(segments) {
  return "/" + segments.join("/");
}

export class VfsError extends Error {
  constructor(message) {
    super(message);
    this.name = "VfsError";
  }
}

export class Vfs {
  constructor() {
    this.root = newDir();
  }

  resolve(cwd, path) {
    return segmentsToPath(resolveSegments(cwd, path));
  }

  // Walk down from root, returning the node or null.
  getNode(path) {
    const segments = splitSegments(path);
    let node = this.root;
    for (const part of segments) {
      if (node.type !== "dir" || !node.children[part]) return null;
      node = node.children[part];
    }
    return node;
  }

  getNodeAt(cwd, path) {
    return this.getNode(this.resolve(cwd, path));
  }

  getParent(path) {
    const segments = splitSegments(path);
    const name = segments.pop();
    const parentNode = segments.length
      ? this.getNode(segmentsToPath(segments))
      : this.root;
    return { parentNode, name, parentPath: segmentsToPath(segments) };
  }

  exists(cwd, path) {
    return this.getNodeAt(cwd, path) !== null;
  }

  mkdir(cwd, path, { parents = false, mode = 0o755 } = {}) {
    const abs = this.resolve(cwd, path);
    const segments = splitSegments(abs);
    if (segments.length === 0) return; // root always exists
    if (!parents) {
      const { parentNode, name } = this.getParent(abs);
      if (!parentNode || parentNode.type !== "dir")
        throw new VfsError(`mkdir: cannot create directory '${path}': No such file or directory`);
      if (parentNode.children[name])
        throw new VfsError(`mkdir: cannot create directory '${path}': File exists`);
      parentNode.children[name] = newDir(mode);
      return;
    }
    let node = this.root;
    for (const part of segments) {
      if (!node.children[part]) node.children[part] = newDir(mode);
      node = node.children[part];
      if (node.type !== "dir")
        throw new VfsError(`mkdir: cannot create directory '${path}': Not a directory`);
    }
  }

  touch(cwd, path, { mode = 0o644 } = {}) {
    const abs = this.resolve(cwd, path);
    const existing = this.getNode(abs);
    if (existing) {
      existing.mtime = Date.now();
      return existing;
    }
    const { parentNode, name } = this.getParent(abs);
    if (!parentNode || parentNode.type !== "dir")
      throw new VfsError(`touch: cannot touch '${path}': No such file or directory`);
    const file = newFile("", mode);
    parentNode.children[name] = file;
    return file;
  }

  write(cwd, path, content, { append = false, mode = 0o644 } = {}) {
    const abs = this.resolve(cwd, path);
    let node = this.getNode(abs);
    if (node && node.type === "dir")
      throw new VfsError(`${path}: Is a directory`);
    if (!node) {
      const { parentNode, name } = this.getParent(abs);
      if (!parentNode || parentNode.type !== "dir")
        throw new VfsError(`${path}: No such file or directory`);
      node = newFile("", mode);
      parentNode.children[name] = node;
    }
    node.content = append ? node.content + content : content;
    node.mtime = Date.now();
    return node;
  }

  read(cwd, path) {
    const node = this.getNodeAt(cwd, path);
    if (!node) throw new VfsError(`cat: ${path}: No such file or directory`);
    if (node.type === "dir") throw new VfsError(`cat: ${path}: Is a directory`);
    return node.content;
  }

  list(cwd, path = ".") {
    const node = this.getNodeAt(cwd, path);
    if (!node) throw new VfsError(`ls: cannot access '${path}': No such file or directory`);
    if (node.type === "file") return [{ name: path, node }];
    return Object.entries(node.children)
      .sort(([a], [b]) => a.localeCompare(b))
      .map(([name, child]) => ({ name, node: child }));
  }

  remove(cwd, path, { recursive = false } = {}) {
    const abs = this.resolve(cwd, path);
    if (abs === "/") throw new VfsError("rm: refusing to remove root directory");
    const node = this.getNode(abs);
    if (!node) throw new VfsError(`rm: cannot remove '${path}': No such file or directory`);
    if (node.type === "dir" && !recursive && Object.keys(node.children).length > 0)
      throw new VfsError(`rm: cannot remove '${path}': Is a directory`);
    const { parentNode, name } = this.getParent(abs);
    delete parentNode.children[name];
  }

  clone(node) {
    if (node.type === "file") return newFile(node.content, node.mode);
    const dir = newDir(node.mode);
    for (const [name, child] of Object.entries(node.children)) {
      dir.children[name] = this.clone(child);
    }
    return dir;
  }

  copy(cwd, src, dst, { recursive = false } = {}) {
    const srcNode = this.getNodeAt(cwd, src);
    if (!srcNode) throw new VfsError(`cp: cannot stat '${src}': No such file or directory`);
    if (srcNode.type === "dir" && !recursive)
      throw new VfsError(`cp: -r not specified; omitting directory '${src}'`);

    const dstAbs = this.resolve(cwd, dst);
    const dstNode = this.getNode(dstAbs);
    const srcName = splitSegments(this.resolve(cwd, src)).pop();

    if (dstNode && dstNode.type === "dir") {
      dstNode.children[srcName] = this.clone(srcNode);
      return;
    }
    const { parentNode, name } = this.getParent(dstAbs);
    if (!parentNode) throw new VfsError(`cp: cannot create '${dst}': No such file or directory`);
    parentNode.children[name] = this.clone(srcNode);
  }

  move(cwd, src, dst) {
    const srcAbs = this.resolve(cwd, src);
    const srcNode = this.getNode(srcAbs);
    if (!srcNode) throw new VfsError(`mv: cannot stat '${src}': No such file or directory`);

    const dstAbs = this.resolve(cwd, dst);
    const dstNode = this.getNode(dstAbs);
    const srcName = splitSegments(srcAbs).pop();

    const { parentNode: srcParent, name: srcParentName } = this.getParent(srcAbs);

    if (dstNode && dstNode.type === "dir") {
      dstNode.children[srcName] = srcNode;
    } else {
      const { parentNode, name } = this.getParent(dstAbs);
      if (!parentNode) throw new VfsError(`mv: cannot move to '${dst}': No such file or directory`);
      parentNode.children[name] = srcNode;
    }
    delete srcParent.children[srcParentName];
  }

  chmod(cwd, path, mode) {
    const node = this.getNodeAt(cwd, path);
    if (!node) throw new VfsError(`chmod: cannot access '${path}': No such file or directory`);
    node.mode = mode;
  }

  // Recursively walk every node under path, calling fn(fullPath, node).
  walk(cwd, path, fn) {
    const abs = this.resolve(cwd, path);
    const node = this.getNodeAt(cwd, path);
    if (!node) return;
    const recur = (currentPath, currentNode) => {
      fn(currentPath, currentNode);
      if (currentNode.type === "dir") {
        for (const [name, child] of Object.entries(currentNode.children)) {
          recur(currentPath === "/" ? `/${name}` : `${currentPath}/${name}`, child);
        }
      }
    };
    recur(abs, node);
  }

  size(node) {
    if (node.type === "file") return node.content.length;
    return Object.values(node.children).reduce(
      (sum, child) => sum + this.size(child),
      4096,
    );
  }

  modeString(node) {
    const perms = (bits) =>
      (bits & 4 ? "r" : "-") + (bits & 2 ? "w" : "-") + (bits & 1 ? "x" : "-");
    const type = node.type === "dir" ? "d" : "-";
    const m = node.mode;
    return (
      type +
      perms((m >> 6) & 7) +
      perms((m >> 3) & 7) +
      perms(m & 7)
    );
  }
}

// Build a Vfs from a flat map of { "path/to/file": "content", "path/to/dir/": null }.
// Directories are inferred automatically from any path containing content.
export function buildVfs(fileMap, { mode } = {}) {
  const vfs = new Vfs();
  for (const [path, content] of Object.entries(fileMap || {})) {
    if (content === null || path.endsWith("/")) {
      vfs.mkdir("/", path, { parents: true });
    } else {
      const dir = path.split("/").slice(0, -1).join("/");
      if (dir) vfs.mkdir("/", dir, { parents: true });
      const fileMode = mode && mode[path] !== undefined ? mode[path] : 0o644;
      vfs.write("/", path, content, { mode: fileMode });
    }
  }
  return vfs;
}

export { splitSegments, resolveSegments, segmentsToPath };
