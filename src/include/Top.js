import React, { Component } from "react";
import './Top.css';
import { Image, Navbar, Nav, Form, Button } from "react-bootstrap";

class ZymContent extends Component {
    render(){
        return(
            <>
            <Navbar bg="light" variant="light">
                <Navbar.Brand href="/">
                <Image
                    alt="헬스닷컴"
                    src="/logo512.png"
                    width="30"
                    height="30"
                    className="d-inline-block align-top"
                />{' '}
                헬스닷컴
                </Navbar.Brand>
                <Nav className="mr-auto" />
                <Form inline>
                    <Form.Control type="text" placeholder="헬스장 이름" className="mr-sm-2" />
                    <Button type='submit' variant="outline-primary">검색</Button>
                </Form>
            </Navbar>
            </>
        )
    }
}

export default ZymContent