import React, { Component } from "react";
import './Top.css';
import { Image, Navbar, Nav } from "react-bootstrap";

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
                <Image src="/image/search.png"
                    width="30"
                    onClick={() => {
                        this.props.onIsSearchModeChange(true)
                    }}/>
            </Navbar>
            </>
        )
    }
}

export default ZymContent