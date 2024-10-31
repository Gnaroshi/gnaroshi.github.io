import "./PublicationBtn.css";

function PublicationBtn({ children, isSelected, onSelect }) {
  return (
    <button
      className={
        "publication-btn" +
        " publication-btn-" +
        children.toLowerCase() +
        " " +
        (isSelected ? "publication-btn-active" : undefined)
      }
      onClick={onSelect}
    >
      <p>{children}</p>
    </button>
  );
}

export default PublicationBtn;
