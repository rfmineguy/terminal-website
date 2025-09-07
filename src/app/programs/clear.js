class ClearProgram extends Program {
  constructor(parent_shell) {
    super(parent_shell)
  }

  main(args) {
    this.print(`\\033[2J 44 31 `)
    return 0
  }
}
