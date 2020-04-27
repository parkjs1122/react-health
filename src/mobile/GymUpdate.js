import React, { Component } from "react";
import { OverlayTrigger, Tooltip, InputGroup, Image, Button, Form, Card, Navbar } from "react-bootstrap";
import { Formik } from 'formik';
import * as Yup from 'yup';
import ShowModal from "./ShowModal";
import { usePromiseTracker, trackPromise } from "react-promise-tracker";
import Loader from 'react-promise-loader';

class GymUpdate extends Component {
    constructor(props){
        super(props)
        this.handleIsShowChange = this.handleIsShowChange.bind(this);
    }

    componentWillMount(){
        this.setState({
            isShowModal: false,
            modalText: null,
            dailyUseChecked: (this.props.gym.dailyUse > 0) ? true : false
        })
    }

    // Google analytics
    componentDidMount(){
        this.props.pageView('/Mobile/GymUpdate/' + this.props.gym.name)
    }

    handleIsShowChange(isShow){
        this.setState({
            isShowModal: (isShow==='true')
        })
        // Modal이 닫히면 UpdateMode false로 바꿔서 부모로 보냄
        if(isShow === 'false'){
            this.props.onIsUpdateModeChange(false)
        }
    }

    componentWillUnmount(){
        this.props.onIsUpdateModeChange(false)
    }

