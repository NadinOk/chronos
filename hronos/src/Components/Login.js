import React, { Component } from "react"
import axios from "axios";
import { connect } from 'react-redux'


 class Login extends Component {

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
        event.preventDefault()
        axios.defaults.headers.post['Access-Control-Allow-Origin'] = true
        axios.post(`http://localhost:8080/api/auth/login`, this.state)
            .then(res => {
                localStorage.setItem('token', res.data.token)
                axios.defaults.headers['authorization'] = localStorage.getItem('token')
                axios.get(`http://localhost:8080/api/users/${res.data.user_id}`)
                    .then((userData) => {
                        this.props.onUserLoggedIn(userData.data)
                    }).catch((e) => {
                    if (e.response?.status === 401) {
                        this.props.onUserLoggedOut()
                    }

                })
                    .finally(() => {

                        window.location.href = 'http://localhost:3000'
                    })
            }).catch((err) => {
            if (err.response?.status === 400) {
                alert('Неверные email или password, попробуйте снова')
            }
        })
    }

    render() {
        return (

            <div className="container-reg">
                <span>Log in</span>
                <div className="container-text">

                    <div>
                        <input placeholder="email"
                               id="email"
                               type="text"
                               name="email"
                               onChange={this.handleChange}
                        />
                    </div><br/>
                    <div>
                        <input placeholder=" password"
                               id="password"
                               type="password"
                               name="password"
                               onChange={this.handleChange}

                        />
                    </div><br/>
                    <div>
                        <button onClick={this.handleSubmit} className="button-login">Login</button>
                    </div><br/>
                    <a href="/reset-password-to-email" style={{color: "rosybrown"}}>Востановить пароль</a>
                </div>
            </div>

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
        onUserLoggedIn: (user) => dispatch({type: 'LOGIN', payload: {currentUser: user}})
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(Login)
