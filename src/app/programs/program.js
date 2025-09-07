class Program {
  constructor(parent_shell) {
    this.parent_shell = parent_shell
  }
  main() {
    throw new Error("Cannot call main on an abstract program")
  }


  print(text) {
    this.parent_shell.parent_terminal.write(text)
  }
}
