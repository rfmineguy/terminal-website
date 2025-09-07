class CdProgram extends Program {
  constructor(parent_shell) {
    super(parent_shell)
  }

  main(args) {
    var dir = undefined
    if (args.length == 1) dir = this.parent_shell.cwd
    else if (args[1] === '/') dir = this.parent_shell.fs.getRoot()
    else if (args[1][0] === '/') dir = this.parent_shell.fs.getRoot().searchPath(args[1].slice(1))
    else dir = this.parent_shell.cwd.searchPath(args[1])

    if (dir instanceof Directory) {
      this.parent_shell.cwd = dir
      return 0
    }
    else if (dir instanceof File) {
      this.print(`cd: ${args[1]}: not a directory`)
      return 1
    }
    else {
      this.print(`cd: ${args[1]}: does not exist`)
      return 1
    }

    return 0
  }
}
