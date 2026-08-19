export default function MemoryButton({ label, onClick, active }) {
	return (
		<button
			type="button"
			className={`key key--memory${active ? " key--memory-active" : ""}`}
			onClick={onClick}
			aria-label={label}
			aria-pressed={active}
		>
			{label}
		</button>
	);
}
