import React from 'react';
import ReactDOM from 'react-dom';

import Header from '../../components/Header'

import testHelper from 'Lib/helper';
import 'styles/popup.scss';

const LandingPage = () => (
	<div className="popup-container">
		<Header title={`Popup page ${testHelper('Albert byverdu')}` }/>
		<div className="test" />
		<button className="target">Open full history</button>
		<button className="clear">clear</button>
	</div>
);

export default () => {
  ReactDOM.render(<LandingPage />, document.getElementById('root'))
}
