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
    if (ignoreEvents.includes(key)) return true
    if (key === 'Enter') {
      this.submitInput()
      this.buf = ""
      this.write_cmdline()
      return true
    }
    else if (key === 'ArrowUp') {
      this.navigateHistory(1)
      this.write_cmdline()
    }
    else if (key === 'ArrowDown') {
      this.navigateHistory(-1)
      this.write_cmdline()
    }
    else if (key === 'Backspace') {
      this.buf = this.buf.slice(0, -1)
      this.write_cmdline()
    }
    else {
      this.buf += key
      this.write_cmdline()
    }
    return false
  }

  submitInput() {
  }

  navigateHistory(direction) {
  }
}
