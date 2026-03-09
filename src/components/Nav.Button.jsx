import { Link } from "react-router-dom";

export default function NavButton({ children, tabKey, isSelected, onSelect }) {
  const to = tabKey === "home" ? "/" : `/${tabKey}`;

  return (
    <Link
      to={to}
      className={`nav__button nav__button--${tabKey} btn btn--sm interactive-button ${isSelected ? "is-active" : ""}`}
      data-tab={tabKey}
      onClick={onSelect}
      aria-current={isSelected ? "page" : undefined}
    >
      {children}
    </Link>
  );
}
