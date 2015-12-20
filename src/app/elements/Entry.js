import React, {Component, PropTypes} from 'react';
if (process.env.IS_BROWSER) require('./Entry.scss');

export default class Entry extends Component {
  static propTypes = {
    title: PropTypes.string.isRequired,
    subtitle: PropTypes.string,
    children: PropTypes.node,
  };

  render() {
    const {title, subtitle, children} = this.props;
    return (
      <article className="entry">
        <div className="entry__body">
          <h1 className="entry__title">
            {title}
          </h1>
          {subtitle && <h2 className="entry__subtitle">
            {subtitle}
          </h2>}
          {children && <div className="entry__content">
            {children}
          </div>}
        </div>
      </article>
    );
  }
}
