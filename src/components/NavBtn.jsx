export default function NavBtn({ children, isSelected, onSelect }) {
  return (
    <button
      className={isSelected ? "nav-btn-active" : undefined}
      onClick={onSelect}
    >
      {children}
    </button>
  );
}
