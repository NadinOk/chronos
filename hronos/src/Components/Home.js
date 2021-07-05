import React, { Component } from 'react'
import FullCalendar from '@fullcalendar/react'
import dayGridPlugin from '@fullcalendar/daygrid'
import interactionPlugin from "@fullcalendar/interaction"
import timeGridPlugin from '@fullcalendar/timegrid'
import listPlugin from '@fullcalendar/list';

import axios from "axios";
import { connect } from "react-redux";
import Select from "react-select";
import { Button } from "react-bootstrap";
import { TextField } from "@material-ui/core";
import Chip from "@material-ui/core/Chip";


class Home extends Component {
    constructor(props) {
        super(props);
        this.state = {
            newEvent: {
                title: null,
                begin_at_date: null,
                begin_at_time: null,
                end_at_date: null,
                end_at_time: null,
                calendar_id: null,
                content: null,
                email: null,
                event_type: null
            },
            chipData: [],
            events: [],
            calendars: [],
        }
        this.handleTitleChange = this.handleTitleChange.bind(this);
        this.handleCalendarChange = this.handleCalendarChange.bind(this);
        this.handleSubmit = this.handleSubmit.bind(this);
    }

    handleTypeEventChange = event => {
        this.state.newEvent.event_type = event.target.value
    }

    handleTitleChange = event => {
        this.state.newEvent.title = event.target.value
    }

    handleCalendarChange = event => {
        this.state.newEvent.calendar_id = event.value
    }

    handleDateChange = event => {
        switch (event.target.id) {
            case "begin_at_date":
                this.state.newEvent.begin_at_date = event.target.value
                break
            case "begin_at_time":
                this.state.newEvent.begin_at_time = event.target.value
                break
            case "end_at_date":
                this.state.newEvent.end_at_date = event.target.value
                break
            case "end_at_time":
                this.state.newEvent.end_at_time = event.target.value
                break
            default:
                break
        }
    }

    handleContentChange = event => {
        this.state.newEvent.content = event.target.value
    }
    handleMailChange = event => {
        this.state.newEvent.email = event.target.value
    }


    handleDateClick = event => {
        const beginDate = event.dateStr.split('T')[0]
        const beginTime = event.dateStr.includes('T') ? event.dateStr.split('T')[1] : null

        document.getElementById('begin_at_date').value = beginDate
        this.state.newEvent.begin_at_date = beginDate

        if (beginTime ) {
            document.getElementById('begin_at_time').value = beginTime.split('+')[0]
            this.state.newEvent.begin_at_time = beginTime
        }
        const modal = document.querySelector(".modal")
        const closeBtn = document.querySelector(".close")
        modal.style.display = "block";
        closeBtn.addEventListener("click", () => {
            modal.style.display = "none";
        })
        return event.dateStr
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

    getEvents() {
        axios.defaults.headers['authorization'] = localStorage.getItem('token');
        axios.defaults.headers.post['Access-Control-Allow-Origin'] = true
        if (!localStorage.getItem('token') || !this.props.currentUser) {
            window.location.href = 'http://localhost:3000/login'
        }
        axios.get('http://localhost:8080/api/event', {params: {user: this.props.currentUser.id}}).then(
            (res) => {
                this.setState({events: res.data.map((item) => {
                        return {id: item.id, content: item.content, title: item.title, start: item.begin_at , end: item.end_at, color: item.calendar_entity.color }
                    })})
            }
        ).catch((err) => {
            if (err.response?.status === 401) {
                this.props.onUserLoggedOut()
            }
        })
    }

    handleSubmit = event => {
        console.log(this.state)
        event.preventDefault()
        let beginAt = new Date(this.state.newEvent.begin_at_date + 'T' + this.state.newEvent.begin_at_time + ':00')
        let endAt = new Date(this.state.newEvent.end_at_date + 'T' + this.state.newEvent.end_at_time + ':00')


        if (this.props.currentUser) {
            axios.defaults.headers['authorization'] = localStorage.getItem('token');
            axios.post(`http://localhost:8080/api/event/`, {...this.state.newEvent, begin_at: beginAt, end_at: endAt, subscribers: this.state.chipData.map(item => item.value)})
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

    handleDeleteClick = event =>  {
        axios.delete(`http://localhost:8080/api/event/${event.event.id}`).then(
            (res) => {
                if(window.confirm("Are you sure you want to delete the event? If yes, click \"OK\"")) {
                    this.setState({events: this.state.events.filter(item => item.id !== +event.event.id)})
                } else {
                    return 0
                }
            }
        ).catch((err) => {
            if (err.response?.status === 401) {
                this.props.onUserLoggedOut()
            }
        })
    }

    componentDidMount() {
        this.getEvents()
        this.getCalendars();


    }

    eventDrop = event => {
        axios.patch(`http://localhost:8080/api/event/${event.event.id}`, {begin_at: event.event.start, end_at: event.event.end}).then(
            (res) => {
                this.setState({events: this.state.events.filter(item => item.id !== +event.event.id)})
            }
        ).catch((error) => {
            console.log(error)
        })

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
            <>

            <div   className="calendar-text">
                <body className="background"/>
                <div className="app">

                    <div style={{marginTop: 190, marginLeft: 400}} className="modal">
                        <div style={{marginLeft: 50}} className="modal_content">
                            <span className="close">&times;</span>
                            <div className="container-text">
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
                                {/*<br/>*/}
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
                                <Button style={{marginLeft: 100}} onClick={this.handleSubmit}>Add</Button>

                            </div>
                        </div>
                    </div>

                </div>
                <FullCalendar
                    weekNumbers={true}
                    initialView="dayGridMonth"
                    eventDurationEditable={true} // перетаскивание ивента
                    nowIndicator={true}
                    businessHours={{
                        daysOfWeek: [1, 2, 3, 4, 5],
                        startTime: '9:00 - 1',
                        endTime: '18:00',
                    }}
                    fixedWeekCount={false}
                    dayHeaders={true}
                    dayHeaderFormat={{weekday: 'long', month: 'short', day: 'numeric', omitCommas: true}
                    }
                    handleWindowResize={true}
                    eventDrop={this.eventDrop}
                    plugins={[dayGridPlugin, timeGridPlugin, interactionPlugin, listPlugin]}
                    editable={true}
                    headerToolbar={{
                        left: "prev,next,today", //"prevYear,prev,next,nextYear,today"
                        center: "title",
                        right: "dayGridMonth,timeGridWeek,timeGridDay,listWeek"
                    }}
                    events={this.state.events}
                    dateClick={this.handleDateClick}
                    eventClick={this.handleDeleteClick}

            />


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

export default connect(mapStateToProps, mapDispatchToProps)(Home);
