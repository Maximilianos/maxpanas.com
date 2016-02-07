import React, {Component, PropTypes} from 'react';

export default class Html extends Component {
  static propTypes = {
    lang: PropTypes.string.isRequired,
    helmet: PropTypes.object.isRequired,
    bodyHtml: PropTypes.string.isRequired,
    cssFilename: PropTypes.string
  };

  render() {
    const {lang, helmet, bodyHtml, cssFilename} = this.props;
    return (
      <html lang={lang}>
        <head>
          {helmet.base.toComponent()}
          <meta charSet="utf-8" />
          <meta name="viewport" content="width=device-width, initial-scale=1" />
          {helmet.title.toComponent()}
          {helmet.meta.toComponent()}
          {helmet.link.toComponent()}
          {cssFilename && <link rel="stylesheet" href={cssFilename} />}
          {helmet.script.toComponent()}
        </head>
        <body dangerouslySetInnerHTML={{__html: bodyHtml}} />
      </html>
    );
  }
}
