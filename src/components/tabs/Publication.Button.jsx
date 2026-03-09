function PublicationButton({ children, areaKey = "", isSelected, onSelect }) {
  const areaClass = (areaKey || String(children)).toLowerCase();

  return (
    <button
      type="button"
      className={`publication__button publication__button--${areaClass} btn btn--secondary btn--sm interactive-button ${isSelected ? "is-active" : "is-inactive"}`}
      onClick={onSelect}
      aria-pressed={isSelected}
    >
      {children}
    </button>
  );
}

export default PublicationButton;
