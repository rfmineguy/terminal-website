class Terminal {
  constructor() {
    this.input = "";
    this.fs = new FileSystem();
    this.cwd = this.fs.getRoot();
    this.commandMap = {
      'ls': (args) => {
        var dir = undefined;
        if (args.length == 1) dir = this.cwd;
        else if (args[1] === '/') dir = this.fs.getRoot();
        else if (args[1][0] === '/') dir = this.fs.getRoot().searchPath(args[1].slice(1));
        else dir = this.fs.getRoot().searchPath(args[1]);
        if (dir) {
          for (let i = 0; i < dir.directories.length; i++) console.log(` Directory -  ${dir.directories[i].name}`)
          for (let i = 0; i < dir.files.length; i++) console.log(` File      -  ${dir.files[i]}`)
        }
        else {
          console.error(`directory ${args[1]} does not exist`);
        }
      },
      'cd': (args) => {
      }
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
    console.log(args);
    if (args[0] in this.commandMap) {
      this.commandMap[args[0]](args)
    }
    else {
      console.log(`command '${args[0]}' not found`);
    }
    this.input = "";
  }
}
