import "./Contact.css";
import HOME_MEDIA_IMAGES from "../../assets/images/home/home_media_index";
import MailIcon from "../icons/MailIcon";

function Contact() {
  const emailAddress = "jongbinryu@ajou.ac.kr";
  const mailSubject = encodeURIComponent("Lab-LVM Inquiry");
  const mailBody = encodeURIComponent(
    "Hello Lab-LVM,\n\nI would like to ask about...\n\nName:\nAffiliation:\n",
  );
  const mapMedia = HOME_MEDIA_IMAGES.research_environment || HOME_MEDIA_IMAGES.intro_meeting_room;

  return (
    <div data-reveal data-reveal-load-delay="60" className="contact">
      <div data-reveal className="tab-header">
        <h1>Contact</h1>
      </div>
      <section data-reveal className="contact__body">
        <header data-reveal data-reveal-load-delay="60" className="contact__header">
          <p className="contact__kicker">Ajou University · Lab-LVM</p>
          <h2>Get in touch with Lab-LVM</h2>
          <p>We welcome collaboration inquiries, student applications, and research partnerships.</p>
        </header>

        <section
          data-reveal
          data-reveal-load-delay="100"
          className="contact__location contact__panel"
        >
          <div className="contact__location-intro">
            <p className="contact__panel-label">Location</p>
            <p className="contact__location-title">
              Industry-Academic Cooperation Foundation, Room 213
            </p>
            <p className="contact__location-copy">
              Lab-LVM is based at Ajou University in Suwon. Use the map for directions and the
              address panel below for mailing and campus delivery details.
            </p>
          </div>

          <div className="contact__location-media">
            {mapMedia ? (
              <figure className="contact__map-media">
                <img src={mapMedia} alt="Lab-LVM building and research environment at Ajou University" />
                <figcaption>Ajou University campus and Lab-LVM environment</figcaption>
              </figure>
            ) : null}
            <div className="contact__map-wrap">
              <iframe
                className="contact__map"
                src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d5357.338900879886!2d127.04129122331311!3d37.283889685557014!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x357b5b01481ca7d1%3A0x89aef569dce53536!2z7JWE7KO864yA7ZWZ6rWQIOyCsO2Vme2YkeugpeybkA!5e0!3m2!1sko!2skr!4v1735627049534!5m2!1sko!2skr"
                title="Ajou University Lab-LVM location map"
                loading="lazy"
              ></iframe>
            </div>
          </div>
        </section>

        <div className="contact__details">
          <section
            data-reveal
            data-reveal-load-delay="140"
            className="contact__panel contact__panel--address"
          >
            <p className="contact__panel-label">Address</p>
            <p className="contact__panel-title">Department of Computer Science, Ajou University</p>
            <address className="contact__address-text">
              Industry-Academic Cooperation Foundation Building Room 213,<br />
              Department of Computer Science, Ajou University,<br />
              206 World cup-ro, Yeongtong-gu,<br />
              Suwon 16499, Korea
            </address>
          </section>

          <article
            data-reveal
            data-reveal-load-delay="180"
            className="contact__panel contact__panel--email"
          >
            <p className="contact__panel-label">Email</p>
            <p className="contact__panel-title">General inquiries</p>
            <a className="contact__email-link btn btn--tertiary animated-underline" href={`mailto:${emailAddress}`}>
              {emailAddress}
            </a>
            <p className="contact__email-note">
              For collaboration, admissions, and project inquiries, please include your affiliation
              and topic.
            </p>
            <div className="contact__email-cta">
              <a
                className="contact__email-button btn btn--primary interactive-button lift-on-hover"
                href={`mailto:${emailAddress}?subject=${mailSubject}&body=${mailBody}`}
              >
                <span className="contact__email-text">Contact us</span>
                <span className="contact__email-icon">
                  <MailIcon className="icon-mail" />
                </span>
              </a>
            </div>
          </article>
        </div>
      </section>
    </div>
  );
}

export default Contact;
