function PublicationButton({ children, isSelected, onSelect }) {
  const areaClass = children.toLowerCase();

  return (
    <button
      className={`publication__button publication__button--${areaClass} ${isSelected ? "is-active" : "is-inactive"}`}
      onClick={onSelect}
    >
      <p>{children}</p>
    </button>
  );
}

export default PublicationButton;
