import React , {useState} from 'react';
import axios from 'axios';
import {Link} from "react-router-dom";

const SignUp = () => {
    const initialUser = {
        surname: '' ,
        username: '' ,
        password: '' ,
        role: ''
    };
    const [user , setUser] = useState ( initialUser );

    const handleInputChange = event => {
        const { name , value } = event.target
        setUser ( { ...user , [name]: value } )
    };

    const signUp = () => {
        axios.post ( 'http://localhost:3001/signup' , {
            username: user.username ,
            password: user.password ,
            role: user.role
        } , {
            headers: {
                'Content-Type': 'application/json'
            }
        } ).then ( resp => (
            console.log ( resp.data )
        ) ).catch ( error => console.log ( error ) )
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
            <div className="form-group row">
                <label className="col-sm-2 col-form-label">Role</label>
                <div className="col-sm-10">
                    <select className="form-control" value={ user.role } name="role"
                            onChange={ handleInputChange }>
                        <option value={ "User" }>
                            User
                        </option>
                        <option value={ "Admin" }>
                            Admin
                        </option>
                        <option value={ "Bookmaker" }>
                            Bookmaker
                        </option>
                        <option disabled hidden value={ "" }>{ "Select role" }</option>
                    </select>
                </div>
            </div>
            <Link to={ "/login" }>
                <button className={ "btn btn-primary" } type="button" onClick={ signUp }>Sign Up</button>
            </Link>
        </form>
    )
}

export default SignUp;