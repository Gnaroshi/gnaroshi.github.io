import "./People.css";
import PEOPLE_INFO from "../../assets/dataset/people.json";
import PEOPLE_IMG from "../../assets/images/people/people_image_index.js";
import PeopleCard from "./People.Card";

function People() {
  return (
    <div className="people">
      <div className="tab-header">
        <h1>People</h1>
      </div>

      <div className="people__degree-header">
        <h2>Professor</h2>
      </div>

      <div className="people__card-grid">
        {PEOPLE_INFO.professor.map((p, i) => (
          <PeopleCard
            key={i}
            profile={PEOPLE_IMG.professor[i]}
            name={p.name}
            email={p.email}
          />
        ))}
      </div>

      <div className="people__degree-header">
        <h2>Intergrated M.S and Ph.D</h2>
      </div>
      <div className="people__card-grid">
        {PEOPLE_INFO.intergrated_mp.map((p, i) => (
          <PeopleCard
            key={i}
            profile={PEOPLE_IMG.intergrated_mp[i]}
            name={p.name}
            email={p.email}
            research_interest={p.research_interests}
          />
        ))}
      </div>

      <div className="people__degree-header">
        <h2>M.S</h2>
      </div>
      <div className="people__card-grid">
        {PEOPLE_INFO.master.map((p, i) => (
          <PeopleCard
            key={i}
            profile={PEOPLE_IMG.master[i]}
            name={p.name}
            email={p.email}
            research_interest={p.research_interests}
          />
        ))}
      </div>

      <div className="people__degree-header">
        <h2>Intern</h2>
      </div>
      <div className="people__card-grid">
        {PEOPLE_INFO.intern.map((p, i) => (
          <PeopleCard
            key={i}
            profile={PEOPLE_IMG.intern[i]}
            name={p.name}
            email={p.email}
            research_interest={p.research_interests}
          />
        ))}
      </div>
    </div>
  );
}

export default People;
