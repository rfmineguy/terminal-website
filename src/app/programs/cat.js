class CatProgram extends Program {
  constructor(parent_shell) {
    super(parent_shell)
  }

  main(args) {
    var file = undefined
    if (args.length == 1) {
      this.print(`cat: requires one argument`)
      return 1
    }
    else if (args[1][0] === '/') file = this.parent_shell.fs.getRoot().searchPath(args[1].slice(1));
    else file = this.parent_shell.cwd.searchPath(args[1]);

    if (file) {
      if (file instanceof Directory) {
        this.print(`cat: ${args[1]}: not a file`)
        return 1
      }
      else {
        this.print(file.contents)
      }
    }
    else {
      this.print(`cat: ${args[1]}: not a file or a directory`)
    }
    return 0
  }
}
