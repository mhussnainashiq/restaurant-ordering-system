import { Link } from 'react-router-dom';
import { Phone, Mail, MapPin, Clock } from 'lucide-react';
import { restaurantInfo } from '../data/restaurantData';

function Footer() {
  return (
    <footer className="footer">
      <div className="container footer-grid">
        {/* Brand */}
        <div className="footer-col">
          <h3 className="footer-brand">{restaurantInfo.name}</h3>
          <p className="footer-tagline">{restaurantInfo.tagline}</p>
        </div>

        {/* Quick Links */}
        <div className="footer-col">
          <h4>Quick Links</h4>
          <ul>
            <li><Link to="/">Home</Link></li>
            <li><Link to="/menu">Menu</Link></li>
            <li><Link to="/orders">My Orders</Link></li>
            <li><Link to="/account">Account</Link></li>
          </ul>
        </div>

        {/* Opening Hours */}
        <div className="footer-col">
          <h4>Opening Hours</h4>
          <ul className="hours-list">
            {restaurantInfo.openingHours.map((item, index) => (
              <li key={index}>
                <Clock size={16} />
                <span>
                  <strong>{item.day}</strong>
                  <br />
                  {item.time}
                </span>
              </li>
            ))}
          </ul>
        </div>

        {/* Contact */}
        <div className="footer-col">
          <h4>Contact Us</h4>
          <ul className="contact-list">
            <li>
              <Phone size={16} />
              <span>{restaurantInfo.phone}</span>
            </li>
            <li>
              <Mail size={16} />
              <span>{restaurantInfo.email}</span>
            </li>
            <li>
              <MapPin size={16} />
              <span>{restaurantInfo.address}</span>
            </li>
          </ul>
        </div>
      </div>

      <div className="footer-bottom">
        <div className="container">
          <p>© {new Date().getFullYear()} {restaurantInfo.name}. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
}

export default Footer;