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
    p.innerText = text
    div.appendChild(p)
    return div
  }


    }
  }
}
