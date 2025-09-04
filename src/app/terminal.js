class Terminal {
  constructor() {
    this.input = "";
    this.fs = new FileSystem();
    this.cwd = this.fs.getRoot();
    this.commandMap = {
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
