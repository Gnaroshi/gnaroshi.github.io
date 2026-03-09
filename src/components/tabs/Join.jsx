import { useState } from "react";
import "./Join.css";

function Join() {
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");

  const handleSubmit = (event) => {
    event.preventDefault();
    const to = "jongbinryu@ajou.ac.kr";
    const subject = encodeURIComponent("Lab-LVM Join Inquiry");
    const body = encodeURIComponent(
      `Hello Lab-LVM,\n\nI am interested in joining the lab.\n\nMy email: ${email || "(not provided)"}\n\nMessage:\n${message || "(no message)"}\n`,
    );
    window.location.href = `mailto:${to}?subject=${subject}&body=${body}`;
  };

  return (
    <div className="join">
      <div data-reveal className="tab-header">
        <h1>Join</h1>
      </div>
      <section data-reveal className="join__section">
        <form data-reveal data-reveal-load-delay="80" className="join__form" onSubmit={handleSubmit}>
          <div data-reveal data-reveal-load-delay="120" className="join-email">
            <p>Your Email</p>
            <input
              type="email"
              placeholder="email@example.com"
              value={email}
              onChange={(event) => setEmail(event.target.value)}
              required
            />
          </div>
          <div data-reveal data-reveal-load-delay="160" className="join-message">
            <p>Message</p>
            <textarea
              name="message"
              className="join__message-field"
              value={message}
              onChange={(event) => setMessage(event.target.value)}
              required
            ></textarea>
          </div>
          <div data-reveal data-reveal-load-delay="200" className="join-btn-wrapper">
            <button type="submit" className="btn btn--primary interactive-button lift-on-hover">
              Send Inquiry
            </button>
          </div>
        </form>
      </section>
    </div>
  );
}

export default Join;
