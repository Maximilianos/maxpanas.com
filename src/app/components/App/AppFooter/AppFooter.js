import React from 'react';

import Copy from './Copy';

import './AppFooter.scss';


export default function AppFooter() {
  return (
    <footer className="app-footer">
      {/* Copyright */}
      <Copy start={2016} /> Max GJ Panas
    </footer>
  );
}
