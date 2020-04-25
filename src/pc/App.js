import React, { Component } from 'react';
import './App.css';
import MapContent from './MapContent';
import Top from './include/Top.js';

class App extends Component {
  constructor(props){
    super(props)
    this.handleSearchResultChange = this.handleSearchResultChange.bind(this)
    this.handleNowLonLatChange = this.handleNowLonLatChange.bind(this)
  }

  componentWillMount(){
    document.title = "헬스닷컴"
    this.setState({
      searchResult: null,
      nowLon: null,
      nowLat: null
    })
  }

  // searchResult state 넘겨받기
  handleSearchResultChange(searchResult){
    this.setState({searchResult: searchResult})
  }

  // 현재위치 넘겨받기
  handleNowLonLatChange(nowLon, nowLat){
    this.setState({
      nowLon: nowLon,
      nowLat: nowLat
    })
  }

  // Google analytics
  componentDidMount(){
    this.props.pageView('/PC')
  }

  render() {
    return (
      <div className='wrap'>
        <Top key='top'
          onSearchResultChange={this.handleSearchResultChange}
          nowLon={this.state.nowLon}
          nowLat={this.state.nowLat} />
        <MapContent key='mapContent'
          searchResult={this.state.searchResult}
          onSearchResultChange={this.handleSearchResultChange}
          onNowLonLatChange={this.handleNowLonLatChange}
          pageView={this.props.pageView} />
      </div>
    );
  }
}

export default App;
