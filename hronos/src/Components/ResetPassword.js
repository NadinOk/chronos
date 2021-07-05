import React, { Component } from "react";
import { Button} from "react-bootstrap";
import axios from "axios";
import { connect } from "react-redux";

class ResetPassword extends Component {
    constructor(props) {
        super(props);
        this.state = {
            password: ""
        }
    }

    handleChange = event => {
        event.preventDefault()
        this.setState({ password: event.target.value})
    }

    submitNewPass = event => {
        // event.preventDefault()
        axios.defaults.headers['authorization'] = localStorage.getItem('token');
        const arr = window.location.href.split('/')
        const token = arr[arr.length - 1]
        axios.post(`http://localhost:8080/api/auth/password-reset/confirm-token/${token}`, {password: this.state.password})
            .then(res => {
                console.log(res)
            }).catch(e => {
                if (e.response?.status === 401) {
                    this.props.onUserLoggedOut()
                }
        }).finally(() => {
            window.location.href = ('http://localhost:3000/login')
        })
    }

    render() {
        return (
            <div className="container-event">
                {/*<span>New Event</span>*/}
                <div className="tcontainer-text">
                <form>
                    <input type="password"
                           placeholder="new password"
                           value={this.state.password}
                           onChange={this.handleChange}
                           style={{color: "white"}}/>
                    <Button type="submit"  onClick={this.submitNewPass}>send</Button>
                </form>
                </div>
            </div>
        )
    }
}
const mapDispatchToProps = dispatch => {
    return {
        onUserLoggedOut: () => dispatch({type: 'LOGOUT'})
    }
}

export default connect(mapDispatchToProps)( ResetPassword)