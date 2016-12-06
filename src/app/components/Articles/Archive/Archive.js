import React, {PropTypes} from 'react';
import Teaser from '../../../containers/Teaser';
import Loader from '../../Loader/Loader';

import './Archive.scss';


Archive.propTypes = {
  fetching: PropTypes.bool,
  error: PropTypes.object,
  title: PropTypes.string,
  archive: PropTypes.arrayOf(PropTypes.string)
};
export default function Archive({fetching, error, title, archive}) {
  let modifier;
  let content;

  if (fetching) {
    modifier = 'loading';
    content = <div className="archive__message"><Loader />Loading<Loader /></div>;
  } else if (error || !archive) {
    modifier = 'error';
    content = <div className="archive__message">Error Loading Archive.</div>;
  } else if (!archive.length) {
    modifier = 'empty';
    content = <div className="archive__message">There are no articles in this archive</div>;
  } else {
    modifier = 'list';
    content = (
      <ul className="archive__list">
        {archive.map(article => (
          <li key={article} className="archive__item">
            <Teaser article={article} />
          </li>
        ))}
      </ul>
    );
  }

  return (
    <section className={`archive archive--${modifier}`}>
      {title && <h2 className="archive__title">
        {title}
      </h2>}
      {content}
    </section>
  );
}
