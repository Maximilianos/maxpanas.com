import React, {Component, PropTypes} from 'react';

export default class Html extends Component {
  static propTypes = {
    lang: PropTypes.string.isRequired,
    bodyHtml: PropTypes.string.isRequired,
  };

  render() {
    const {lang, bodyHtml} = this.props;
    return (
      <html lang={lang}>
        <head>
          <meta charSet="utf-8" />
          <meta name="viewport" content="width=device-width, initial-scale: 1" />
        </head>
        <body dangerouslySetInnerHTML={{__html: bodyHtml}} />
      </html>
    );
  }
}
