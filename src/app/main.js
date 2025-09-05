let term = new Terminal();
let ignoreEvents = ['Shift', 'Meta', 'Alt', 'Control', 'Escape', 'Tab', 'Caps Lock']

const prompt = document.getElementById('prompt')
const termOutput = document.getElementById('term-output')
const termArea = document.getElementsByClassName('term-area')[0]

const updateline = (ch) => {
  const input = document.getElementById('term-input-text')
  input.innerText = term.input;

  const prompt = document.getElementById('prompt')
  prompt.innerText = `${term.cwd.realpath()} $`
};

const handlekey = (event) => {
  if (ignoreEvents.includes(event.key)) return;
  if (event.key === '/' && !["INPUT", "TEXTAREA"].includes(event.target.tagName))
    event.preventDefault();

  if (event.key === 'Backspace') term.deleteCharFromInput();
  else if (event.key === 'Enter') {
    const result = term.submitInput();
    if (result.output_lines[0] === '<clear>') {
      termOutput.replaceChildren();
    }
    else {
      const dom = result.createDOM()
      termOutput.appendChild(dom)
      termArea.scrollTop = termArea.scrollHeight;
    }
  }
  else term.addCharToInput(event.key);

  updateline(term.input);
};

updateline()

document.addEventListener('keydown', handlekey)
