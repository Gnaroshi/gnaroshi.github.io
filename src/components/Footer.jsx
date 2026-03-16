import "./Footer.css";

function Footer() {
  return (
    <footer className="footer site-shell" aria-labelledby="site-footer-title">
      <div className="footer__inner">
        <section className="footer__panel">
          <div className="footer__identity">
            <p className="footer__kicker">Lab-LVM · Ajou University</p>
            <p id="site-footer-title" className="footer__title">
              Vision and Multimodal AI Lab
            </p>
          </div>

          <div className="footer__meta-grid">
            <section className="footer__group" aria-labelledby="footer-contact-title">
              <h2 id="footer-contact-title" className="footer__group-title">
                Contact
              </h2>
              <a
                className="footer__link"
                href="mailto:jongbinryu@ajou.ac.kr"
              >
                jongbinryu@ajou.ac.kr
              </a>
            </section>

            <section className="footer__group" aria-labelledby="footer-address-title">
              <h2 id="footer-address-title" className="footer__group-title">
                Address
              </h2>
              <address className="footer__text footer__address">
                16499, Industry-University Cooperation, 206, World cup-ro,
                Yeongtong-gu, Suwon-si, Gyeonggi-do, Republic of Korea
              </address>
            </section>
          </div>

          <div className="footer__bottom">
            <p className="footer__copyright">
              © 2024 Lab-LVM, Department of Artificial Intelligence, Ajou University
            </p>
          </div>
        </section>
      </div>
    </footer>
  );
}

export default Footer;
