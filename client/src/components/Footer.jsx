import React from 'react';

const Footer = () => {
  return (
    <footer className="bg-dark text-white py-4 mt-5">
      <div className="container">
        <div className="row">
          <div className="col-md-6">
            <h5 className="mb-3">Event Manager</h5>
            <p className="mb-0">Simplify your event planning with our powerful management system</p>
          </div>
          <div className="col-md-6 d-flex justify-content-md-end mt-3 mt-md-0">
            <div>
              <h5>Quick Links</h5>
              <ul className="list-unstyled">
                <li><a href="/" className="text-white text-decoration-none">Home</a></li>
                <li><a href="/create-event" className="text-white text-decoration-none">Create Event</a></li>
                <li><a href="/login" className="text-white text-decoration-none">Login</a></li>
              </ul>
            </div>
          </div>
        </div>
        <hr className="my-4 bg-light" />
        <div className="text-center">
          <p className="mb-0">&copy; {new Date().getFullYear()} Event Manager. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;