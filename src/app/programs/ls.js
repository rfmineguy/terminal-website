class LsProgram extends Program {
  constructor(parent_shell) {
    super(parent_shell)
  }

  main(args) {
    console.log(args)
    var dir = undefined
    if (args.length == 1) dir = this.parent_shell.cwd
    else if (args[1] === '/') dir = this.parent_shell.fs.getRoot();
    else if (args[1][0] === '/') dir = this.parent_shell.fs.getRoot().searchPath(args[1].slice(1));
    else dir = this.parent_shell.cwd.searchPath(args[1]);

    if (dir) {
      for (let i = 0; i < dir.children.length; i++) {
        let node = dir.children[i]
        if (node instanceof File) {
          this.print(`-rw-r--r--@ Sep 4 10:00 ${node.name}`)
        }
        else if (node instanceof Directory) {
          this.print(`drwxr-xr-x@ Sep 4 10:00 ${node.name}`)
        }
        else {
          this.print('entry error')
        }
      }
    }
    else {
      this.print(`ls: ${args[1]}: no such file or directory`)
      return 1
    }

    return 0
  }
}
