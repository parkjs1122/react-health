import React from 'react';
import ReactDOM from 'react-dom';
import 'bootstrap/dist/css/bootstrap.css'
import './index.css';
import PcApp from './pc/App';
import MobileApp from './mobile/App';
import * as serviceWorker from './serviceWorker';
import { isMobile } from 'react-device-detect';

// Google analytics 초기화
var ReactGA = require('react-ga');
ReactGA.initialize('UA-164536899-1');

// Google analytics 페이지뷰 함수
function pageView(page) {
  ReactGA.set({ page: page });
  ReactGA.pageview(page);
}

ReactDOM.render(
  <React.StrictMode>
    {isMobile ? <MobileApp pageView={pageView} /> : <PcApp pageView={pageView} />}
  </React.StrictMode>,
  document.getElementById('root')
);

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA
serviceWorker.unregister();
