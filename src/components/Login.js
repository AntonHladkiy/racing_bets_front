import React , {useState} from 'react';
import axios from 'axios';
import {Redirect} from "react-router-dom";

const Login = props => {
    const qs = require ( "qs" )
    const [user , setUser] = useState ( props.initialUser );

    const handleInputChange = event => {
        const { name , value } = event.target
        setUser ( { ...user , [name]: value } )
    };

    if (props.loggedIn === true) {
        return <Redirect to="/"/>
    }

    const logIn = () => {
        console.log ( "logIn start" )
        console.log ( user )
        axios.post ( 'http://localhost:3001/login' , {
            username: user.username ,
            password: user.password
        } , {
            headers: {
                'Content-Type': 'application/json'
            }
        } ).then ( res => {
            console.log ( "logIn res" )
            sessionStorage.setItem ( 'user' , qs.stringify ( {
                token: res.data.token ,
                role: res.data.role ,
                username: res.data.username
            } ) )
            props.setUser ( {
                token: res.data.token ,
                role: res.data.role ,
                username: res.data.username
            } )
            props.setLoggedIn ( true )
        } ).catch ( error => console.log ( error ) )
    }

    return (
        <form className={ "form-check" } autoComplete="off">
            <div className="form-group row">
                <label className="col-sm-2 col-form-label">Username</label>
                <div className="col-sm-10">
                    <input className="form-control" placeholder={ "Username" } type="text" value={ user.username }
                           name="username" onChange={ handleInputChange }/>
                </div>
            </div>
            <div className="form-group row">
                <label className="col-sm-2 col-form-label">Password</label>
                <div className="col-sm-10">
                    <input className="form-control" placeholder={ "Password" } value={ user.password } name="password"
                           type="password" onChange={ handleInputChange }/>
                </div>
            </div>
            <button className={ "btn btn-primary" } type="button" onClick={ logIn }>Log in</button>
        </form>
    )
}

export default Login;