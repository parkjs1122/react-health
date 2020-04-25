import React, { Component } from "react";
import './Top.css';
import { Image, Navbar, Nav, Form, Button } from "react-bootstrap";
import { Formik } from 'formik';
import * as Yup from 'yup';

class ZymContent extends Component {
    render(){
        const schema = Yup.object({
            searchText: Yup.string().required('검색어를 입력해주세요.')
        })
        
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
                <Formik
                    validationSchema={schema}
                    onSubmit={values => {
                        fetch(process.env.REACT_APP_SERVER_HOST + '/gym/get/name/' + values.searchText + '/' + this.props.nowLon + '/' + this.props.nowLat)
                        .then(response => response.json())
                        .then(data => {
                            this.props.onSearchResultChange(data);
                        })
                    }}
                    initialValues={{
                        searchText: null
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
                    <Form action="#" noValidate onSubmit={handleSubmit} inline>
                        <Form.Control
                            type="text"
                            name="searchText"
                            onChange={handleChange}
                            placeholder="헬스장 이름"
                            className="mr-sm-2" />
                        <Button type='submit' variant="outline-primary">검색</Button>
                        <Form.Control.Feedback type="invalid">
                            {errors.searchText}
                        </Form.Control.Feedback>
                    </Form>
                    )}
                </Formik>
            </Navbar>
            </>
        )
    }
}

export default ZymContent