import React, { Component } from "react";
import { Button, Modal } from "react-bootstrap";

class ShowModal extends Component {
    constructor(props) {
        super(props);
        this.handleChange = this.handleChange.bind(this);
    }

    handleChange(e) {
        this.props.onIsShowChange(e.target.value)
    }

    render() {
        const isShow = this.props.isShow;
        return (
            <>   
            <Modal show={isShow}>
                <Modal.Header closeButton>
                <Modal.Title>안내</Modal.Title>
                </Modal.Header>
                <Modal.Body>{this.props.message}</Modal.Body>
                <Modal.Footer>
                <Button variant="secondary" value='false' onClick={this.handleChange}>
                    닫기
                </Button>
                </Modal.Footer>
            </Modal>
            </>
        );
    }
}
  
export default ShowModal