const BUTTONS = [
  ["C", "⌫", "÷"],
  ["7", "8", "9", "×"],
  ["4", "5", "6", "−"],
  ["1", "2", "3", "+"],
  ["±", "0", ".", "="]
];

const OPERATORS = {
  "÷": (a, b) => a / b,
  "×": (a, b) => a * b,
  "−": (a, b) => a - b,
  "+": (a, b) => a + b
};

const displayPrev = document.getElementById("prev");
const displayCurrent = document.getElementById("current");
const keypad = document.getElementById("keypad");

let display = "0";
let prevValue = null;
let operator = null;
let overwrite = false;

function formatNumber(value) {
  if (value === "") return "0";
  const number = Number(value);
  if (!Number.isFinite(number)) return "Error";
  return new Intl.NumberFormat("en-US", {
    maximumFractionDigits: 10
  }).format(number);
}

function render() {
  displayCurrent.textContent = formatNumber(display);
  displayPrev.textContent =
    prevValue && operator ? `${formatNumber(prevValue)} ${operator}` : "";
}

function handleDigit(digit) {
  if (overwrite || display === "0") {
    display = digit;
  } else {
    display += digit;
  }
  overwrite = false;
  render();
}

function handleDecimal() {
  if (overwrite) {
    display = "0.";
  } else if (!display.includes(".")) {
    display += ".";
  }
  overwrite = false;
  render();
}

function handleClear() {
  display = "0";
  prevValue = null;
  operator = null;
  overwrite = false;
  render();
}

function handleBackspace() {
  if (overwrite) {
    display = "0";
  } else if (display.length <= 1) {
    display = "0";
  } else {
    display = display.slice(0, -1);
  }
  render();
}

function handleToggleSign() {
  if (display === "0") return;
  display = display.startsWith("-") ? display.slice(1) : `-${display}`;
  render();
}

function evaluate(a, b, op) {
  const result = OPERATORS[op](a, b);
  if (!Number.isFinite(result)) return "Error";
  return String(result);
}

function handleOperator(nextOperator) {
  if (display === "Error") return;

  if (prevValue == null) {
    prevValue = display;
    operator = nextOperator;
    overwrite = true;
    render();
    return;
  }

  if (overwrite) {
    operator = nextOperator;
    render();
    return;
  }

  const result = evaluate(Number(prevValue), Number(display), operator);
  display = result;
  prevValue = result === "Error" ? null : result;
  operator = result === "Error" ? null : nextOperator;
  overwrite = true;
  render();
}

function handleEquals() {
  if (prevValue == null || operator == null || display === "Error") return;
  const result = evaluate(Number(prevValue), Number(display), operator);
  display = result;
  prevValue = null;
  operator = null;
  overwrite = true;
  render();
}

function handleInput(value) {
  if (value >= "0" && value <= "9") return handleDigit(value);
  if (value === ".") return handleDecimal();
  if (value === "C") return handleClear();
  if (value === "⌫") return handleBackspace();
  if (value === "±") return handleToggleSign();
  if (value === "=") return handleEquals();
  if (OPERATORS[value]) return handleOperator(value);
}

function createButtons() {
  BUTTONS.flat().forEach((label) => {
    const button = document.createElement("button");
    button.className = "key";
    if (label === "=") button.classList.add("key-equals");
    if (OPERATORS[label]) button.classList.add("key-operator");
    if (label === "C") button.classList.add("key-clear");
    button.textContent = label;
    button.addEventListener("click", () => handleInput(label));
    keypad.appendChild(button);
  });
}

window.addEventListener("keydown", (event) => {
  const key = event.key;
  if (key >= "0" && key <= "9") return handleDigit(key);
  if (key === ".") return handleDecimal();
  if (key === "Backspace") return handleBackspace();
  if (key === "Escape") return handleClear();
  if (key === "Enter" || key === "=") return handleEquals();
  if (key === "/") return handleOperator("÷");
  if (key === "*") return handleOperator("×");
  if (key === "-") return handleOperator("−");
  if (key === "+") return handleOperator("+");
});

createButtons();
render();
