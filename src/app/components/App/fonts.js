import FontFaceObserver from 'fontfaceobserver';

import '../../assets/fonts/inconsolata/webfonts.css';
import '../../assets/fonts/filson-pro/webfonts.css';
import '../../assets/fonts/avenir/webfonts.css';

if (process.env.IS_BROWSER) {
  const fonts = [
    new FontFaceObserver('Inconsolata'),
    new FontFaceObserver('Filson Pro', {weight: 900}),
    new FontFaceObserver('Avenir')
  ];

  fonts.forEach(
    // addFontClass when font loads or when timeout is triggered
    font => font.load().then(addFontClass, addFontClass)
  );
}

function addFontClass({family}) {
  const fontClass = family.toLowerCase().replace(' ', '-');
  document.documentElement.classList.add(`font-loaded:${fontClass}`);
}
