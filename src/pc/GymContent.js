import React, { Component } from "react";
import { OverlayTrigger, Tooltip, Badge, InputGroup, Form, Image, Button, Card } from "react-bootstrap";
import './GymContent.css';

class GymContent extends Component {
    constructor(props){
        super(props)
        this.handleGymChange = this.handleGymChange.bind(this);
        this.handleIsUpdateModeChange = this.handleIsUpdateModeChange.bind(this);
    }

    componentWillMount(){
        this.setState({
            gym: this.props.gym,
            isUpdateMode: false
        })
    }

    componentWillUnmount(){
        this.setState({
            isUpdateMode: false
        })
    }

    // 제보하기 창 띄우기
    _onButtonClick = () => {
        this.props.onIsUpdateModeChange(true)
    }

    // gym state 넘겨받기
    handleGymChange(gym){
        this.setState({gym: gym})
        this.props.onSelecteGymChange()
    }
    
    // isUpdateMode state 넘겨받기
    handleIsUpdateModeChange(isUpdateMode){
        this.setState({isUpdateMode: (isUpdateMode === 'true')})
    }

    render(){
        if(this.state.gym.updatedDate != null){
            return(
                <div className='leftPage'>
                    <div className='gymInfoPc'>
                        <Card>
                            <Card.Header><strong>헬스장 정보</strong></Card.Header>
                            <Card.Body>
                                <Card.Title as="h5"><strong>{this.state.gym.name}</strong> {(this.state.gym.dailyUse != null && this.state.gym.dailyUse > 0) ? <Badge variant="secondary">일일입장가능</Badge> : ''}</Card.Title>
                                <Card.Text>{this.state.gym.address}</Card.Text>
                            </Card.Body>      
                            <div className='p-2'>
                               {(this.state.gym.dailyUse > 0) ?
                                <InputGroup className="mb-1">
                                    <InputGroup.Prepend>
                                    <InputGroup.Text>일일입장요금</InputGroup.Text>
                                    </InputGroup.Prepend>
                                    <Form.Control value={this.state.gym.dailyUse} />
                                    <InputGroup.Append>
                                        <InputGroup.Text>원</InputGroup.Text>
                                    </InputGroup.Append>
                                </InputGroup> : ''}
                                <InputGroup size="lg" className="mb-1">
                                    <InputGroup.Prepend>
                                    <InputGroup.Text>
                                        <OverlayTrigger overlay={<Tooltip id="tooltip">요가룸</Tooltip>}>
                                            <span><Image src='/image/yoga.png' /></span>
                                        </OverlayTrigger>
                                    </InputGroup.Text>
                                    </InputGroup.Prepend>
                                    <Form.Control className="border-right-0" value={this.state.gym.yogaRoom} />
                                    <InputGroup.Prepend>
                                    <InputGroup.Text>
                                        <OverlayTrigger overlay={<Tooltip id="tooltip">파워랙</Tooltip>}>
                                            <span><Image src='/image/power-rack.png' /></span>
                                        </OverlayTrigger>
                                    </InputGroup.Text>
                                    </InputGroup.Prepend>
                                    <Form.Control value={this.state.gym.powerRack} />
                                </InputGroup>
                                <InputGroup size="lg" className="mb-1">
                                    <InputGroup.Prepend>
                                    <InputGroup.Text>
                                        <OverlayTrigger overlay={<Tooltip id="tooltip">스미스머신</Tooltip>}>
                                            <span><Image src='/image/smith-machine.png' /></span>
                                        </OverlayTrigger>
                                    </InputGroup.Text>
                                    </InputGroup.Prepend>
                                    <Form.Control className="border-right-0" value={this.state.gym.smithMachine} />
                                    <InputGroup.Prepend>
                                    <InputGroup.Text>
                                        <OverlayTrigger overlay={<Tooltip id="tooltip">치닝디핑머신</Tooltip>}>
                                            <span><Image src='/image/chining-dipping-machine.png' /></span>
                                        </OverlayTrigger>
                                    </InputGroup.Text>
                                    </InputGroup.Prepend>
                                    <Form.Control value={this.state.gym.chiningDippingMachine} />
                                </InputGroup>
                                <InputGroup size="lg" className="mb-1">
                                    <InputGroup.Prepend>
                                    <InputGroup.Text>
                                        <OverlayTrigger overlay={<Tooltip id="tooltip">케이블머신</Tooltip>}>
                                            <span><Image src='/image/cable-machine.png' /></span>
                                        </OverlayTrigger>
                                    </InputGroup.Text>
                                    </InputGroup.Prepend>
                                    <Form.Control className="border-right-0" value={this.state.gym.cableMachine} />
                                    <InputGroup.Prepend>
                                    <InputGroup.Text>
                                        <OverlayTrigger overlay={<Tooltip id="tooltip">런닝머신</Tooltip>}>
                                            <span><Image src='/image/running-machine.png' /></span>
                                        </OverlayTrigger>
                                    </InputGroup.Text>
                                    </InputGroup.Prepend>
                                    <Form.Control value={this.state.gym.runningMachine} />
                                </InputGroup>
                                <InputGroup size="lg" className="mb-1">
                                    <InputGroup.Prepend>
                                    <InputGroup.Text>
                                        <OverlayTrigger overlay={<Tooltip id="tooltip">벤치</Tooltip>}>
                                            <span><Image src='/image/bench.png' /></span>
                                        </OverlayTrigger>
                                    </InputGroup.Text>
                                    </InputGroup.Prepend>
                                    <Form.Control className="border-right-0" value={this.state.gym.bench} />
                                    <InputGroup.Prepend>
                                    <InputGroup.Text>
                                        <OverlayTrigger overlay={<Tooltip id="tooltip">인클라인벤치</Tooltip>}>
                                            <span><Image src='/image/incline-bench.png' /></span>
                                        </OverlayTrigger>
                                    </InputGroup.Text>
                                    </InputGroup.Prepend>
                                    <Form.Control value={this.state.gym.inclineBench} />
                                </InputGroup>
                                <InputGroup size="lg" className="mb-1">
                                    <InputGroup.Prepend>
                                    <InputGroup.Text>
                                        <OverlayTrigger overlay={<Tooltip id="tooltip">디클라인벤치</Tooltip>}>
                                            <span><Image src='/image/decline-bench.png' /></span>
                                        </OverlayTrigger>
                                    </InputGroup.Text>
                                    </InputGroup.Prepend>
                                    <Form.Control className="border-right-0" value={this.state.gym.declineBench} />
                                    <InputGroup.Prepend>
                                    <InputGroup.Text>
                                        <OverlayTrigger overlay={<Tooltip id="tooltip">핵스쿼트머신</Tooltip>}>
                                            <span><Image src='/image/hack-squat.png' /></span>
                                        </OverlayTrigger>
                                    </InputGroup.Text>
                                    </InputGroup.Prepend>
                                    <Form.Control value={this.state.gym.hackSquatMachine} />
                                </InputGroup>
                                <InputGroup size="lg" className="mb-1">
                                    <InputGroup.Prepend>
                                    <InputGroup.Text>
                                        <OverlayTrigger overlay={<Tooltip id="tooltip">바벨</Tooltip>}>
                                            <span><Image src='/image/barbell.png' /></span>
                                        </OverlayTrigger>
                                    </InputGroup.Text>
                                    </InputGroup.Prepend>
                                    <Form.Control className="border-right-0" value={this.state.gym.barbell} />
                                    <InputGroup.Prepend>
                                    <InputGroup.Text>
                                        <OverlayTrigger overlay={<Tooltip id="tooltip">EZ바</Tooltip>}>
                                            <span><Image src='/image/ez-bar.png' /></span>
                                        </OverlayTrigger>
                                    </InputGroup.Text>
                                    </InputGroup.Prepend>
                                    <Form.Control value={this.state.gym.ezBar} />
                                </InputGroup>
                            </div>        
                        </Card>
                    </div>
                    <Button variant="secondary" className="mt-1" onClick={this._onButtonClick} block>제보하기</Button>
                </div>
            )
        }else{
            return(
                <div className='leftPage'>
                    <div className='gymInfo'>
                        <Card>
                            <Card.Header><strong>헬스장 정보</strong></Card.Header>
                            <Card.Body>
                                <Card.Title as="h5"><strong>{this.state.gym.name}</strong></Card.Title>
                                <Card.Text>{this.state.gym.address}</Card.Text>
                            </Card.Body>      
                        </Card>
                    </div>
                    <Button variant="secondary" className="mt-1" onClick={this._onButtonClick} block>제보하기</Button>
                </div>
            )
        }
    }
}

export default GymContent