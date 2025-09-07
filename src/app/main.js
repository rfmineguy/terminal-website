const prompt = document.getElementById('prompt')
const termOutput = document.getElementById('term-output')
const termArea = document.getElementsByClassName('term-area')[0]

let term = new Terminal(prompt, termOutput, termArea);

const handlekey = (event) => {
  if (event.key === '/' && !["INPUT", "TEXTAREA"].includes(event.target.tagName))
    event.preventDefault();

  var preventEvent = term.forwardKey(event.key)
  if (preventEvent) event.preventDefault()
};

document.addEventListener('keydown', handlekey)
