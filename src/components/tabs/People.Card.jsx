import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faBookOpen,
  faEnvelope,
  faGlobe,
  faLightbulb,
  faUser,
} from "@fortawesome/free-solid-svg-icons";
import { Link } from "react-router-dom";
import { SOCIAL_ITEMS, isValidExternalLink } from "./peopleCardShared";

function PeopleCard({
  profile,
  name,
  email,
  homepage = "",
  links = {},
  research_interest = null,
  current_position = null,
  revealDelay = "0ms",
  revealLoadDelay = "80",
}) {
  const nameText = name?.trim() ?? "";
  const emailText = email?.trim() ?? "";
  const homepageText = homepage?.trim() ?? "";
  const publicationSearchLink = nameText
    ? `/publication?q=${encodeURIComponent(nameText)}&scope=title-authors`
    : "/publication";

  const hasHomepageLink = isValidExternalLink(homepageText);
  const hasResearchInterests = Array.isArray(research_interest) && research_interest.length > 0;
  const hasCurrentPosition = Array.isArray(current_position) && current_position.length > 0;
  const infoLabel = hasCurrentPosition ? "Current position" : "Research interests";
  const infoItems = hasCurrentPosition
    ? current_position
    : hasResearchInterests
      ? research_interest
      : ["Not listed"];

  return (
    <article
      data-reveal
      data-reveal-load-delay={revealLoadDelay}
      style={{ "--reveal-delay": revealDelay }}
      className="people__member-card interactive-card"
    >
      <div className="people__member-main">
        <div className="people__member-photo">
          {profile ? <img src={profile} alt={nameText} /> : <span>{nameText?.[0]}</span>}
        </div>

        <div className="people__member-content">
          <div className="people__member-header">
            <h3 className="people__meta-line people__meta-line--name">
              <span className="people__meta-icon" aria-hidden="true">
                <FontAwesomeIcon icon={faUser} />
              </span>
              <span>{nameText}</span>
            </h3>
            <div className="people__social-links" aria-label={`${nameText} personal links`}>
              {SOCIAL_ITEMS.map((item) => {
                const url = typeof links?.[item.key] === "string" ? links[item.key].trim() : "";
                const isEnabled = isValidExternalLink(url);

                if (!isEnabled) {
                  return (
                    <span
                      key={item.key}
                      className="people__social-link people__social-link--disabled btn btn--icon btn--sm is-disabled"
                      aria-hidden="true"
                    >
                      <FontAwesomeIcon icon={item.icon} />
                    </span>
                  );
                }

                return (
                  <a
                    key={item.key}
                    href={url}
                    target="_blank"
                    rel="noreferrer"
                    className={`people__social-link people__social-link--${item.key} btn btn--icon btn--sm interactive-button`}
                    aria-label={`${nameText} ${item.label}`}
                  >
                    <FontAwesomeIcon icon={item.icon} />
                  </a>
                );
              })}
            </div>
          </div>

          {emailText ? (
            <a className="people__meta-line people__member-email" href={`mailto:${emailText}`}>
              <span className="people__meta-icon" aria-hidden="true">
                <FontAwesomeIcon icon={faEnvelope} />
              </span>
              <span>{emailText}</span>
            </a>
          ) : (
            <p className="people__meta-line people__member-email people__member-email--empty">
              <span className="people__meta-icon" aria-hidden="true">
                <FontAwesomeIcon icon={faEnvelope} />
              </span>
              <span>Email not listed</span>
            </p>
          )}

          <div className="people__member-actions">
            {hasHomepageLink ? (
              <a
                href={homepageText}
                target="_blank"
                rel="noreferrer"
                className="people__meta-action people__meta-action--homepage btn btn--tertiary animated-underline"
                aria-label={`${nameText} official page`}
              >
                <span className="people__meta-action-icon" aria-hidden="true">
                  <FontAwesomeIcon icon={faGlobe} />
                </span>
                <span>Official page</span>
              </a>
            ) : (
              <span className="people__meta-action-placeholder" aria-hidden="true">
                Official page not listed
              </span>
            )}
            <Link
              to={publicationSearchLink}
              className="people__meta-action people__meta-action--publication btn btn--tertiary animated-underline"
              aria-label={`Search publications by ${nameText}`}
            >
              <span className="people__meta-action-icon" aria-hidden="true">
                <FontAwesomeIcon icon={faBookOpen} />
              </span>
              <span>View publications</span>
            </Link>
          </div>

          <div className="people__member-divider" />

          <div className="people__member-info">
            <h4 className="people__card-subheading">
              <span className="people__card-subheading-icon" aria-hidden="true">
                <FontAwesomeIcon icon={faLightbulb} />
              </span>
              <span>{infoLabel}</span>
            </h4>
            <div className="people__interest-list">
              {infoItems.map((item, i) => (
                <span key={i} className="people__interest-chip">
                  {item}
                </span>
              ))}
            </div>
          </div>
        </div>
      </div>
    </article>
  );
}

export default PeopleCard;
