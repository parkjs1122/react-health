import React, { Component } from "react";
import { Form, Card, Navbar, Image } from "react-bootstrap";

class MapFilter extends Component {
    constructor(props) {
        super(props);
        this.handleChange = this.handleChange.bind(this);
    }

    handleChange(e) {
        this.props.onFilterChange(e.target.name, e.target.checked)
    }

    render() {
        return (
            <div className='mapFilter'>
                <Navbar bg="light" variant="light">
                    <Navbar.Brand>
                        <Image
                            alt="뒤로가기"
                            src="/image/left-arrow.png"
                            width="30"
                            height="30"
                            className="d-inline-block align-top"
                            onClick={() => {
                                this.props.onIsFilterShowChange(false)
                            }}
                        />{' '}
                        필터
                    </Navbar.Brand>
                </Navbar>
                <Card>
                    <Card.Body>
                        <Form>
                            <Form.Group className='mb-1'>
                                <Form.Check 
                                    custom
                                    inline
                                    type="checkbox"
                                    name='isDailyUse'
                                    id='isDailyUse'
                                    label="일일입장가능"
                                    onChange={this.handleChange}
                                    checked={this.props.isDailyUse}
                                />
                            </Form.Group>
                            <Form.Group className='mb-1'>
                                <Form.Check 
                                    custom
                                    inline
                                    type="checkbox"
                                    name='isYogaRoom'
                                    id='isYogaRoom'
                                    label="요가룸"
                                    onChange={this.handleChange}
                                    checked={this.props.isYogaRoom}
                                />
                            </Form.Group>
                            <Form.Group className='mb-1'>
                                <Form.Check 
                                    custom
                                    inline
                                    type="checkbox"
                                    name='isPowerRack'
                                    id='isPowerRack'
                                    label="파워랙"
                                    onChange={this.handleChange}
                                    checked={this.props.isPowerRack}
                                />
                            </Form.Group>
                        </Form>
                    </Card.Body>
                </Card>
            </div>
        );
    }
}
  
export default MapFilter