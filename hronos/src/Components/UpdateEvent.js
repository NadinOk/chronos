import React, { Component } from "react";
import axios from "axios";
import { connect } from "react-redux";
import Select from "react-select";
import { Button } from "react-bootstrap";
import { makeStyles } from '@material-ui/core/styles';
import { TextField } from "@material-ui/core";
import Chip from '@material-ui/core/Chip';


class UpdateEvent extends Component {
    constructor(props) {
        super(props);
        this.state = {
            event: {
                id: +this.props.match.params.event_id,
                title: null,
                begin_at: null,
                end_at: null,
                calendar_id: null,
                content: null,
                email: null,
                event_type: null
            },
            calendars: [],
            chipData: []
        }
        console.log(this.state.chipData)
        this.eventUpdate = this.eventUpdate.bind(this)

    }

    getCalendars() {
        axios.defaults.headers['authorization'] = localStorage.getItem('token');
        axios.get(`http://localhost:8080/api/calendar`, {params: {user: this.props.currentUser.id}}).then(
            (res) => {

                this.setState({
                    ...this.state, calendars: res.data.map((item) => {
                        return {value: item.id, label: item.name}
                    })
                })
            }
        ).catch((err) => {
            if (err.response?.status === 401) {
                this.props.onUserLoggedOut()
            }
        })
    }

    getCurrentEvent() {
        axios.defaults.headers['authorization'] = localStorage.getItem('token');
        axios.defaults.headers.post['Access-Control-Allow-Origin'] = true
        if (!localStorage.getItem('token')) {
            window.location.href = 'http://localhost:3000/login'
        }
        axios.get(`http://localhost:8080/api/event/${this.state.event.id}`).then(
            (res) => {

                this.setState({...this.state, event: res.data, chipData: res.data.subscribers.map((item) => {
                    return {key: 2, value: item};
                })})

            }
        ).catch((err) => {
            if (err.response?.status === 401) {
                this.props.onUserLoggedOut()
            }
        })
    }

    handleTypeEventChange = event => {
        this.setState({
            calendars: this.state.calendars,
            event: {...this.state.event, type: event.target.value}
        })
    }

    handleTitleChange = event => {
        this.setState({
            calendars: this.state.calendars,
            event: {...this.state.event, title: event.target.value}
        })
    }

    handleCalendarChange = event => {
        this.setState({
            calendars: this.state.calendars,
            event: {...this.state.event, calendar_id: event.value}
        })
    }

    handleDateChange = event => {
        switch (event.target.id) {
            case "begin_at_date":
                this.setState({
                    calendars: this.state.calendars,
                    event: {
                        ...this.state.event,
                        begin_at: `${event.target.value}T${this.state.event.begin_at.split('T')[1]}`
                    }
                })
                break
            case "begin_at_time":
                this.setState({
                    calendars: this.state.calendars,
                    event: {
                        ...this.state.event,
                        begin_at: `${this.state.event.begin_at.split('T')[0]}T${event.target.value}:00.000Z`
                    }
                })
                break
            case "end_at_date":
                this.setState({
                    calendars: this.state.calendars,
                    event: {
                        ...this.state.event,
                        end_at: `${event.target.value}T${this.state.event.end_at.split('T')[1]}`
                    }
                })
                break
            case "end_at_time":
                this.setState({
                    calendars: this.state.calendars,
                    event: {
                        ...this.state.event,
                        end_at: `${this.state.event.end_at.split('T')[0]}T${event.target.value}:00.000Z`
                    }
                })
                break
            default:
                break
        }
    }

    handleContentChange = event => {
        this.setState({
            calendars: this.state.calendars,
            event: {...this.state.event, content: event.target.value}
        })
    }

    componentDidMount() {
        this.getCurrentEvent();
        this.getCalendars();
    }

    onChange = chips => {
        this.setState({chips});
    }

