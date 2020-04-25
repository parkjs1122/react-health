import React, { Component } from 'react';
import './App.css';
import MapContent from './MapContent';
import Top from './include/Top.js';
import Div100vh from 'react-div-100vh';

class App extends Component {
  constructor(props){
    super(props)
    this.handleIsSearchModeChange = this.handleIsSearchModeChange.bind(this)
    this.handleNowLonLatChange = this.handleNowLonLatChange.bind(this)
  }

  componentWillMount(){
    document.title = "헬스닷컴"
    this.setState({
      isSearchMode: null,
      nowLon: null,
      nowLat: null
    })
  }

  // isSearchMode state 넘겨받기
  handleIsSearchModeChange(isSearchMode){
    this.setState({isSearchMode: isSearchMode})
  }

  // 현재위치 넘겨받기
  handleNowLonLatChange(nowLon, nowLat){
    this.setState({
      nowLon: nowLon,
      nowLat: nowLat
    })
  }

  render() {
    return (
      <Div100vh className='wrap'>
        <Top key='top'
          onIsSearchModeChange={this.handleIsSearchModeChange}
          nowLon={this.state.nowLon}
          nowLat={this.state.nowLat} />
        <MapContent key='mapContent'
          isSearchMode={this.state.isSearchMode}
          onIsSearchModeChange={this.handleIsSearchModeChange}
          onNowLonLatChange={this.handleNowLonLatChange}/>
      </Div100vh>
    );
  }
}

export default App;
