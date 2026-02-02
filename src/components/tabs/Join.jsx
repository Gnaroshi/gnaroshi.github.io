import "./Join.css";

function Join() {
  return (
    <div className="join">
      <h1>join</h1>
      <section className="join__section">
        <form className="join__form" action="">
          <div className="join-email">
            <p>Your Email</p>
            <input type="email" placeholder="email@example.com" />
          </div>
          <div className="join-message">
            <p>Message</p>
            <textarea name="message" className="join__message-field"></textarea>
          </div>
          <div className="join-btn-wrapper">
            <button type="submit">submit</button>
          </div>
        </form>
      </section>
    </div>
  );
}

export default Join;
