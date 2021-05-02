import {BrowserRouter, Route} from "react-router-dom";
import SignUp from "./SignUp";
import Login from "./Login";
import React, {useState, useEffect} from 'react';
import NavBarAuth from "./NavBarAuth";
import Bookmaker from "./Bookmaker";
import Admin from "./Admin";
import User from "./User";

function Content() {
    const qs = require("qs")
    const [user, setUser] = useState(qs.parse(sessionStorage.getItem('user')));
    const initialUser = {
        username: '',
        password: ''
    };
    const [loggedIn, setLoggedIn] = useState(false)

    useEffect(() => {
            if (user) {
                if (user.token) {
                    if (user.token !== '') {
                        setLoggedIn(true)
                    }
                }
            }
        }, [user]
    )

    const logOut = () => {
        setUser(initialUser)
        setLoggedIn(false)
        sessionStorage.removeItem('user')
    }

    return (
        <div>
            <BrowserRouter>
                <NavBarAuth user={user} loggedIn={loggedIn} logOut={logOut}/>
                <div className={"container"}>
                    <Route exact path="/signup">
                        <SignUp/>
                    </Route>
                    <Route exact path="/login">
                        <Login initialUser={initialUser} setUser={setUser} setLoggedIn={setLoggedIn}
                               loggedIn={loggedIn}/>
                    </Route>
                    <Route exact path={"/"}>
                        {(user.role === "User") &&
                        <div>
                            <User loggedIn={loggedIn} token={user.token}/>
                        </div>
                        }
                        {(user.role === "Admin") &&
                        <div>
                            <Admin loggedIn={loggedIn} token={user.token}/>
                        </div>
                        }
                        {(user.role === "Bookmaker") &&
                        <div>
                            <Bookmaker loggedIn={loggedIn} token={user.token}/>
                        </div>
                        }
                    </Route>
                </div>
            </BrowserRouter>
        </div>
    );
}

export default Content;