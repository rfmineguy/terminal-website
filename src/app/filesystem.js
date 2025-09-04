class FileSystem {
  constructor() {
    this.root = new DirectoryBuilder('/').setDirectories([
        new DirectoryBuilder('home').setDirectories([
          new DirectoryBuilder('projects').setFiles([ 'rflang.md' ]).build(),
          new DirectoryBuilder('aboutme').setFiles([ 'rflang.md' ]).build(),
          new DirectoryBuilder('empty').build()
        ]).setFiles([ 'test.home' ]).build(),
      ]).setFiles([]).build();
  }

  getRoot() {
    return this.root;
  }

  getFiles(dir) {
    if (!(dir in this.filesystem)) console.log(`${dir} not in filesystem`)
    return this.filesystem[dir].entries;
  }
}
