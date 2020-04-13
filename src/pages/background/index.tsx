import React from 'react';
import ReactDOM from 'react-dom';

import Header from '../../components/Header'

import testHelper from 'Lib/helper';

import 'styles/background.scss';

const LandingPage = () => (
  <div className="background-container">
    <Header
      title={`Background page ${testHelper('Marla byverdu')}` }
    />
    <div className="target">xoxo</div>
  </div>
);

export default () => {
  ReactDOM.render(<LandingPage />, document.getElementById('root'))
}
