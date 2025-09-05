class CdCommand extends AbstractCommand {
  constructor(filesystem, terminal) {
    super(filesystem, terminal)
  }

  run(args) {
    var result = new CommandResult(this.terminal.cwd, args);
    var dir = undefined;
    if (args.length == 1) dir = this.terminal.cwd;
    else if (args[1] === '/') dir = this.filesystem.getRoot();
    else if (args[1][0] === '/') dir = this.filesystem.getRoot().searchPath(args[1].slice(1));
    else dir = this.terminal.cwd.searchPath(args[1]);
    if (dir) {
      this.terminal.cwd = dir;
    }
    else {
      result.putOutputLine(`directory ${args[1]} does not exist`);
      result.code = 1
    }
    return result
  }
}
