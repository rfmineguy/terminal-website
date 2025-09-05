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

    var file = this.getRoot().searchPath('home/projects/rflang.md')
    console.log(file)
  }

  getRoot() {
    return this.root;
  }

  getFiles(dir) {
    if (!(dir in this.filesystem)) console.log(`${dir} not in filesystem`)
    return this.filesystem[dir].entries;
  }
}
