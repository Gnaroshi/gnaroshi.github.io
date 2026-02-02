export default function NavButton({ children, isSelected, onSelect }) {
  return (
    <button
      className={`nav__button ${isSelected ? "is-active" : ""}`}
      onClick={onSelect}
    >
      {children}
    </button>
  );
}
