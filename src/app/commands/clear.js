class ClearCommand extends AbstractCommand {
  constructor(filesystem, terminal) {
    super(filesystem, terminal)
  }

  run(args) {
    var result = new CommandResult(this.terminal.cwd, args)
    result.putOutputLine('<clear>')
    return result
  }
}
