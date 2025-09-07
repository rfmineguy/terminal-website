class FileSystem {
  constructor() {
    this.root = new DirectoryBuilder('/').setChildren([
        new DirectoryBuilder('home').setChildren([
          new DirectoryBuilder('projects').setChildren([ new File('rflang.md', 'fs/rflang.md') ]).build(),
          new DirectoryBuilder('aboutme').setChildren([ new File('rflang.md', 'fs/rflang.md') ]).build(),
          new DirectoryBuilder('empty').build(),
          new File('test.home', 'fs/test.home')
        ]).build(),
      ]).build();

    let rflang = this.root.searchPath('home/projects/rflang.md')
    rflang.write(`RFLang is a project that implements a compiler\n`)
    rflang.write(`RFLang is a project that implements a compiler\n`)

    console.log(this.root.searchPath('home/projects/rflang.md'))
  }

  getRoot() {
    return this.root;
  }

  getHome() {
    return this.getRoot().searchPath('home')
  }

  getFiles(dir) {
    if (!(dir in this.filesystem)) console.log(`${dir} not in filesystem`)
    return this.filesystem[dir].entries;
  }
}
