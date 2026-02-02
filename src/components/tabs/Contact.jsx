import emailIcon from "../../assets/icons/email-svgrepo-com.svg";
import "./Contact.css";
function Contact() {
  return (
    <div className="contact">
      <div className="tab-header">
        <h1>Contact</h1>
      </div>
      <div className="contact__body">
        <h2>Ajou University</h2>
        <iframe
          className="contact__map"
          src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d5357.338900879886!2d127.04129122331311!3d37.283889685557014!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x357b5b01481ca7d1%3A0x89aef569dce53536!2z7JWE7KO864yA7ZWZ6rWQIOyCsO2Vme2YkeugpeybkA!5e0!3m2!1sko!2skr!4v1735627049534!5m2!1sko!2skr"
          alt=""
        ></iframe>
        <div className="contact__info">
          <div className="contact__address">
            <h2>Address</h2>
            <span>
              <p>Industry-Academic Cooperation Foundation Building Room 213,</p>
              <p>Department of Computer Science, Ajou University, </p>
              <p>206 World cup-ro, Yeongtong-gu, </p>
              <p>Suwon 16499, Korea.</p>
            </span>
          </div>
          <div className="contact__email">
            <h2>Email</h2>
            <p>jongbinryu@ajou.ac.kr</p>
            <button className="contact__email-button">
              <span className="contact__email-text">Contact us</span>
              <span className="contact__email-icon">
                <img src={emailIcon} alt="" />
              </span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Contact;