    render(){
        const schema = Yup.object({
            dailyUse: Yup.number()
                .min((this.state.dailyUseChecked ? 1000 : 0), '요금을 정상적으로 입력해주세요')
                .required('일일입장요금을 입력해주세요.'),
            yogaRoom: Yup.number()
                .min(0, '요가룸 개수를 정상적으로 입력해주세요')
                .required('요가룸 개수를 입력해주세요.'),
            powerRack: Yup.number()
                .min(0, '파워랙 개수를 정상적으로 입력해주세요')
                .required('파워랙 개수를 입력해주세요.'),
            smithMachine: Yup.number()
                .min(0, '스미스머신 개수를 정상적으로 입력해주세요')
                .required('스미스머신 개수를 입력해주세요.'),
            chiningDippingMachine: Yup.number()
                .min(0, '치닝디핑머신 개수를 정상적으로 입력해주세요')
                .required('치닝디핑머신 개수를 입력해주세요.'),
            cableMachine: Yup.number()
                .min(0, '케이블머신 개수를 정상적으로 입력해주세요')
                .required('케이블머신 개수를 입력해주세요.'),
            runningMachine: Yup.number()
                .min(0, '러닝머신 개수를 정상적으로 입력해주세요')
                .required('러닝머신 개수를 입력해주세요.'),
            bench: Yup.number()
                .min(0, '벤치 개수를 정상적으로 입력해주세요')
                .required('벤치 개수를 입력해주세요.'),
            inclineBench: Yup.number()
                .min(0, '인클라인벤치 개수를 정상적으로 입력해주세요')
                .required('인클라인벤치 개수를 입력해주세요.'),
            declineBench: Yup.number()
                .min(0, '디클라인벤치 개수를 정상적으로 입력해주세요')
                .required('디클라인벤치 개수를 입력해주세요.'),
            hackSquatMachine: Yup.number()
                .min(0, '핵스쿼트 개수를 정상적으로 입력해주세요')
                .required('핵스쿼트 개수를 입력해주세요.'),
            barbell: Yup.number()
                .min(0, '바벨 개수를 정상적으로 입력해주세요')
                .required('바벨 개수를 입력해주세요.'),
            ezBar: Yup.number()
                .min(0, 'EZ바 개수를 정상적으로 입력해주세요')
                .required('EZ바 개수를 입력해주세요.'),
        });
        
        return(
            <div className='gymContent'>
                <Loader type="ThreeDots" background="none" color="#666" promiseTracker={usePromiseTracker} />
                <Navbar bg="light" variant="light">
                    <Navbar.Brand>
                        <Image
                            alt="뒤로가기"
                            src="/image/left-arrow.png"
                            width="30"
                            height="30"
                            className="d-inline-block align-top"
                            onClick={() => {
                                this.props.onIsUpdateModeChange(null)
                            }}
                        />{' '}
                        헬스장 정보 제보하기
                    </Navbar.Brand>
                </Navbar>
                <div className='gymInfo'>
                    <Card>
                        <Card.Body>
                            <Card.Title as="h5"><strong>{this.props.gym.name}</strong></Card.Title>
                            <Card.Text>{this.props.gym.address}</Card.Text>
                        </Card.Body>
                        <div className='p-2'>
                            <Formik
                                validationSchema={schema}
                                onSubmit={values => {
                                    if(values.dailyUseCheck && !values.dailyUseCheck[0]){
                                        values.dailyUse = 0
                                    }
                                    const requestOptions = {
                                        method: 'POST',
                                        headers: { 'Content-Type': 'application/json' },
                                        body: JSON.stringify(values)
                                    };
                                    
                                    trackPromise(fetch(process.env.REACT_APP_SERVER_HOST + '/gym/update', requestOptions))
                                    .then(response => response.json())
                                    .then(data => {
                                        this.setState({
                                            modalText: '저장이 완료되었습니다.',
                                            isShowModal: true
                                        })
                                        this.props.onSelectedGymChange(data);
                                        this.props.pageView('/Mobile/GymUpdateOK/' + this.props.gym.name)
                                    })
                                }}
                                initialValues={{
                                    id: this.props.gym.id,
                                    name: this.props.gym.name,
                                    address: this.props.gym.address,
                                    location: this.props.gym.location,
                                    dailyUse: this.props.gym.dailyUse,
                                    yogaRoom: this.props.gym.yogaRoom,
                                    powerRack: this.props.gym.powerRack,
                                    smithMachine: this.props.gym.smithMachine,
                                    chiningDippingMachine: this.props.gym.chiningDippingMachine,
                                    cableMachine: this.props.gym.cableMachine,
                                    runningMachine: this.props.gym.runningMachine,
                                    bench: this.props.gym.bench,
                                    inclineBench: this.props.gym.inclineBench,
                                    declineBench: this.props.gym.declineBench,
                                    hackSquatMachine: this.props.gym.hackSquatMachine,
                                    barbell: this.props.gym.barbell,
                                    ezBar: this.props.gym.ezBar,
                                }}
                            >
                                {({
                                    handleSubmit,
                                    handleChange,
                                    handleBlur,
                                    values,
                                    touched,
                                    isValid,
                                    errors,
                                }) => (
                                <Form action="#" noValidate onSubmit={handleSubmit}>
                                    <Form.Check
                                        type='switch'
                                        label="일일입장가능"
                                        name='dailyUseCheck'
                                        id='dailyUseCheck'
                                        onChange={handleChange}
                                        className='mb-1'
                                        checked = {this.state.dailyUseChecked ? true : false}
                                        onClick = {() => {
                                            this.setState({
                                                dailyUseChecked: !this.state.dailyUseChecked
                                            })
                                    }}/>
                                    {this.state.dailyUseChecked ? 
                                        <InputGroup className="mb-1" >
                                            <InputGroup.Prepend>
                                                <InputGroup.Text>일일입장요금</InputGroup.Text>
                                            </InputGroup.Prepend>
                                            <Form.Control
                                                type='text'
                                                placeholder="1000"
                                                aria-describedby="inputGroupPrepend"
                                                name="dailyUse"
                                                value={this.state.dailyUseChecked ? values.dailyUse : 0}
                                                onChange={handleChange}
                                                isInvalid={!!errors.dailyUse}
                                            />
                                            <InputGroup.Append>
                                                <InputGroup.Text>원</InputGroup.Text>
                                            </InputGroup.Append>
                                            <Form.Control.Feedback type="invalid">
                                                {errors.dailyUse}
                                            </Form.Control.Feedback>
                                        </InputGroup> : null
                                    }
                                    <InputGroup size="lg" className="mb-1">
                                        <InputGroup.Prepend>
                                        <InputGroup.Text>
                                            <OverlayTrigger overlay={<Tooltip id="tooltip">요가룸</Tooltip>}>
                                                <span><Image src='/image/yoga.png' /></span>
                                            </OverlayTrigger>
                                        </InputGroup.Text>
                                        </InputGroup.Prepend>
                                        <Form.Control
                                            type='text'
                                            className="border-right-0"
                                            placeholder="0"
                                            aria-describedby="inputGroupPrepend"
                                            name="yogaRoom"
                                            value={values.yogaRoom}
                                            onChange={handleChange}
                                            isInvalid={!!errors.yogaRoom}
                                        />
                                        <InputGroup.Prepend>
                                        <InputGroup.Text>
                                            <OverlayTrigger overlay={<Tooltip id="tooltip">파워랙</Tooltip>}>
                                                <span><Image src='/image/power-rack.png' /></span>
                                            </OverlayTrigger>
                                        </InputGroup.Text>
                                        </InputGroup.Prepend>
                                        <Form.Control
                                            type='text'
                                            placeholder="0"
                                            aria-describedby="inputGroupPrepend"
                                            name="powerRack"
                                            value={values.powerRack}
                                            onChange={handleChange}
                                            isInvalid={!!errors.powerRack}
                                        />
                                        <Form.Control.Feedback type="invalid">
                                            {errors.yogaRoom}
                                        </Form.Control.Feedback>
                                        <Form.Control.Feedback type="invalid">
                                            {errors.powerRack}
                                        </Form.Control.Feedback>
                                    </InputGroup>
                                    <InputGroup size="lg" className="mb-1">
                                        <InputGroup.Prepend>
                                        <InputGroup.Text>
                                            <OverlayTrigger overlay={<Tooltip id="tooltip">스미스머신</Tooltip>}>
                                                <span><Image src='/image/smith-machine.png' /></span>
                                            </OverlayTrigger>
                                        </InputGroup.Text>
                                        </InputGroup.Prepend>
                                        <Form.Control
                                            type='text'
                                            className="border-right-0"
                                            placeholder="0"
                                            aria-describedby="inputGroupPrepend"
                                            name="smithMachine"
                                            value={values.smithMachine}
                                            onChange={handleChange}
                                            isInvalid={!!errors.smithMachine}
                                        />
                                        <InputGroup.Prepend>
                                        <InputGroup.Text>
                                            <OverlayTrigger overlay={<Tooltip id="tooltip">치닝디핑머신</Tooltip>}>
                                                <span><Image src='/image/chining-dipping-machine.png' /></span>
                                            </OverlayTrigger>
                                        </InputGroup.Text>
                                        </InputGroup.Prepend>
                                        <Form.Control
                                            type='text'
                                            placeholder="0"
                                            aria-describedby="inputGroupPrepend"
                                            name="chiningDippingMachine"
                                            value={values.chiningDippingMachine}
                                            onChange={handleChange}
                                            isInvalid={!!errors.chiningDippingMachine}
                                        />
                                        <Form.Control.Feedback type="invalid">
                                            {errors.smithMachine}
                                        </Form.Control.Feedback>
                                        <Form.Control.Feedback type="invalid">
                                            {errors.chiningDippingMachine}
                                        </Form.Control.Feedback>
                                    </InputGroup>
                                    <InputGroup size="lg" className="mb-1">
                                        <InputGroup.Prepend>
                                        <InputGroup.Text>
                                            <OverlayTrigger overlay={<Tooltip id="tooltip">케이블머신</Tooltip>}>
                                                <span><Image src='/image/cable-machine.png' /></span>
                                            </OverlayTrigger>
                                        </InputGroup.Text>
                                        </InputGroup.Prepend>
                                        <Form.Control
                                            type='text'
                                            className="border-right-0"
                                            placeholder="0"
                                            aria-describedby="inputGroupPrepend"
                                            name="cableMachine"
                                            value={values.cableMachine}
                                            onChange={handleChange}
                                            isInvalid={!!errors.cableMachine}
                                        />
                                        <InputGroup.Prepend>
                                        <InputGroup.Text>
                                            <OverlayTrigger overlay={<Tooltip id="tooltip">런닝머신</Tooltip>}>
                                                <span><Image src='/image/running-machine.png' /></span>
                                            </OverlayTrigger>
                                        </InputGroup.Text>
                                        </InputGroup.Prepend>
                                        <Form.Control
                                            type='text'
                                            placeholder="0"
                                            aria-describedby="inputGroupPrepend"
                                            name="runningMachine"
                                            value={values.runningMachine}
                                            onChange={handleChange}
                                            isInvalid={!!errors.runningMachine}
                                        />
                                        <Form.Control.Feedback type="invalid">
                                            {errors.cableMachine}
                                        </Form.Control.Feedback>
                                        <Form.Control.Feedback type="invalid">
                                            {errors.runningMachine}
                                        </Form.Control.Feedback>
                                    </InputGroup>
                                    <InputGroup size="lg" className="mb-1">
                                        <InputGroup.Prepend>
                                        <InputGroup.Text>
                                            <OverlayTrigger overlay={<Tooltip id="tooltip">벤치</Tooltip>}>
                                                <span><Image src='/image/bench.png' /></span>
                                            </OverlayTrigger>
                                        </InputGroup.Text>
                                        </InputGroup.Prepend>
                                        <Form.Control
                                            type='text'
                                            className="border-right-0"
                                            placeholder="0"
                                            aria-describedby="inputGroupPrepend"
                                            name="bench"
                                            value={values.bench}
                                            onChange={handleChange}
                                            isInvalid={!!errors.bench}
                                        />
                                        <InputGroup.Prepend>
                                        <InputGroup.Text>
                                            <OverlayTrigger overlay={<Tooltip id="tooltip">인클라인벤치</Tooltip>}>
                                                <span><Image src='/image/incline-bench.png' /></span>
                                            </OverlayTrigger>
                                        </InputGroup.Text>
                                        </InputGroup.Prepend>
                                        <Form.Control
                                            type='text'
                                            placeholder="0"
                                            aria-describedby="inputGroupPrepend"
                                            name="inclineBench"
                                            value={values.inclineBench}
                                            onChange={handleChange}
                                            isInvalid={!!errors.inclineBench}
                                        />
                                        <Form.Control.Feedback type="invalid">
                                            {errors.bench}
                                        </Form.Control.Feedback>
                                        <Form.Control.Feedback type="invalid">
                                            {errors.inclineBench}
                                        </Form.Control.Feedback>
                                    </InputGroup>
                                    <InputGroup size="lg" className="mb-1">
                                        <InputGroup.Prepend>
                                        <InputGroup.Text>
                                            <OverlayTrigger overlay={<Tooltip id="tooltip">디클라인벤치</Tooltip>}>
                                                <span><Image src='/image/decline-bench.png' /></span>
                                            </OverlayTrigger>
                                        </InputGroup.Text>
                                        </InputGroup.Prepend>
                                        <Form.Control
                                            type='text'
                                            className="border-right-0"
                                            placeholder="0"
                                            aria-describedby="inputGroupPrepend"
                                            name="declineBench"
                                            value={values.declineBench}
                                            onChange={handleChange}
                                            isInvalid={!!errors.declineBench}
                                        />
                                        <InputGroup.Prepend>
                                        <InputGroup.Text>
                                            <OverlayTrigger overlay={<Tooltip id="tooltip">핵스쿼트머신</Tooltip>}>
                                                <span><Image src='/image/hack-squat.png' /></span>
                                            </OverlayTrigger>
                                        </InputGroup.Text>
                                        </InputGroup.Prepend>
                                        <Form.Control
                                            type='text'
                                            placeholder="0"
                                            aria-describedby="inputGroupPrepend"
                                            name="hackSquatMachine"
                                            value={values.hackSquatMachine}
                                            onChange={handleChange}
                                            isInvalid={!!errors.hackSquatMachine}
                                        />
                                        <Form.Control.Feedback type="invalid">
                                            {errors.declineBench}
                                        </Form.Control.Feedback>
                                        <Form.Control.Feedback type="invalid">
                                            {errors.hackSquatMachine}
                                        </Form.Control.Feedback>
                                    </InputGroup>
                                    <InputGroup size="lg" className="mb-1">
                                        <InputGroup.Prepend>
                                        <InputGroup.Text>
                                            <OverlayTrigger overlay={<Tooltip id="tooltip">바벨</Tooltip>}>
                                                <span><Image src='/image/barbell.png' /></span>
                                            </OverlayTrigger>
                                        </InputGroup.Text>
                                        </InputGroup.Prepend>
                                        <Form.Control
                                            type='text'
                                            className="border-right-0"
                                            placeholder="0"
                                            aria-describedby="inputGroupPrepend"
                                            name="barbell"
                                            value={values.barbell}
                                            onChange={handleChange}
                                            isInvalid={!!errors.barbell}
                                        />
                                        <InputGroup.Prepend>
                                        <InputGroup.Text>
                                            <OverlayTrigger overlay={<Tooltip id="tooltip">EZ바</Tooltip>}>
                                                <span><Image src='/image/ez-bar.png' /></span>
                                            </OverlayTrigger>
                                        </InputGroup.Text>
                                        </InputGroup.Prepend>
                                        <Form.Control
                                            type='text'
                                            placeholder="0"
                                            aria-describedby="inputGroupPrepend"
                                            name="ezBar"
                                            value={values.ezBar}
                                            onChange={handleChange}
                                            isInvalid={!!errors.ezBar}
                                        />
                                        <Form.Control.Feedback type="invalid">
                                            {errors.barbell}
                                        </Form.Control.Feedback>
                                        <Form.Control.Feedback type="invalid">
                                            {errors.ezBar}
                                        </Form.Control.Feedback>
                                    </InputGroup>
                                    <Button type='submit' variant="secondary" className="mt-2" block>저장하기</Button>
                                </Form>
                                )}
                            </Formik>
                        </div>    
                    </Card>
                </div>
                <ShowModal
                    isShow={this.state.isShowModal}
                    message={this.state.modalText}
                    onIsShowChange={this.handleIsShowChange} />
            </div>
            
        )
    }
}

export default GymUpdate