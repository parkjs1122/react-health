import React, { Component } from "react";
import ZymUpdate from './ZymUpdate';
import { OverlayTrigger, Tooltip, Badge, InputGroup, FormControl, Image, Button } from "react-bootstrap";
import './ZymContent.css';

class ZymContent extends Component {
    componentWillMount(){
        this.setState({
            ...this.state,
            isUpdateMode: false
        })
    }
    componentWillUnmount(){
        this.setState({
            ...this.state,
            isUpdateMode: false
        })
    }
    _onButtonClick = () => {
        this.setState({
            ...this.state,
            isUpdateMode: true
        })
    }
    render(){
        if(this.state.isUpdateMode){
            return(<ZymUpdate zym={this.props.zym} key='zymUpdate' />)
        }
        let zymInfoContent = []
        let _machine = [
            {name: '요가룸', props:this.props.zym.yogaRoom, image:'/image/yoga.png'},
            {name: '파워랙', props:this.props.zym.powerRack, image:'/image/power-rack.png'},
            {name: '스미스머신', props:this.props.zym.smithMachine, image:'/image/smith-machine.png'},
            {name: '치닝디핑머신', props:this.props.zym.chiningDippingMachine, image:'/image/chining-dipping-machine.png'},
            {name: '케이블머신', props:this.props.zym.cableMachine, image:'/image/cable-machine.png'},
            {name: '러닝머신', props:this.props.zym.runningMachine, image:'/image/running-machine.png'},
            {name: '벤치프레스', props:this.props.zym.bench, image:'/image/bench.png'},
            {name: '인클라인벤치', props:this.props.zym.inclineBench, image:'/image/incline-bench.png'},
            {name: '디클라인벤치', props:this.props.zym.declineBench, image:'/image/decline-bench.png'},
            {name: '핵스쿼트머신', props:this.props.zym.hackSquatMachine, image:'/image/hack-squat.png'},
            {name: '바벨', props:this.props.zym.barbell, image:'/image/barbell.png'},
            {name: 'EZ바', props:this.props.zym.ezBar, image:'/image/ez-bar.png'}
        ]

        for(let i = 0; i < _machine.length; i += 2){
            zymInfoContent.push(
                <div className="mb-1">
                    <InputGroup size="lg" className="mb-1">
                        <InputGroup.Prepend>
                        <InputGroup.Text>
                            <OverlayTrigger overlay={<Tooltip id="tooltip">{_machine[i].name}</Tooltip>}>
                                <span><Image src={_machine[i].image} /></span>
                            </OverlayTrigger>
                        </InputGroup.Text>
                        </InputGroup.Prepend>
                        <FormControl className="border-right-0" value = {_machine[i].props} readOnly />
                        <InputGroup.Prepend>
                        <InputGroup.Text>
                            <OverlayTrigger overlay={<Tooltip id="tooltip">{_machine[i + 1].name}</Tooltip>}>
                                <span><Image src={_machine[i + 1].image} /></span>
                            </OverlayTrigger>
                        </InputGroup.Text>
                        </InputGroup.Prepend>
                        <FormControl value = {_machine[i + 1].props} readOnly />
                    </InputGroup>
                </div>
            )
        }
        if(this.props.zym.updatedDate != null){
            return(
                <div className='leftPage'>
                    <div className='zymInfo'>
                        <div className="card">
                            <div className="card-header"><strong>헬스장 정보</strong></div>
                            <div className="card-body">
                                <h5 className="card-title"><strong>{this.props.zym.name}</strong> {(this.props.zym.dailyUse != null && this.props.zym.dailyUse > 0) ? <Badge variant="secondary">일일입장가능</Badge> : ''}</h5>
                                <p className="card-text">{this.props.zym.address}</p>
                            </div>
                            <div className='p-2'>
                                {(this.state.dailyUseChecked > 0) ?
                                <InputGroup className="mb-1">
                                    <InputGroup.Prepend>
                                    <InputGroup.Text>일일입장요금</InputGroup.Text>
                                    </InputGroup.Prepend>
                                    <FormControl value={this.props.zym.dailyUse} readOnly />
                                    <InputGroup.Append>
                                        <InputGroup.Text>원</InputGroup.Text>
                                    </InputGroup.Append>
                                </InputGroup> : ''}
                                {zymInfoContent}
                            </div>        
                        </div>
                    </div>
                    <Button variant="secondary" className="mt-1" onClick={this._onButtonClick} block>제보하기</Button>
                </div>
            )
        }else{
            return(
                <div className='leftPage'>
                    <div className='zymInfo'>
                        <div className="card">
                            <div className="card-header"><strong>헬스장 정보</strong></div>
                            <div className="card-body">
                                <h5 className="card-title"><strong>{this.props.zym.name}</strong></h5>
                                <p className="card-text">{this.props.zym.address}</p>
                            </div>      
                        </div>
                    </div>
                    <Button variant="secondary" className="mt-1" onClick={this._onButtonClick} block>제보하기</Button>
                </div>
            )
        }
    }
}

export default ZymContent