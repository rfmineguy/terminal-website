class Directory {
  constructor() {
    this.name = ''
    this.directories = []
    this.files = []
    this.parent = undefined;
  }

  searchDir(dirname) {
    if (this.name === dirname) return this;
    for (let dir of this.directories) {
      let found = dir.searchDir(dirname);
      if (found !== undefined) return found;
    }
    return undefined;
  }

  // expects dirlist to look like
  //  'folder/subfolder'  => ['folder', 'subfolder']
  //  supports using '..' to navigate backward
  searchPath(path) {
    const list = path.split('/')
    let curr = this;
    for (let i in list) {
      if (curr === undefined) return undefined;
      if (list[i] === "..") {
        curr = curr.parent
      }
      else {
        const matches = curr.directories.filter((item) => item.name === list[i])
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
    this.directories = [];
    this.files = [];
    this.parent = null;
  }
  setDirectories(directories) {
    this.directories = directories;
    return this;
  }
  setFiles(files) {
    this.files = files;
    return this;
  }
  build() {
    let directory = new Directory();
    directory.name = this.name;
    directory.directories = this.directories;
    directory.files = this.files;

    for (let i = 0; i < directory.directories.length; i++) {
      directory.directories[i].parent = directory;
    }
    return directory;
  }
}
