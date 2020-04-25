import React, { Component } from "react";
import './GymInsert.css';
import { OverlayTrigger, Tooltip, InputGroup, Image, Button, Form, Card } from "react-bootstrap";
import { Formik } from 'formik';
import * as Yup from 'yup';
import ShowModal from "./ShowModal";

class GymInsert extends Component {
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

    handleIsShowChange(isShow){
        this.setState({
            isShowModal: (isShow==='true')
        })
        // Modal이 닫히면 InsertMode false로 바꿔서 부모로 보냄
        if(isShow === 'false'){
            this.props.onIsInsertModeChange(false)
        }
    }

    componentWillUnmount(){
        this.props.onIsInsertModeChange(false)
    }

    render(){
        const schema = Yup.object({
            name: Yup.string()
                .required('헬스장 이름을 입력해주세요.'),
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
            <div className='leftPage'>
                <div className='gymInfoPc'>
                    <Card>
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
                                
                                fetch(process.env.REACT_APP_SERVER_HOST + '/gym/update', requestOptions)
                                .then(response => response.json())
                                .then(data => {
                                    this.setState({
                                        modalText: '저장이 완료되었습니다.',
                                        isShowModal: true
                                    })
                                    this.props.onSelectedGymChange(data);
                                })
                            }}
                            initialValues={{
                                id: null,
                                address: this.props.gym.address,
                                location: this.props.gym.location,
                                dailyUse: 0,
                                yogaRoom: 0,
                                powerRack: 0,
                                smithMachine: 0,
                                chiningDippingMachine: 0,
                                cableMachine: 0,
                                runningMachine: 0,
                                bench: 0,
                                inclineBench: 0,
                                declineBench: 0,
                                hackSquatMachine: 0,
                                barbell: 0,
                                ezBar: 0,
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
                                <Card.Header><strong>새로운 헬스장 등록하기</strong></Card.Header>
                                <Card.Body>
                                    <Card.Title as="h5">
                                        <Form.Control
                                            size="lg"
                                            type='text'
                                            placeholder="헬스장 이름"
                                            aria-describedby="inputGroupPrepend"
                                            name="name"
                                            onChange={handleChange}
                                            isInvalid={!!errors.name}
                                        />
                                        <Form.Control.Feedback type="invalid">
                                            {errors.name}
                                        </Form.Control.Feedback>
                                    </Card.Title>
                                    <Card.Text>{this.props.gym.address}</Card.Text>
                                </Card.Body>
                                <div className='p-2'>
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
                                </div>    
                            </Form>
                            )}
                        </Formik>
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

export default GymInsert