class Terminal {
  constructor(prompt_node, output_dom_node, term_area_dom_node) {
    this.line = "";
    this.prompt_node = prompt_node
    this.output_dom_node = output_dom_node;
    this.term_area_dom_node = term_area_dom_node;
    this.fs = new FileSystem();
    this.cwd = this.fs.getRoot();

    this.shell = new Shell(this)
  }

  deleteCharFromInput() {
    this.input = this.input.slice(0, -1);
  }

  addCharToInput(ch) {
    this.input += ch;
  }

  submitInput() {
    const args = this.input.split(" ").filter(s => s.length != 0);
    this.commandHistory.unshift(this.input)
    this.commandHistoryIndex = -1
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

  navigateHistory(direction) {
    this.commandHistoryIndex += direction
    if (this.commandHistoryIndex <= -1)
      this.commandHistoryIndex = -1
    if (this.commandHistoryIndex >= this.commandHistory.length)
      this.commandHistoryIndex = this.commandHistory.length - 1

    if (this.commandHistoryIndex == -1) {
      this.input = ''
    }
    else {
      this.input = this.commandHistory[this.commandHistoryIndex];
    }
  }
}
