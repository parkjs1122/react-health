import React, { Component } from "react";
import { Form, Card } from "react-bootstrap";

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
            <div className='rightPage'>
                <Card>
                    <Card.Header as="h5">필터</Card.Header>
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