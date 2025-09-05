class Directory extends AbstractFSNode {
  constructor(name) {
    super(name)
    this.children = []
  }

  getFiles() {
    return this.children.filter(i => i instanceof File)
  }

  getDirectories() {
    return this.children.filter(i => i instanceof Directory)
  }

  searchDir(dirname) {
    if (this.name === dirname) return this;
    for (let dir of this.getDirectories()) {
      let found = dir.searchDir(dirname);
      if (found !== undefined) return found;
    }
    return undefined;
  }

  // expects dirlist to look like
  //  'folder/subfolder'  => ['folder', 'subfolder']
  //  supports using '..' to navigate backward
  searchPath(path, logging) {
    const list = path.split('/')
    if (logging) console.log('list', list)
    let curr = this;
    for (let i in list) {
      if (curr === undefined) return undefined;
      if (list[i] === "..") {
        curr = curr.parent
      }
      else {
        const matches = curr.children.filter((item) => item.name === list[i])
        if (matches.length == 0) return undefined;
        if (matches.length > 1) console.err(`folder search found more than one folder of the same name ${list[i]}`)
        curr = matches[0]
      }
    }
    return curr;
  }

  realpath() {
    if (this.parent == undefined) return this.name;
    return this.parent.realpath() + `${this.name}/`;
  }

  isdir(cwd, dir) {
    return true;
  }
}

class DirectoryBuilder {
  constructor(name) {
    this.name = name;
    this.children = []
    this.parent = null;
  }
  setChildren(children) {
    if (this.children.length != 0) console.error("did you mean to call setChildren twice?")
    this.children = children;
    return this;
  }
  build() {
    let directory = new Directory();
    directory.name = this.name;
    directory.children = this.children;

    for (let i = 0; i < directory.children.length; i++) {
      directory.children[i].parent = directory;
    }
    return directory;
  }
}
