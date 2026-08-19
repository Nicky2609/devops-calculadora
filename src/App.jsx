import { useEffect, useState } from "react";
import "./App.css";
import { ScientificOperations } from "./ScientificOperations";

const OPERATORS = ["÷", "×", "−", "+"];

function calculate(a, operator, b) {
  const x = parseFloat(a);
  const y = parseFloat(b);
  switch (operator) {
    case "÷":
      return y === 0 ? "Error" : x / y;
    case "×":
      return x * y;
    case "−":
      return x - y;
    case "+":
      return x + y;
    default:
      return y;
  }
}

function formatDisplay(value) {
  if (value === "Error") return value;
  const str = String(value);
  if (str.length > 11) {
    const num = Number(value);
    return num.toExponential(5);
  }
  return str;
}

export default function App() {
  const [display, setDisplay] = useState("0");
  const [previousValue, setPreviousValue] = useState(null);
  const [operator, setOperator] = useState(null);
  const [overwrite, setOverwrite] = useState(true);
  const [history, setHistory] = useState("");

  const inputDigit = (digit) => {
    if (overwrite) {
      setDisplay(digit === "." ? "0." : digit);
      setOverwrite(false);
      return;
    }
    if (digit === "." && display.includes(".")) return;
    if (display === "0" && digit !== ".") {
      setDisplay(digit);
      return;
    }
    setDisplay(display + digit);
  };

  const inputOperator = (nextOperator) => {
    if (operator && !overwrite) {
      const result = calculate(previousValue, operator, display);
      setDisplay(formatDisplay(result));
      setPreviousValue(String(result));
      setHistory(`${formatDisplay(result)} ${nextOperator}`);
    } else {
      setPreviousValue(display);
      setHistory(`${display} ${nextOperator}`);
    }
    setOperator(nextOperator);
    setOverwrite(true);
  };

  const inputEquals = () => {
    if (operator === null || previousValue === null) return;
    const result = calculate(previousValue, operator, display);
    setHistory(`${previousValue} ${operator} ${display} =`);
    setDisplay(formatDisplay(result));
    setPreviousValue(null);
    setOperator(null);
    setOverwrite(true);
  };

  const clearAll = () => {
    setDisplay("0");
    setPreviousValue(null);
    setOperator(null);
    setOverwrite(true);
    setHistory("");
  };

  const toggleSign = () => {
    if (display === "0") return;
    setDisplay(display.startsWith("-") ? display.slice(1) : `-${display}`);
  };

  const inputPercent = () => {
    setDisplay(formatDisplay(parseFloat(display) / 100));
    setOverwrite(true);
  };

  const backspace = () => {
    if (overwrite) return;
    if (display.length <= 1 || (display.length === 2 && display.startsWith("-"))) {
      setDisplay("0");
      setOverwrite(true);
      return;
    }
    setDisplay(display.slice(0, -1));
  };

  const applyUnary = (fn, symbol) => {
    const value = parseFloat(display);
    const result = fn(value);
    const output = Number.isFinite(result) ? result : "Error";
    setHistory(`${symbol}(${display})`);
    setDisplay(formatDisplay(output));
    setOverwrite(true);
  };

  useEffect(() => {
    const handleKeyDown = (event) => {
      const { key } = event;
      if (/^[0-9]$/.test(key)) {
        inputDigit(key);
      } else if (key === ".") {
        inputDigit(".");
      } else if (key === "+") {
        inputOperator("+");
      } else if (key === "-") {
        inputOperator("−");
      } else if (key === "*") {
        inputOperator("×");
      } else if (key === "/") {
        event.preventDefault();
        inputOperator("÷");
      } else if (key === "Enter" || key === "=") {
        inputEquals();
      } else if (key === "Backspace") {
        backspace();
      } else if (key === "Escape") {
        clearAll();
      } else if (key === "%") {
        inputPercent();
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  });

  const scientificKeys = [
    { label: "√", onClick: () => applyUnary(ScientificOperations.sqrt, "√") },
    { label: "x²", onClick: () => applyUnary(ScientificOperations.square, "sq") },
    { label: "sin", onClick: () => applyUnary(ScientificOperations.sin, "sin") },
    { label: "cos", onClick: () => applyUnary(ScientificOperations.cos, "cos") },
    { label: "log", onClick: () => applyUnary(ScientificOperations.log, "log") },
  ];

  const keys = [
    { label: "AC", onClick: clearAll, type: "func" },
    { label: "+/-", onClick: toggleSign, type: "func" },
    { label: "%", onClick: inputPercent, type: "func" },
    { label: "÷", onClick: () => inputOperator("÷"), type: "op" },
    { label: "7", onClick: () => inputDigit("7"), type: "num" },
    { label: "8", onClick: () => inputDigit("8"), type: "num" },
    { label: "9", onClick: () => inputDigit("9"), type: "num" },
    { label: "×", onClick: () => inputOperator("×"), type: "op" },
    { label: "4", onClick: () => inputDigit("4"), type: "num" },
    { label: "5", onClick: () => inputDigit("5"), type: "num" },
    { label: "6", onClick: () => inputDigit("6"), type: "num" },
    { label: "−", onClick: () => inputOperator("−"), type: "op" },
    { label: "1", onClick: () => inputDigit("1"), type: "num" },
    { label: "2", onClick: () => inputDigit("2"), type: "num" },
    { label: "3", onClick: () => inputDigit("3"), type: "num" },
    { label: "+", onClick: () => inputOperator("+"), type: "op" },
    { label: "0", onClick: () => inputDigit("0"), type: "num wide" },
    { label: ".", onClick: () => inputDigit("."), type: "num" },
    { label: "=", onClick: inputEquals, type: "equals" },
  ];

  return (
    <div className="stage">
      <div className="calculator">
        <div className="screen">
          <div className="screen-history">{history || "\u00A0"}</div>
          <div className="screen-value">{display}</div>
        </div>
        <div className="sci-row">
          {scientificKeys.map((key) => (
            <button
              key={key.label}
              className="key key--scientific"
              onClick={key.onClick}
            >
              {key.label}
            </button>
          ))}
        </div>
        <div className="keypad">
          {keys.map((key) => (
            <button
              key={key.label}
              className={`key key--${key.type.split(" ")[0]} ${
                key.type.includes("wide") ? "key--wide" : ""
              }`}
              onClick={key.onClick}
            >
              {key.label}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
