class Terminal {
  constructor() {
    this.input = "";
    this.fs = new FileSystem();
    this.cwd = this.fs.getRoot();

    this.ls = new LsCommand(this.fs, this)
    this.cd = new CdCommand(this.fs, this)
    this.clear = new ClearCommand(this.fs, this)
    this.commandMap = {
      'ls':    (args) => { return this.ls.run(args) },
      'cd':    (args) => { return this.cd.run(args) },
      'clear': (args) => { return this.clear.run(args) },
    };
  }

  deleteCharFromInput() {
    this.input = this.input.slice(0, -1);
  }

  addCharToInput(ch) {
    this.input += ch;
  }

  submitInput() {
    const args = this.input.split(" ").filter(s => s.length != 0);
    this.input = "";
    if (args.length == 0) {
      return CommandResult.NoInput(this.cwd, args);
    }
    else if (args[0] in this.commandMap) {
      return this.commandMap[args[0]](args)
    }
    else {
      console.log('invalid command')
      return CommandResult.CommandNotFound(args[0], this.cwd, args);
    }
  }
}
