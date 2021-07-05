import React, { Component } from "react"
import { connect } from 'react-redux'
import { Button } from "react-bootstrap";
import Select from 'react-select'
import axios from "axios";
import Chip from "@material-ui/core/Chip";
import { TextField } from "@material-ui/core";


class NewEvent extends Component {
    constructor(props) {
        super(props);
        this.state = {
            calendars: [],
            chipData: []
        }
        this.newEvent = {
            title: null,
            begin_at_date: null,
            begin_at_time: null,
            end_at_date: null,
            end_at_time: null,
            calendar_id: null,
            content: null,
            email: null,
            event_type: null
        }


        this.handleTitleChange = this.handleTitleChange.bind(this);
        this.handleCalendarChange = this.handleCalendarChange.bind(this);
        this.handleSubmit = this.handleSubmit.bind(this);
    }
    handleTypeEventChange = event => {
        this.newEvent.event_type = event.target.value
    }

    handleTitleChange = event => {
        this.newEvent.title = event.target.value
    }

    handleCalendarChange = event => {
        this.newEvent.calendar_id = event.value
    }

    handleDateChange = event => {
        switch (event.target.id) {
            case "begin_at_date":
                this.newEvent.begin_at_date = event.target.value
                break
            case "begin_at_time":
                this.newEvent.begin_at_time = event.target.value
                break
            case "end_at_date":
                this.newEvent.end_at_date = event.target.value
                break
            case "end_at_time":
                this.newEvent.end_at_time = event.target.value
                break
            default:
                break
        }
    }

    handleContentChange = event => {
        this.newEvent.content = event.target.value
    }




    getCalendars() {
        axios.defaults.headers['authorization'] = localStorage.getItem('token');
        axios.get('http://localhost:8080/api/calendar', {params: {user: this.props.currentUser.id}}).then(
            (res) => {
                this.setState({calendars: res.data.map((item) => {
                    return {value: item.id, label: item.name}
                    })})
            }
        ).catch((error) => {
            if (error.response?.status === 401) {
                this.props.onUserLoggedOut()
            }
        })
    }

    handleSubmit = event => {
        event.preventDefault()
        let beginAt = new Date(this.newEvent.begin_at_date + 'T' + this.newEvent.begin_at_time + ':00')
        let endAt = new Date(this.newEvent.end_at_date + 'T' + this.newEvent.end_at_time + ':00')

        if (this.props.currentUser) {
            axios.defaults.headers['authorization'] = localStorage.getItem('token');
            axios.post(`http://localhost:8080/api/event/`, {...this.newEvent, begin_at: beginAt, end_at: endAt, subscribers: this.state.chipData.map(item => item.value)})
                .then(res => {
                    this.props.onNewEvent(res.data)
                    window.location.href = 'http://localhost:3000'
                })
                .catch(err => {
                    if (err.response?.status === 401) {
                        this.props.onUserLoggedOut()
                    }
                }).finally(() =>{
                window.location.href = 'http://localhost:3000'
            })
        }
    }
    componentDidMount() {
        this.getCalendars();
    }
    onChange = chips => {
        this.setState({chips});
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
            <div className="container-event">
                <span>New Event</span>
                <div className="tcontainer-text">
                    <input
                        id="title"
                        type="text"
                        style={{color: "white"}}
                        placeholder="Title"
                        onChange={this.handleTitleChange}/>
                    <br/>
                    <br/>
                    <input
                        id="begin_at_date"
                        type="date"
                        style={{color: "white"}}
                        placeholder="begin_at_date"
                        onChange={this.handleDateChange}/>

                    <input
                        id="begin_at_time"
                        type="time"
                        style={{color: "white"}}
                        placeholder="begin_at_time"
                        onChange={this.handleDateChange}/>
                    <br/>
                    <br/>
                    <input
                        id="end_at_date"
                        type="date"
                        style={{color: "white"}}
                        placeholder="end_at_date"
                        onChange={this.handleDateChange}/>

                    <input
                        id="end_at_time"
                        type="time"
                        style={{color: "white"}}
                        placeholder="end_at_time"
                        onChange={this.handleDateChange}/>
                    <br/>
                    <br/>
                    <input
                        id="content"
                        type="text"
                        style={{color: "white"}}
                        placeholder="Content"
                        onChange={this.handleContentChange}/>
                    <br/>
                    <br/>
                    {/*<input*/}
                    {/*    id="email"*/}
                    {/*    type="email"*/}
                    {/*    style={{color: "white"}}*/}
                    {/*    placeholder="email"*/}
                    {/*    onChange={this.handleMailChange}/>*/}
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
                         <select className="custom-select" id="inputGroupSelect01" onChange={this.handleTypeEventChange}>
                            {/*<option selected>Event type...</option>*/}
                            <option value="arrangement">arrangement</option>
                            <option value="task">task</option>
                            <option value="reminder">reminder</option>
                        </select>
                    </div>
                    <Select onChange={this.handleCalendarChange} options={this.state.calendars}  />
                    <Button onClick={this.handleSubmit}>Add</Button>

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

export default connect(mapStateToProps, mapDispatchToProps)(NewEvent);