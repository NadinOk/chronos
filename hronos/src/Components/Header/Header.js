import React, { Component } from "react"
import { Navbar, Nav, Container, NavLink} from "react-bootstrap";
import axios from "axios";
import { connect } from 'react-redux'


class Header extends Component {

    constructor(props) {
        super(props);
        this.menu = React.createRef();
        this.isMenuOpen = false;
    }

    handleSubmit = event => {

        event.preventDefault();
        axios.defaults.headers.post['Access-Control-Allow-Origin'] = true;
        if (!localStorage.getItem('token')) {
            window.location.href = 'http://localhost:3000/login'
        }
        axios.post(`http://localhost:8080/api/auth/logout`, this.state)
            .then(res => {
                axios.defaults.headers['authorization'] = localStorage.removeItem('token');
                this.props.onUserLoggedOut()

            })
    }
    showSettings (event) {
        event.preventDefault();
    }

    toggleMenu = event => {
        this.menu.current.style.display = this.isMenuOpen ? "none" : "initial"
    }

    render() {

        let loginLogoutButton, loginButton, regButton, avatar;

      if (this.props.currentUser && localStorage.getItem('token')) {
            loginLogoutButton = <NavLink onClick={this.handleSubmit} className="btn"><h4>Log out</h4></NavLink>
            avatar = <img style={{height: 50, width: 50, marginLeft: 10}}
                          src={`http://localhost:8080/${this.props.currentUser.profile_picture}`}/>
            regButton = null
            loginButton = null
        } else  {
           // alert("Вы не аторизированы на сайте, пожалуйса войдите в свой акаунт")
            loginButton = <NavLink href="/login"><h4>Log in</h4></NavLink>
            regButton = <NavLink href="/register"><h4>Sing up</h4></NavLink>
            avatar = null
            loginLogoutButton = null
        }
        return (
            <>
                <Navbar  className="menu-navbar"   >
                    <Container>
                        <Navbar.Brand href="/">
                            <h1 style={{marginTop: 8}}>Event-Calendar</h1>
                        </Navbar.Brand>
                        <Navbar.Toggle/>
                                <Nav>
                                    <main>
                                        <div className="menu-block">
                                            <nav className="menu-nav" style={{marginTop: 10}}>
                                                <button style={{backgroundColor: "darkgray"}} ><a href="/new_calendar">New calendar </a></button>
                                                <a href="/event/create">New event </a>
                                                <a href="/settings">Settings </a>
                                                <a href="/security">Security </a>
                                                <a href="profile">Profile</a>
                                            </nav>
                                        </div>
                                        </main>
                                    {regButton}
                                    {loginLogoutButton}
                                    {loginButton}
                                    {avatar}

                                </Nav>
                    </Container>
                </Navbar>
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

export default connect(mapStateToProps, mapDispatchToProps)(Header)
