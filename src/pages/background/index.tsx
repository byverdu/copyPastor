import React from 'react';
import ReactDOM from 'react-dom';

import Header from '../../components/Header'

import testHelper from '../../lib/helper';
import styles from '../styles/background.scss';

const LandingPage = () => (
  <div className={styles["background-container"]}>
    <Header
      title={`Background page ${testHelper('Marla byverdu')}` }
    />
    <div className="target">xoxo</div>
  </div>
);

export default () => {
  ReactDOM.render(<LandingPage />, document.getElementById('root'))
}
