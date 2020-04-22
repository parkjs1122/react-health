/*global kakao*/
import React, { Component } from "react";
import styled from "styled-components";
import './MapContent.css';
import ZymContent from './ZymContent';
import ZymUpdate from './ZymUpdate';
import ZymInsert from './ZymInsert';
import MapFilter from './MapFilter';

class MapContent extends Component {

    constructor(props){
        super(props)
        this.handleSelectedZymChange = this.handleSelectedZymChange.bind(this);
        this.handleFilterChange = this.handleFilterChange.bind(this);
        this.handleIsUpdateModeChange = this.handleIsUpdateModeChange.bind(this);
        this.handleIsInsertModeChange = this.handleIsInsertModeChange.bind(this);
    }

    componentWillMount(){
        this.setState({
            map: null,
            container: null,
            markers: [],
            zymOverlays: [],
            selectedZym: null,
            insertedZym: null,
            isUpdateMode: false,
            isInsertMode: false,
            isDailyUse: false,
            isYogaRoom: false,
            isPowerRack: false,
            warningOverlay: null
        })
    }

    // selectedZym 넘겨받은 후 지도 재탐색
    handleSelectedZymChange(zym){
        this.setState({selectedZym: zym})
        let center = this.state.map.getCenter();
        this._getMarkers(center.getLng(), center.getLat(), 1)
    }

    // 필터 체크박스 클릭 시 state 변경
    handleFilterChange(target, data){
        if(target === 'isDailyUse'){
            this.setState({isDailyUse: data})
        }else if(target === 'isYogaRoom'){
            this.setState({isYogaRoom: data})
        }else if(target === 'isPowerRack'){
            this.setState({isPowerRack: data})
        }

        let center = this.state.map.getCenter();
        this._getMarkers(center.getLng(), center.getLat(), 1)
    }
    
    // isUpdateMode 넘겨받기
    handleIsUpdateModeChange(isUpdateMode){
        this.setState({isUpdateMode: isUpdateMode})
    }

    // isInsertMode 넘겨받기
    handleIsInsertModeChange(isInsertMode){
        this.setState({isInsertMode: isInsertMode})
    }

    _getMarkers = (lon, lat, distance) => {
        this._removeMarkers() // 기존 마커 모두 지우기
        if(this.state.warningOverlay){
            this.state.warningOverlay.setMap(null);
        }

        let level = this.state.map.getLevel();
        if (level > 4) {
            this.setState({warningOverlay: new kakao.maps.CustomOverlay({
                map: this.state.map,
                content: '<div class="levelWarning">지도를 확대해주세요.</div>',
                position: new kakao.maps.LatLng(this.state.map.getCenter().getLat(), this.state.map.getCenter().getLng()) // 커스텀 오버레이를 표시할 좌표
            })}) 
            return true
        }

        return fetch('http://localhost:8080/gym/get/location?latitude=' + lat + '&longitude=' + lon + '&distance=' + distance)
            .then(response => response.json())
            .then((json) => {
                json.map((zym, i) => {
                    let imageSrc = "/image/gym.png"
                    let imageSize = new kakao.maps.Size(50, 50)
                    let markerImage = new kakao.maps.MarkerImage(imageSrc, imageSize)
                    // 커스텀 오버레이
                    let content = '<div class="customoverlay">' +
                        '    <span class="title">' + zym.name + '</span>' +
                        '</div>';

                    // 필터링
                    let isFiltered = false

                    if(this.state.isDailyUse && zym.dailyUse === 0){
                        isFiltered = true
                    }
                    if(this.state.isYogaRoom && zym.yogaRoom === 0){
                        isFiltered = true
                    }
                    if(this.state.isPowerRack && zym.powerRack === 0){
                        isFiltered = true
                    }

                    // 필터에 적합한 경우
                    if(!isFiltered){
                        let marker = new kakao.maps.Marker({
                            map: this.state.map, // 마커를 표시할 지도
                            position: new kakao.maps.LatLng(parseFloat(zym.location.coordinates[1]), parseFloat(zym.location.coordinates[0])), // 마커를 표시할 위치
                            title: zym.name, // 마커의 타이틀, 마커에 마우스를 올리면 타이틀이 표시됩니다
                            image: markerImage,
                            zIndex: 100,
                            clickable: true 
                        });
                        
                        // 마커 클릭하면 헬스장 정보가 나오도록 이벤트 리스너 등록
                        kakao.maps.event.addListener(marker, 'click', () => {
                            this.setState({
                                selectedZym: null,
                                isUpdateMode: false,
                                isInsertMode: false
                            })
                            this.setState({selectedZym: zym})
                            this.state.map.panTo(new kakao.maps.LatLng(parseFloat(zym.location.coordinates[1]), parseFloat(zym.location.coordinates[0])))
                        });
    
                        this.state.markers.push(marker)
    
                        let zymOverlay = new kakao.maps.CustomOverlay({
                            map: this.state.map,
                            position: new kakao.maps.LatLng(parseFloat(zym.location.coordinates[1]), parseFloat(zym.location.coordinates[0])),
                            content: content,
                            yAnchor: 1.3,
                            clickable: true 
                        });
    
                        this.state.zymOverlays.push(zymOverlay)
                    }
                })
            })
            .catch(err => console.log(err))
    }

