import React, {Component} from "react"
import axios from "axios";
import { connect } from "react-redux";
// import Login from "./Login";
// import {Route} from "react-router-dom";


 class Register extends Component {
    constructor(props) {
        super(props);
        this.state = {};

        this.handleChange = this.handleChange.bind(this);
        this.handleSubmit = this.handleSubmit.bind(this);
    }

    handleChange = event => {
        this.setState({[event.target.id]: event.target.value});
    }

    handleSubmit = event => {
        event.preventDefault();
        axios.defaults.headers.post['Access-Control-Allow-Origin'] = true;
        axios.post(`http://localhost:8080/api/auth/register`, this.state)
            .then(res => {
                console.log(this.state)
                console.log(res)
            }).catch((err) => {
            if (err.response?.status === 400) {
                console.log("errrr")
            }
            else if (err.response?.status === 401) {
                this.props.onUserLoggedOut()
            }
        }).finally(() => {
            alert("A confirmation email has been sent to your mail, follow there!")
            window.location.href = 'http://localhost:3000'
        })
    }

    render() {
            const state = this.state
        console.log(state)
        return (<div className="container-reg">
                            <span>Sing in</span>
                            <div className="container-text">
                                <div >
                                    <input placeholder="login"
                                           id="login"
                                           type="text"
                                           name="login"
                                           className="blue-input"
                                           onChange={this.handleChange}
                                    />
                                    {/*<label htmlFor="login">Login</label>*/}
                                </div><br/>

                                <div >
                                    <input placeholder="enter password"
                                           id="password"
                                           type="password"
                                           name="password"
                                           onChange={this.handleChange}
                                    />
                                    {/*<label htmlFor="Password">Password</label>*/}
                                </div><br/>

                                <div className="input-field ">
                                    <input placeholder="full name"
                                           id="full_name"
                                           type="text"
                                           name="full_name"
                                           onChange={this.handleChange}
                                    />
                                    {/*<label htmlFor="full name">Full name</label>*/}
                                </div><br/>

                                <div className="input-field ">
                                    <input placeholder="enter email"
                                           id="email"
                                           type="text"
                                           name="email"
                                           onChange={this.handleChange}
                                    />

                                </div><br/>
                            </div>
                        <div className="card-action">
                            <button className="button-custom">Login</button>
                            <button onClick={this.handleSubmit} className="btn-resset" style={{background: "green"}} >Registration</button>
                        </div>
            </div>
        )
    }
}

const mapDispatchToProps = dispatch => {
    return {
        onUnauthorizedError: () => dispatch({type: 'LOGOUT'})
    }
}

export default connect( mapDispatchToProps)(Register);