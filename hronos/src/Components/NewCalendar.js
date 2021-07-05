import React, { Component } from "react"
import { connect } from 'react-redux'
import { Button } from "react-bootstrap";
import axios from "axios";


class NewCalendar extends Component {
    constructor(props) {
        super(props);
        this.newCalendar = {
            nameCalendar: null,
            colorCalendar: null
        }


        this.handleChange = this.handleChange.bind(this);
        this.handleSubmit = this.handleSubmit.bind(this);

    }

    handleChange = event => {
            this.newCalendar.nameCalendar = event.target.value

    }
    handleChangeColor = event => {
        this.newCalendar.colorCalendar = event.target.value

    }

    handleSubmit = event => {
        if (this.props.currentUser) {
            event.preventDefault()

            axios.defaults.headers['authorization'] = localStorage.getItem('token');

            axios.post(`http://localhost:8080/api/calendar/`, {...this.newCalendar, user_id: this.props.currentUser.id })
                .then(res => {
                    this.props.onNewCalendar(res.data)
                }).catch((err) => {
                    if (err.response?.status === 401) {
                        this.props.onUserLoggedOut()
                    }
                }).finally( () => {
                    alert("calendar created")
                    window.location.href = 'http://localhost:3000'
            })
        }
    }

    render() {
        return (
            <div className="container-event">
                <span >New Calendar</span>
                <div className="tcontainer-text">
                    <input
                        id="name"
                        type="text"
                        style={{color: "white", marginTop: 30}}
                        placeholder="name calendar"
                        onChange={this.handleChange}/>
                    <br/>
                    <br/>
                    <input
                        id="color"
                        type="color"
                        style={{color: "white", width: 100}}
                        placeholder="color"
                        onChange={this.handleChangeColor}/>
                    <br/>
                    <br/>
                    <Button style={{margin: 9}} onClick={this.handleSubmit}>Add</Button>
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
        onUserLoggedOut: () => dispatch({type: 'LOGOUT'})
    }
}


export default connect(mapStateToProps,  mapDispatchToProps)(NewCalendar);