class CommandResult {
  constructor(dir, args) {
    this.dir = dir
    this.args = args;
    this.raw_command = ''
    this.output_lines = []
    this.code = 0
  }

  putOutputLine(line) {
    this.output_lines.push(line)
  }

  createCommandDOM() {
    console.log(this.args)
    const div = document.createElement('div')
    const text = document.createElement('p')
    text.innerText = `${this.dir.realpath()} $ ${this.args.join(' ')}`
    div.appendChild(text)
    return div
  }

  createSuccessDOM() {
    const div = document.createElement('div')
    div.appendChild(this.createCommandDOM())
    for (let line of this.output_lines) {
      const el = document.createElement('p')
      el.innerText = line
      div.appendChild(el)
    }
    return div
  }

  createFailDOM() {
    const div = document.createElement('div')
    div.appendChild(this.createCommandDOM())
    for (let line of this.output_lines) {
      const el = document.createElement('p')
      el.innerText = line
      div.appendChild(el)
    }
    return div
  }

  createDOM() {
    if (this.code == 0) return this.createSuccessDOM()
    else return this.createFailDOM()
  }

  static NoInput(dir, args) {
    var result = new CommandResult(dir, args)
    result.code = 1
    return result
  }

  static CommandNotFound(name, dir, args) {
    var result = new CommandResult(dir, args)
    result.putOutputLine(`Command ${name} not found`)
    result.code = 1
    return result
  }
}

class AbstractCommand {
  constructor(filesystem, terminal) {
    if (new.target === AbstractCommand) {
      throw new Error("Cannot instantiate abstract class 'AbstractCommand'");
    }
    this.filesystem = filesystem;
    this.terminal = terminal;
  }

  run(args) {
    throw new Error("Cannot call 'run' on absract class 'AbstractCommand'");
  }
}