    _removeMarkers = () => {
        while (this.state.markers.length > 0) {
            this.state.markers.pop().setMap(null)
            this.state.zymOverlays.pop().setMap(null)
        }
    }

    componentDidMount() {
        const script = document.createElement("script");
        script.async = true;
        script.src = "https://dapi.kakao.com/v2/maps/sdk.js?appkey=bba5e8bad7094e7c5b3eb530c31acd3f&autoload=false&libraries=services";
        document.head.appendChild(script);

        script.onload = () => {
            kakao.maps.load(() => {
                let lat = 33.450701,
                    lon = 126.570667;

                let options = {
                    center: new kakao.maps.LatLng(lat, lon),
                    level: 3
                };

                this.setState({container: document.getElementById("Mymap")})
                this.setState({map: new window.kakao.maps.Map(this.state.container, options)})

                // 현재 위치 불러오기
                if (navigator.geolocation) {
                    // GeoLocation을 이용해서 접속 위치 얻음
                    navigator.geolocation.getCurrentPosition((position) => {
                        lat = position.coords.latitude;
                        lon = position.coords.longitude;
                        this.state.map.setCenter(new kakao.maps.LatLng(lat, lon))

                        // 초기 위치 헬스장 정보 조회
                        let center = this.state.map.getCenter();
                        this._getMarkers(center.getLng(), center.getLat(), 2)
                    });
                }

                // 초기 위치 헬스장 정보 조회
                let center = this.state.map.getCenter();
                this._getMarkers(center.getLng(), center.getLat(), 2)

                // 지도 이동 시 헬스장 정보 재조회
                kakao.maps.event.addListener(this.state.map, 'dragend', () => {
                    let center = this.state.map.getCenter();
                    this._getMarkers(center.getLng(), center.getLat(), 1)
                });

                // 지도 확대/축소 시 헬스장 정보 재조회
                kakao.maps.event.addListener(this.state.map, 'zoom_changed', () => {
                    let center = this.state.map.getCenter();
                    this._getMarkers(center.getLng(), center.getLat(), 1)
                });

                // 지도 클릭하면 선택된 헬스장 null
                kakao.maps.event.addListener(this.state.map, 'click', () => {
                    this.setState({
                        selectedZym: null,
                        isUpdateMode: false,
                        isInsertMode: false
                    })
                });

                // 지도 더블클릭 시 헬스장 등록
                kakao.maps.event.addListener(this.state.map, 'rightclick', function(mouseEvent) {
                    this.setState({
                        isInsertMode: false,
                        insertedZym: null
                    })
                    let latlng = mouseEvent.latLng;
                    let geocoder = new kakao.maps.services.Geocoder();
                    // 주소 불러오기
                    geocoder.coord2Address(latlng.getLng(), latlng.getLat(), (result, status) => {
                        if (status === kakao.maps.services.Status.OK) {
                            this.setState({
                                insertedZym: {
                                    address: !!result[0].road_address ? result[0].road_address.address_name : result[0].address.address_name,
                                    location: {
                                        coordinates: [latlng.getLng(), latlng.getLat()]
                                    }
                                },
                                isInsertMode: true
                            })
                        }
                    });
                }.bind(this));
            });
        };
    }

    render() {
        return (
        <main>
            <MapContents id="Mymap" />
            {(!this.state.isUpdateMode && this.state.selectedZym != null) ? <ZymContent key='zymContent' zym={this.state.selectedZym} onIsUpdateModeChange={this.handleIsUpdateModeChange} /> : null}            
            <MapFilter key="mapFilter" onFilterChange={this.handleFilterChange}/>
            {(this.state.isUpdateMode && this.state.selectedZym != null) ? <ZymUpdate key='zymUpdate' zym={this.state.selectedZym} onSelectedZymChange={this.handleSelectedZymChange} onIsUpdateModeChange={this.handleIsUpdateModeChange} /> : null}
            {this.state.isInsertMode ? <ZymInsert key='zymInsert' zym={this.state.insertedZym} onSelectedZymChange={this.handleSelectedZymChange} onIsInsertModeChange={this.handleIsInsertModeChange} /> : null}
        </main> )
    }
}


const MapContents = styled.div `
  width: 100%;
  height: 100%;
`;

export default MapContent;