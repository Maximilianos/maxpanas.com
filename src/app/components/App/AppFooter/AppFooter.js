import React from 'react';

import Copy from './Copy';

import './AppFooter.scss';

function AppFooter() {
  return (
    <footer className="app-footer">
      {/* Copyright */}
      <Copy start={2014} /> Max GJ Panas
    </footer>
  );
}

export default AppFooter;
