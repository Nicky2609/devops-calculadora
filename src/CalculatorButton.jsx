export default function CalculatorButton({ label, onClick, type }) {
  const buttonClass = label === "AC" ? "danger" : type.split(" ")[0];

  return (
    <button
      className={`key key--${buttonClass} ${
        type.includes("wide") ? "key--wide" : ""
      }`}
      onClick={onClick}
    >
      {label}
    </button>
  );
}
