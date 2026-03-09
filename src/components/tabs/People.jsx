import "./People.css";
import PeopleCard from "./People.Card";
import PeopleProfessorCard from "./People.ProfessorCard";
import { getPeopleSections } from "../../utils/peopleData";

function People() {
  const sections = getPeopleSections();
  const showResearch = new Set(["intergrated_mp", "phd", "master", "intern"]);
  const showCurrentPosition = new Set(["alumni"]);

  return (
    <div data-reveal data-reveal-load-delay="60" className="people">
      <div data-reveal className="tab-header">
        <h1>People</h1>
      </div>
      {sections.map((section) => (
        <section data-reveal key={section.key} className="people__section">
          <div className="people__degree-header">
            <h2>{section.title}</h2>
          </div>
          {section.people.length > 0 ? (
            <div
              className={`people__card-grid ${section.key === "professor" ? "people__card-grid--professor" : ""}`}
            >
              {section.people.map((person, i) => (
                section.key === "professor" ? (
                  <PeopleProfessorCard
                    key={`${section.key}-${person.id}`}
                    profile={person.image}
                    name={person.name}
                    email={person.email}
                    homepage={person.homepage}
                    position={person.position}
                    links={person.links}
                    profileDetails={person.profile_details}
                    research_interest={person.research_interests}
                    revealDelay={`${Math.min(i, 5) * 60}ms`}
                    revealLoadDelay={`${100 + Math.min(i, 5) * 60}`}
                  />
                ) : (
                  <PeopleCard
                    key={`${section.key}-${person.id}`}
                    profile={person.image}
                    name={person.name}
                    email={person.email}
                    homepage={person.homepage}
                    links={person.links}
                    revealDelay={`${Math.min(i, 5) * 60}ms`}
                    revealLoadDelay={`${100 + Math.min(i, 5) * 60}`}
                    research_interest={showResearch.has(section.key) ? person.research_interests : null}
                    current_position={showCurrentPosition.has(section.key) ? person.current_position : null}
                  />
                )
              ))}
            </div>
          ) : (
            <div className="people__empty">
              <p>No entries currently listed in this section.</p>
            </div>
          )}
        </section>
      ))}
    </div>
  );
}

export default People;
