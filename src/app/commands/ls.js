class LsCommand extends AbstractCommand {
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
      for (let i = 0; i < dir.children.length; i++) {
        let node = dir.children[i]
        if (node instanceof File) {
          result.putOutputLine(`-rw-r--r--@ Sep 4 10:00 ${node.name}`)
        }
        else if (node instanceof Directory) {
          result.putOutputLine(`drwxr-xr-x@ Sep 4 10:00 ${node.name}`)
        }
        else {
          result.putOutputLine('entry error');
        }
      }
    }
    else {
      result.putOutputLine(`ls: ${args[1]}: No such file or directory`)
      result.code = 1
    }
    return result
  }
}
