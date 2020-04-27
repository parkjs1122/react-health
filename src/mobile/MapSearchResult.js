/*global kakao*/
import React, { Component } from "react";
import { Card, Badge, FormControl, Navbar, Image } from "react-bootstrap";
import { getDistance } from 'geolib';
import debounce from 'lodash.debounce';
import { usePromiseTracker, trackPromise } from "react-promise-tracker";
import Loader from 'react-promise-loader';

class MapSearchResult extends Component {

    constructor(){
        super()
        this.onChangeDebounced = debounce(this.onChangeDebounced, 300)
    }

    componentWillMount(){
        this.setState({searchResult: null})
    }

    onChangeDebounced = (value) => {
        if(value){
            trackPromise(fetch(process.env.REACT_APP_SERVER_HOST + '/gym/get/name/' + value + '/' + this.props.nowLon + '/' + this.props.nowLat))
            .then(response => response.json())
            .then(data => {
                this.setState({searchResult: data})
            })
        }
    }

    handleChange = (e) => {
        this.onChangeDebounced(e.target.value)
    }

    render() {
        const resultList = (this.state.searchResult) ? (this.state.searchResult.map((gym, index) => (
            <Card className="mb-2">
                <Card.Body className="searchResultCard" onClick={() => {
                    this.props.map.panTo(new kakao.maps.LatLng(parseFloat(gym.location.coordinates[1]), parseFloat(gym.location.coordinates[0])))
                    let center = this.props.map.getCenter();
                    this.props._getMarkers(center.getLng(), center.getLat(), 1)
                    this.props.onIsSearchModeChange(false)
                }}>
                    <Card.Title>{gym.name} {(gym.dailyUse > 0) ? <Badge variant="secondary">일일입장가능</Badge> : ''}</Card.Title>
                    <Card.Subtitle className="mb-2 text-muted">{gym.address}</Card.Subtitle>
                    <Card.Text>현재 지도로 부터 {getDistance(
                        { latitude: gym.location.coordinates[1], longitude: gym.location.coordinates[0] },
                        { latitude: this.props.nowLat, longitude: this.props.nowLon }, 100
                    ) / 1000}km</Card.Text>
                </Card.Body>
            </Card>
        ))) : null
        return (
            <div className="searchResult">
                <Loader type="ThreeDots" background="none" color="#666" promiseTracker={usePromiseTracker} />
                <Navbar bg="light" variant="light">
                    <Image
                        alt="뒤로가기"
                        src="/image/left-arrow.png"
                        width="30"
                        height="30"
                        className="d-inline-block align-top"
                        onClick={() => {
                            this.props.onIsSearchModeChange(false)
                        }}
                    />
                    <FormControl
                        type="search"
                        name="searchText"
                        onChange={this.handleChange}
                        placeholder="헬스장 이름"
                        className="ml-2" />
                </Navbar>
                <div className="gymList p-2">
                    {resultList}
                </div>
            </div>
        );
    }
}
  
export default MapSearchResult