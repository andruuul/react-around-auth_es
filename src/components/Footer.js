import React from 'react';

const year = new Date().getFullYear()

function Footer() {
  return (
    <footer className="footer">
      <p className="footer__copyright">&copy; {year}. Alrededor de los EEUU</p>
    </footer>
  );
}
  
export default Footer;