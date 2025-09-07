class TreeProgram extends Program {
  constructor(parent_shell) {
    super(parent_shell)
  }

  tree(dir, prefix) {
    let newPrefix = ''
    for (let i = 0; i < dir.children.length; i++) {
      if (i == dir.children.length - 1) {
        this.print(`${prefix}└─ ${dir.children[i].name}`)
        newPrefix = prefix + "   "
      }
      else {
        this.print(`${prefix}├─ ${dir.children[i].name}`)
        newPrefix = prefix + "|   "
      }
      if (dir.children[i] instanceof Directory) {
        this.tree(dir.children[i], newPrefix)
      }
    }
  }

  main(args) {
    var dir = undefined
    if (args.length == 1) dir = this.parent_shell.cwd
    else if (args[1] === '/') dir = this.parent_shell.fs.getRoot();
    else if (args[1][0] === '/') dir = this.parent_shell.fs.getRoot().searchPath(args[1].slice(1));
    else dir = this.parent_shell.cwd.searchPath(args[1]);

    if (dir instanceof Directory) {
      this.print('.')
      this.tree(dir, '')
      return 0
    }
    else if (dir instanceof File) {
      this.print(`${args[1]}  [error opening dir]`)
      this.print(``)
      this.print(`0 directories, 1 file`)
      return 1
    }
    else {
      this.print(`${args[1]}  [error opening dir]`)
      this.print(``)
      this.print(`0 directories, 0 files`)
      return 1
    }


    return 1
  }
}
