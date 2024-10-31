import "./PeopleCard.css";

function PeopleCard({
  profile,
  name,
  email,
  research_interest = null,
  current_position = null,
}) {
  return (
    <div className="people-card">
      {/* <div */}
      {/*   className="people-card-profile" */}
      {/*   style={{ */}
      {/*     backgroundImage: `url(${profile})`, */}
      {/*   }} */}
      {/* > */}
      {/*   <img src={profile} alt="" /> */}
      {/* </div> */}
      <div className="people-card-profile">
        <img src={profile} alt="" />
      </div>

      <div className="people-card-info">
        <h1>{name}</h1>
        <p>{email}</p>
        <div className="people-card-dividor"></div>
        {research_interest !== null && (
          <div className="additional-info-wrapper">
            <h2>Research Interests</h2>
            {research_interest.map((item, i) => (
              <p key={i}>{item}</p>
            ))}
          </div>
        )}
        {current_position !== null && (
          <div className="additional-info-wrapper">
            <h2>Current Position</h2>
            {current_position.map((item, i) => (
              <p key={i}>{item}</p>
            ))}
          </div>
        )}
      </div>
    </div>
  );
  // return (
  //   <div className="people-card">
  //     <div>
  //       <img src="" alt="" />
  //     </div>
  //     <div>
  //       <h1>Sungeun Kim</h1>
  //       <p>kimsungeun@ajou.ac.kr</p>
  //       <div className="research-interests-wrapper">
  //         <h2>research interests</h2>
  //         <p>Computer Vision</p>
  //         <p>Image Hashing</p>
  //       </div>
  //     </div>
  //   </div>
  // );
}

export default PeopleCard;
