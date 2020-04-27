/*global kakao*/
import React, { Component } from "react";
import { Card, Badge } from "react-bootstrap";
import { getDistance } from 'geolib';

class MapSearchResult extends Component {
    render() {
        const resultList = this.props.gym.map((gym, index) => (
            <Card className="mb-2">
                <Card.Body className="searchResultCard" onClick={() => {
                    this.props.map.panTo(new kakao.maps.LatLng(parseFloat(gym.location.coordinates[1]), parseFloat(gym.location.coordinates[0])))
                    let center = this.props.map.getCenter();
                    this.props._getMarkers(center.getLng(), center.getLat(), 1)
                }}>
                    <Card.Title>{gym.name} {(gym.dailyUse > 0) ? <Badge variant="secondary">일일입장가능</Badge> : ''}</Card.Title>
                    <Card.Subtitle className="mb-2 text-muted">{gym.address}</Card.Subtitle>
                    <Card.Text>현재 지도로 부터 {getDistance(
                        { latitude: gym.location.coordinates[1], longitude: gym.location.coordinates[0] },
                        { latitude: this.props.nowLat, longitude: this.props.nowLon }, 100
                    ) / 1000}km</Card.Text>
                </Card.Body>
            </Card>
        ))
        return (
            <div className='leftPage'>
                <Card>
                <Card.Header><strong>검색 결과 ({this.props.gym.length}건)</strong></Card.Header>
                    <Card.Body className='gymList'>
                    {resultList}
                    </Card.Body>
                </Card>
            </div>
        );
    }
}
  
export default MapSearchResult