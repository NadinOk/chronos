import React, {Component} from "react";
import axios from "axios";
// import {Button, Col, Container, Media, Row} from "react-bootstrap";
import Moment from 'react-moment'
import {connect} from "react-redux";



class Profile extends Component {
    constructor(props) {
        super(props);
        this.state = {events: []}


        this.handleChange = this.handleChange.bind(this)

    }


    handleChange = event => {
        this.setState({events: event.target.value});
    }

    componentDidMount() {

        // this.getCalendars()
        axios.defaults.headers['authorization'] = localStorage.getItem('token');
        if (this.props.currentUser) {
            axios.get('http://localhost:8080/api/event', {params: {user: this.props.currentUser.id}}).then(
                (res) => {
                    // console.log(res.data)
                    this.setState({
                        events: res.data.map((item) => {
                            return {
                                id: item.id,
                                content: item.content,
                                title: item.title,
                                start: item.begin_at,
                                end: item.end_at,
                                color: item.calendar_entity.color,
                                name: item.calendar_entity.name
                            }
                        })
                    })
                }
            ).catch((err) => {
                if (err.response?.status === 401) {
                    this.props.onUserLoggedOut()
                }
            })
        }
    }

    render() {
        // console.log("event")
       console.log(this.state.events)

        return (
            <>
                <div className="container-event">
                    <div>{this.state.events.map((eventElement, i) =>
                                            <div  className="tcontainer" key={i} >
                                                <div className="content">

                                                <h4> {this.props.currentUser.login}</h4>
                                                    <a style={{color: "darkgray"}} href={`update/event/${eventElement.id}`}><h5 >Title: <br/>{eventElement.title}</h5></a>
                                                    <p align="left"> Content: <br/>{eventElement.content} </p>
                                                    <p align="left">Event at: <br/><Moment format="DD.MM.YYYY HH:mm"
                                                                           date={eventElement.begin_at}></Moment>
                                                </p>
                                                <p align="left">Event and: <br/><Moment format="DD.MM.YYYY HH:mm"
                                                                          date={eventElement.end_at}></Moment>
                                                </p>
                                                <p align="left">Calendar: <br/>{eventElement.name}</p>

                                                </div>
                                                </div>)}
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

export default connect(mapStateToProps, mapDispatchToProps)(Profile);
