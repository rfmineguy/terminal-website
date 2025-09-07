let ignoreEvents = ['Shift', 'Meta', 'Alt', 'Control', 'Escape', 'Tab', 'CapsLock']

class Shell {
  constructor(parent_terminal) {
    this.buf = ""
    this.parent_terminal = parent_terminal
    this.process_stack = []
    this.fs = new FileSystem()
    this.cwd = this.fs.getRoot();
    this.programs = {
      'ls': new LsProgram(this),
      'cd': new CdProgram(this),
      'clear': new ClearProgram(this)
    };
    this.commandHistory = []
    this.commandHistoryIndex = -1
    this.write_cmdline()
  }

  write_cmdline() {
  }

  terminal_keyevent(key) {
  }

  submitInput() {
  }

  navigateHistory(direction) {
  }
}
