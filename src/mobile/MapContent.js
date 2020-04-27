/*global kakao*/
import React, { Component } from "react";
import styled from "styled-components";
import GymContent from './GymContent';
import GymUpdate from './GymUpdate';
import GymInsert from './GymInsert';
import MapFilter from './MapFilter';
import ShowModal from './ShowModal';
import MapSearchResult from './MapSearchResult';
import { Image } from "react-bootstrap";
import { usePromiseTracker, trackPromise } from "react-promise-tracker";
import Loader from 'react-promise-loader';

class MapContent extends Component {

    constructor(props){
        super(props)
        this.handleSelectedGymChange = this.handleSelectedGymChange.bind(this);
        this.handleFilterChange = this.handleFilterChange.bind(this);
        this.handleIsUpdateModeChange = this.handleIsUpdateModeChange.bind(this);
        this.handleIsInsertModeChange = this.handleIsInsertModeChange.bind(this);
        this.handleIsFilterShowChange = this.handleIsFilterShowChange.bind(this);
        this.handleIsShowChange = this.handleIsShowChange.bind(this);
    }

    componentWillMount(){
        this.setState({
            map: null,
            container: null,
            markers: [],
            gymOverlays: [],
            selectedGym: null,
            insertedGym: null,
            isFilterShow: false,
            isUpdateMode: false,
            isInsertMode: false,
            isDailyUse: false,
            isYogaRoom: false,
            isPowerRack: false,
            warningOverlay: null
        })
    }

