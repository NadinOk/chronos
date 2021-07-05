import React, { Component } from "react";

import axios from "axios";
import {  Media} from "react-bootstrap";
import { connect } from "react-redux";



class Security extends Component {
    constructor(props) {
        super(props);

        this.handleChange = this.handleChange.bind(this);
    }
    handleChange = event => {
        this.setState({[event.target.id]: event.target.value});
    }
    handleSendMail = event => {
        event.preventDefault()
        if (this.props.currentUser) {
            axios.defaults.headers['authorization'] = localStorage.getItem('token');
            axios.post(`http://localhost:8080/api/auth/password-reset`, {email: this.props.currentUser.email} )
                .then(res => {
                    this.state.password_reset.push(res.data)
                    this.setState({password_reset: this.state.password_reset})
                })
                .catch(err => {
                    if (err.response?.status === 401) {
                        this.props.onUnauthorizedError()
                    }
                }).finally(() => {

                window.alert('Email sent! Check your mail!')
                window.location.href = 'http://localhost:3000'

            })
        }
    }

    render() {

        return (
            <>
                <div className="container-event">
                    {/*<span>New Event</span>*/}
                    <div className="tcontainer-text">
                            <Media className="m-5 ">
                                <Media.Body className="text-post ">
                                    <label >Send link to e-mail</label>
                                    <div className="row">
                                        <form className="col s12">
                                            <button onClick={this.handleSendMail}>Reset password</button>
                                        </form>
                                    </div>
                                </Media.Body>
                            </Media>
                    </div>
                </div>
            </>



        )
    }
}

const mapStateToProps = state => {
    return {
        currentUser: state.currentUser
    }
}
const mapDispatchToProps = dispatch => {
    return {
        onUnauthorizedError: () => dispatch({type: 'LOGOUT'})
    }
}

export default connect(mapStateToProps, mapDispatchToProps) (Security);