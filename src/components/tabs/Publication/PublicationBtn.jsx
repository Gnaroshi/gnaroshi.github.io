import "./PublicationBtn.css";

function PublicationBtn({ children, isSelected, onSelect }) {
  return (
    <button
      className={isSelected ? "publication-btn-active" : undefined}
      onClick={onSelect}
    >
      {children}
    </button>
  );
}

export default PublicationBtn;
