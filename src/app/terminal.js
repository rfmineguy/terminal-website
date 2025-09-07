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

  forwardKey(ch) {
    return this.shell.terminal_keyevent(ch)
  }

  createDomLine(text) {
    const div = document.createElement('div')
    const p = document.createElement('p')
    p.classList.add('enable-whitespace')
    p.textContent = text
    div.appendChild(p)
    return div
  }

  writePrompt(text) {
    this.prompt_node.textContent = text
  }

  write(text) {
    const lines = text.split("\n")
    if (lines.length == 0) return
    for (let line of lines) {
      this.line = ""
      for (let i = 0; i < line.length; i++) {
        if (line[i] == '\r') this.line = ""
        else if (line.slice(i).startsWith('\\033')) {
          // process escape code
          this.output_dom_node.replaceChildren();
          break
        }
        else this.line += text[i]
      }
      const dom = this.createDomLine(this.line)
      this.output_dom_node.appendChild(dom)
      this.term_area_dom_node.scrollTop = this.term_area_dom_node.scrollHeight;
    }
  }
}
