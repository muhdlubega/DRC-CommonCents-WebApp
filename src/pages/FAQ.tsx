import { FAQArray } from "./FAQArray";
import "../styles/main.scss";
import { Link } from "react-router-dom";

const FAQ = () => {
  return (
    <div className="faq-title">
      <h5 className="title2">Frequently Asked Questions</h5>
      <div className="faq-container">
        {FAQArray.map((faqItem, index) => (
          <div className={`faq-card ${index === 2 ? 'large-card' : ''}`}key={index}>
            <div className="faq-icon">{faqItem.icon}</div>
            <div className="faq-content">
              <h3>{faqItem.title}</h3>
              <p>{faqItem.Description}</p>
            </div>
          </div>
        )
      )}
      </div>
      <p className="contact-text">
        Can't find your answers here? Get in touch with us <Link to="/enquiry">here</Link>
      </p>
    </div>
  );
};

export default FAQ;