    // selectedGym 넘겨받은 후 지도 재탐색
    handleSelectedGymChange(gym){
        this.setState({selectedGym: gym})
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

    // isFilterShow 넘겨받기
    handleIsFilterShowChange(isFilterShow){
        this.setState({isFilterShow: isFilterShow})
    }
    
    // 저작권 표시 modal 닫을 때 사용하는 함수
    handleIsShowChange(isShow){
        this.setState({
            isShowModal: (isShow==='true')
        })
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

        return trackPromise(fetch(process.env.REACT_APP_SERVER_HOST + '/gym/get/location/' + lon + '/' + lat + '/' + distance))
            .then(response => response.json())
            .then((json) => {
                json.map((gym, i) => {
                    let imageSrc = "/image/gym.png"
                    let imageSize = new kakao.maps.Size(50, 50)
                    let markerImage = new kakao.maps.MarkerImage(imageSrc, imageSize)
                    // 커스텀 오버레이
                    let content = '<div class="customoverlay">' +
                        '    <span class="title">' + gym.name + '</span>' +
                        '</div>';

                    // 필터링
                    let isFiltered = false

                    if(this.state.isDailyUse && gym.dailyUse === 0){
                        isFiltered = true
                    }
                    if(this.state.isYogaRoom && gym.yogaRoom === 0){
                        isFiltered = true
                    }
                    if(this.state.isPowerRack && gym.powerRack === 0){
                        isFiltered = true
                    }

                    // 필터에 적합한 경우
                    if(!isFiltered){
                        let marker = new kakao.maps.Marker({
                            map: this.state.map, // 마커를 표시할 지도
                            position: new kakao.maps.LatLng(parseFloat(gym.location.coordinates[1]), parseFloat(gym.location.coordinates[0])), // 마커를 표시할 위치
                            title: gym.name, // 마커의 타이틀, 마커에 마우스를 올리면 타이틀이 표시됩니다
                            image: markerImage,
                            zIndex: 100,
                            clickable: true 
                        });
                        
                        // 마커 클릭하면 헬스장 정보가 나오도록 이벤트 리스너 등록
                        kakao.maps.event.addListener(marker, 'click', () => {
                            this.setState({
                                selectedGym: null,
                                isUpdateMode: false,
                                isInsertMode: false
                            })
                            this.setState({selectedGym: gym})
                            this.state.map.panTo(new kakao.maps.LatLng(parseFloat(gym.location.coordinates[1]), parseFloat(gym.location.coordinates[0])))
                        });
    
                        this.state.markers.push(marker)
    
                        let gymOverlay = new kakao.maps.CustomOverlay({
                            map: this.state.map,
                            position: new kakao.maps.LatLng(parseFloat(gym.location.coordinates[1]), parseFloat(gym.location.coordinates[0])),
                            content: content,
                            yAnchor: 1.3,
                            clickable: true 
                        });
    
                        this.state.gymOverlays.push(gymOverlay)
                    }
                })
            })
            .catch(err => console.log(err))
    }

    _removeMarkers = () => {
        while (this.state.markers.length > 0) {
            this.state.markers.pop().setMap(null)
            this.state.gymOverlays.pop().setMap(null)
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

                var zoomControl = new kakao.maps.ZoomControl();
                this.state.map.addControl(zoomControl, kakao.maps.ControlPosition.BOTTOMRIGHT);

                // 현재 위치 불러오기
                if (navigator.geolocation) {
                    // GeoLocation을 이용해서 접속 위치 얻음
                    navigator.geolocation.getCurrentPosition((position) => {
                        lat = position.coords.latitude
                        lon = position.coords.longitude
                        this.state.map.setCenter(new kakao.maps.LatLng(lat, lon))

                        // 현재 위치에 마커 표시
                        let imageSrc = "/image/now-location.png"
                        let imageSize = new kakao.maps.Size(60, 60)
                        let markerImage = new kakao.maps.MarkerImage(imageSrc, imageSize)

                        new kakao.maps.Marker({
                            map: this.state.map, // 마커를 표시할 지도
                            position: new kakao.maps.LatLng(lat, lon), // 마커를 표시할 위치
                            title: '현재위치', // 마커의 타이틀, 마커에 마우스를 올리면 타이틀이 표시됩니다
                            image: markerImage
                        });

                        // 초기 위치 헬스장 정보 조회
                        let center = this.state.map.getCenter();
                        this._getMarkers(center.getLng(), center.getLat(), 2)
                    });
                }

                // 초기 위치 헬스장 정보 조회
                let center = this.state.map.getCenter();
                this._getMarkers(center.getLng(), center.getLat(), 2)
                this.props.onNowLonLatChange(center.getLng(), center.getLat())

                // 지도 이동 시 헬스장 정보 재조회
                kakao.maps.event.addListener(this.state.map, 'dragend', () => {
                    let center = this.state.map.getCenter();
                    this._getMarkers(center.getLng(), center.getLat(), 1)
                    this.props.onNowLonLatChange(center.getLng(), center.getLat())
                });

                // 지도 확대/축소 시 헬스장 정보 재조회
                kakao.maps.event.addListener(this.state.map, 'zoom_changed', () => {
                    let center = this.state.map.getCenter();
                    this._getMarkers(center.getLng(), center.getLat(), 1)
                });

                // 지도 클릭하면 선택된 헬스장 null
                kakao.maps.event.addListener(this.state.map, 'click', () => {
                    this.setState({
                        selectedGym: null,
                        isUpdateMode: false,
                        isInsertMode: false
                    })
                });

                // 지도 우클릭시 헬스장 등록
                kakao.maps.event.addListener(this.state.map, 'rightclick', function(mouseEvent) {
                    this.setState({
                        isInsertMode: false,
                        insertedGym: null
                    })
                    let latlng = mouseEvent.latLng;
                    let geocoder = new kakao.maps.services.Geocoder();
                    // 주소 불러오기
                    geocoder.coord2Address(latlng.getLng(), latlng.getLat(), (result, status) => {
                        if (status === kakao.maps.services.Status.OK) {
                            this.setState({
                                insertedGym: {
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
        const rights = [
            <p><strong>아이콘 출처</strong></p>,
            <p>Icon made by <a href="https://www.flaticon.com/authors/freepik" target="blank">Freepik</a> from <a href="https://www.flaticon.com/" target="blank">www.flaticon.com</a></p>,
            <p>Icon made by <a href="https://www.flaticon.com/authors/iconixar" target="blank">iconixar</a> from <a href="https://www.flaticon.com/" target="blank">www.flaticon.com</a></p>,
            <p>Icon made by <a href="https://www.flaticon.com/authors/nikita-golubev" target="blank">Nikita Golubev</a> from <a href="https://www.flaticon.com/" target="blank">www.flaticon.com</a></p>,
            <p>Icon made by <a href="https://www.flaticon.com/authors/photo3idea-studio" target="blank">photo3idea_studio</a> from <a href="https://www.flaticon.com/" target="blank">www.flaticon.com</a></p>,
            <p>Icon made by <a href="https://www.flaticon.com/authors/vitaly-gorbachev" target="blank">Vitaly Gorbachev</a> from <a href="https://www.flaticon.com/" target="blank">www.flaticon.com</a></p>,
            <p>Icon made by <a href="https://www.flaticon.com/authors/eucalyp" target="blank">Eucalyp</a> from <a href="https://www.flaticon.com/" target="blank">www.flaticon.com</a></p>,
            <p>Icon made by <a href="https://www.flaticon.com/authors/ultimatearm" target="blank">ultimatearm</a> from <a href="https://www.flaticon.com/" target="blank">www.flaticon.com</a></p>,
            <p>Icon made by <a href="https://www.flaticon.com/authors/those-icons" target="blank">Those Icons</a> from <a href="https://www.flaticon.com/" target="blank">www.flaticon.com</a></p>,
            <p>Icon made by <a href="https://www.flaticon.com/authors/kiranshastry" target="blank">Kiranshastry</a> from <a href="https://www.flaticon.com/" target="blank">www.flaticon.com</a></p>,
            <p><strong>헬스장 위치 데이터 출처</strong></p>,
            <p>서울특별시 체력단련장 정보 : <a href="http://data.seoul.go.kr/dataList/OA-15207/S/1/datasetView.do;jsessionid=B6C3305B5F9050478F871D990F2A2307.new_portal-svr-11" target="blank">서울 열린데이터 광장</a></p>,
            <p>성남시 체력단련장 정보 : <a href="https://www.data.go.kr/data/3078606/fileData.do" target="blank">공공데이터포털</a></p>,
            <p>경기도 체력단련장 정보 : <a href="https://data.gg.go.kr/portal/data/service/selectServicePage.do?infId=W79O75LJ92OZ3P30IFST755934&infSeq=1" target="blank">경기데이터드림</a></p>
        ]

        return (
            <main>
                <Loader type="ThreeDots" background="none" color="#666" promiseTracker={usePromiseTracker} />
                <Image src="/image/filter.png"
                    className="filterButton"
                    widht="50"
                    height="50"
                    onClick={() => {
                        this.setState({isFilterShow: true})
                    }} />
                <div className="rightsInfo" onClick={() => {
                    this.setState({isShowModal: true})
                }}>저작권 안내</div>
                <ShowModal
                    isShow={this.state.isShowModal}
                    message={rights}
                    onIsShowChange={this.handleIsShowChange} />
                <MapContents id="Mymap" />
                {(!this.state.isUpdateMode && this.state.selectedGym != null) ?
                <GymContent key='gymContent'
                    pageView={this.props.pageView}
                    gym={this.state.selectedGym}
                    onSelectedGymChange={this.handleSelectedGymChange}
                    onIsUpdateModeChange={this.handleIsUpdateModeChange} /> : null}   
                {this.state.isFilterShow ?
                <MapFilter key="mapFilter"
                    onFilterChange={this.handleFilterChange}
                    onIsFilterShowChange={this.handleIsFilterShowChange}
                    isDailyUse={this.state.isDailyUse}
                    isYogaRoom={this.state.isYogaRoom}
                    isPowerRack={this.state.isPowerRack} />
                : null}
                {this.props.isSearchMode ?
                <MapSearchResult key='mapSearchResult'
                    onIsSearchModeChange={this.props.onIsSearchModeChange}
                    map={this.state.map}
                    _getMarkers={this._getMarkers}
                    nowLon={this.state.map.getCenter().getLng()}
                    nowLat={this.state.map.getCenter().getLat()} /> : null}
                {(this.state.isUpdateMode && this.state.selectedGym != null) ? 
                <GymUpdate key='gymUpdate'
                    pageView={this.props.pageView}
                    gym={this.state.selectedGym}
                    onSelectedGymChange={this.handleSelectedGymChange}
                    onIsUpdateModeChange={this.handleIsUpdateModeChange} /> : null}
                {this.state.isInsertMode ?
                <GymInsert key='gymInsert'
                    pageView={this.props.pageView}
                    gym={this.state.insertedGym}
                    onSelectedGymChange={this.handleSelectedGymChange}
                    onIsInsertModeChange={this.handleIsInsertModeChange} /> : null}
            </main>
        )
    }
}


const MapContents = styled.div `
  width: 100%;
  height: 100%;
`;

export default MapContent;