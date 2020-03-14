import React from 'react';
import ReactDOM from 'react-dom';

import Header from '../../components/Header'

import testHelper from '../../lib/helper';
import styles from '../styles/popup.scss';

const LandingPage = () => (
  <div className={styles["popup-container"]}>
    <Header
      title={`Popup page ${testHelper('Albert byverdu')}` }
    />
    <div className="target">xoxo</div>
  </div>
);

export default () => {
  ReactDOM.render(<LandingPage />, document.getElementById('root'))
}
