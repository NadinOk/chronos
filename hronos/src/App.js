import React from 'react'

import Header from "./Components/Header/Header";
import { BrowserRouter, Route } from "react-router-dom";
import Switch from "react-bootstrap/Switch";
import Login from "./Components/Login"
import Register from "./Components/Regitster"
import Home from "./Components/Home";
import NewEvent from "./Components/NewEvent";
import NewCalendar from "./Components/NewCalendar"
import Security from "./Components/Security";
import ResetPassword from "./Components/ResetPassword";
import ResetPasswordToEmail from "./Components/ResetPasswordToEmail";
import Profile from "./Components/Profile"
import Avatar from "./Components/Avatar";
import UpdateEvent from "./Components/UpdateEvent";


export default class App extends React.Component {
    render() {
        return (
            <>
                < Header/>
                <BrowserRouter>
                    <Switch>
                        <Route exact path="/" component={Home} />
                        <Route exact path="/login" component={Login}/>
                        <Route exact path="/register" component={Register}/>
                        <Route exact path="/event/create" component={NewEvent}/>
                        <Route exact path="/new_calendar" component={NewCalendar}/>
                        <Route exact path="/security" component={Security}/>
                        <Route exact path="/password-reset/:id" component={ResetPassword} />
                        <Route exact path="/reset-password-to-email" component={ResetPasswordToEmail} />
                        <Route exact path="/profile" component={Profile}/>
                        <Route exact path="/settings" component={Avatar}/>
                        <Route exact path="/update/event/:event_id" component={UpdateEvent}/>
                    </Switch>
                </BrowserRouter>
            </>
        )
    }
}

