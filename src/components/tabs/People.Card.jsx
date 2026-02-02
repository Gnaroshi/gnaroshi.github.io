function PeopleCard({
  profile,
  name,
  email,
  research_interest = null,
  current_position = null,
}) {
  return (
    <div className="people__card">
      <div className="people__card-profile">
        <img src={profile} alt="" />
      </div>

      <div className="people__card-info">
        <h1>{name}</h1>
        <p className="people__card-email">{email}</p>
        <div className="people__card-divider"></div>
        {research_interest !== null && (
          <div className="people__card-additional-info">
            {research_interest.map((item, i) => (
              <p key={i}>{item}</p>
            ))}
          </div>
        )}
        {current_position !== null && (
          <div className="people__card-additional-info">
            <h2>Current Position</h2>
            {current_position.map((item, i) => (
              <p key={i}>{item}</p>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

export default PeopleCard;