    eventUpdate() {
        axios.patch(`http://localhost:8080/api/event/${this.state.event.id}`, {...this.state.event, subscribers: this.state.chipData.map(item => item.value)}).then(
            (res) => {}

        ).catch((error) => {
            if (error.response?.status === 401) {
                this.props.onUserLoggedOut()
            }
        }).finally(() => {
            alert("Event updated")
            window.location.href = "http://localhost:3000"
        })
    }

    handleDelete() {
        window.alert('delete')
    }

    invite = event => {
        const data = {
            key: 2,
            value: event.target.value
        }
        if (event.keyCode === 13) {
            event.preventDefault()
            const chipsData = this.state.chipData;
            chipsData.push(data);
            this.setState({...this.state, chipData: chipsData})
            event.target.value = ''
        }
    }

    deleteChip = event => {
        this.setState({...this.state, chipData: this.state.chipData.filter(item => item.value !== event.target.innerText)})
    }

    render() {
        let chips;
        if (this.state.chipData.length) {
            console.log(this.state)
            chips = this.state.chipData.map((data) => {
                return (<Chip label={data.value} onClick={this.deleteChip}/>)
            })
        }
        return (
            <>
                <div className="container-event">
                    <span>New Event</span>
                    <div className="tcontainer-text">
                        <input
                            id="title"
                            type="text"
                            style={{color: "white"}}
                            placeholder="Title"
                            value={this.state.event.title ? this.state.event.title : ''}
                            onChange={this.handleTitleChange}/>
                        <br/>
                        <br/>
                        <input
                            id="begin_at_date"
                            type="date"
                            style={{color: "white"}}
                            placeholder="begin_at_date"
                            value={this.state.event.begin_at ? this.state.event.begin_at.split('T')[0] : ''}
                            onChange={this.handleDateChange}/>

                        <input
                            id="begin_at_time"
                            type="time"
                            style={{color: "white"}}
                            placeholder="begin_at_time"
                            value={this.state.event.begin_at ? this.state.event.begin_at.split('T')[1].split('.')[0] : ''}
                            onChange={this.handleDateChange}/>
                        <br/>
                        <br/>
                        <input
                            id="end_at_date"
                            type="date"
                            style={{color: "white"}}
                            placeholder="end_at_date"
                            value={this.state.event.end_at ? this.state.event.end_at.split('T')[0] : ''}
                            onChange={this.handleDateChange}/>

                        <input
                            id="end_at_time"
                            type="time"
                            style={{color: "white"}}
                            placeholder="end_at_time"
                            value={this.state.event.end_at ? this.state.event.end_at.split('T')[1].split('.')[0] : ''}
                            onChange={this.handleDateChange}/>
                        <br/>
                        <br/>
                        <input
                            id="content"
                            type="text"
                            style={{color: "white"}}
                            placeholder="Content"
                            value={this.state.event.content ? this.state.event.content : ''}
                            onChange={this.handleContentChange}/>
                        <br/>
                        <br/>
                        <div id="chips">
                            {chips}
                        </div>
                        <TextField id="standard-basic" type="email" label="Invite by email" onKeyDown={this.invite}/>
                        <br/>
                        <br/>
                        <div className="input-group mb-3">
                            <div className="input-group-prepend">
                                <label className="input-group-text" htmlFor="inputGroupSelect01">Options</label>
                            </div>
                            <select className="custom-select" id="inputGroupSelect01"
                                    onChange={this.handleTypeEventChange}>
                                {/*<option selected>Event type...</option>*/}
                                <option value="arrangement">arrangement</option>
                                <option value="task">task</option>
                                <option value="reminder">reminder</option>
                            </select>
                        </div>
                        <Select id={"test"}
                                onChange={this.handleCalendarChange}
                                options={this.state.calendars}
                                value={this.state.calendars.length && this.state.event.calendar_id ? {
                                    value: this.state.calendars.find(item => item.value === this.state.event.calendar_id).value,
                                    label: this.state.calendars.find(item => item.value === this.state.event.calendar_id).label
                                } : ''}
                        />
                        <Button onClick={this.eventUpdate}>Add</Button>
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
        onUserLoggedOut: () => dispatch({type: 'LOGOUT'})
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(UpdateEvent);