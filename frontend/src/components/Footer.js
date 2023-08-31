import React from 'react';

const Footer = () => {
  return (
    <footer className="bg-dark text-light text-center py-3">
      <div className="container">
        <p className="m-0" style={{ fontSize: '0.9rem' }}>
          &copy; {new Date().getFullYear()} EventPlaza. All rights reserved.
        </p>
      </div>
    </footer>
  );
};

export default Footer;
