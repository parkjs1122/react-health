import React, { Component } from 'react';
import './App.css';
import MapContent from './MapContent';
import Top from './include/Top.js';

class App extends Component {
  componentDidMount(){
    document.title = "헬스닷컴"
  }

  render() {
    return (
      <div className='wrap'>
        <Top key='top' />
        <MapContent key='mapContent' />
      </div>
    );
  }
}

export default App;
