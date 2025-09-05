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
    else dir = this.filesystem.getRoot().searchPath(args[1]);
    if (dir) {
      for (let i = 0; i < dir.directories.length; i++) result.putOutputLine(`drwxr-xr-x@ Sep 4 10:00 ${dir.directories[i].name}`)
      for (let i = 0; i < dir.files.length; i++)       result.putOutputLine(`-rw-r--r--@ Sep 4 10:00 ${dir.files[i]}`)
    }
    else {
      result.putOutputLine(`ls: ${args[1]}: No such file or directory`)
      result.code = 1
    }
    return result
  }
}
