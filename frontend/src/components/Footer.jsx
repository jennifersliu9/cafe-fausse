import { contactInfo } from '../data/contact'
import NewsletterForm from './NewsletterForm'
import './Footer.css'

function Footer() {
  return (
    <footer className="site-footer">
      <div className="container footer-grid">
        <div className="footer-contact">
          <h2>{contactInfo.name}</h2>
          <p>{contactInfo.address}</p>
          <p>{contactInfo.phone}</p>
          <p>{contactInfo.hours.weekday}</p>
          <p>{contactInfo.hours.sunday}</p>
        </div>

        <div>
          <h3>Stay Connected</h3>
          <p>Join our newsletter for seasonal menus, events, and exclusive offers.</p>
          <NewsletterForm compact />
        </div>
      </div>
      <p className="footer-copy">© {new Date().getFullYear()} Café Fausse. All rights reserved.</p>
    </footer>
  )
}

export default Footer
