import React, {useState, useEffect} from 'react';
import axios from "axios";

const Bookmaker = props => {
    const qs = require("qs")
    const initialRace = {
        name:'',
        runner_id1:'',
        runner_id2:'',
        coef1:'',
        coef2:''
    };
    const [race, setRace] = useState(initialRace);
    const [runners, setRunners] = useState([]);
    const [firstRunners, setFirstRunners] = useState([]);
    const [secondRunners, setSecondRunners] = useState([]);

    const handleInputChange = event => {
        const {name, value} = event.target
        if(name==="runner_id1"){
            let runnerToChange=firstRunners.filter((runner)=>runner.id.toString()===race.runner_id1)[0]
            if(runnerToChange) setSecondRunners(secondRunners=>[...secondRunners, runnerToChange]);
            setSecondRunners(secondRunners=>secondRunners.filter(runner=>runner.id.toString()!==value))
        }
        if(name==="runner_id2"){
            let runnerToChange=secondRunners.filter(runner=>runner.id.toString()===race.runner_id2)[0]
            if(runnerToChange) setFirstRunners(firstRunners=>[...firstRunners, runnerToChange]);
            setFirstRunners(firstRunners=>firstRunners.filter(runner=>runner.id.toString()!==value))
        }
        setRace({...race, [name]: value})
    };

    useEffect(() => {
            if (props.loggedIn) {
                getRunners()
            }
        }, [props.loggedIn]
    )

    const getRunners = () => {
        axios.get('http://localhost:3001/bookmaker/runners', {
            params: {
                token: props.token
            },
            headers: {
                'Content-Type': 'application/json'
            }
        }).then(resp => {
            console.log(resp.data)
            console.log("runners^")
            setRunners(resp.data.runners)
            setFirstRunners(resp.data.runners)
            setSecondRunners(resp.data.runners)
        }).catch(error => console.log(error))
    }
    const saveRace = () => {
        axios.post('http://localhost:3001/races', {
                token:props.token,
                name:race.name,
                runner_id1:parseInt(race.runner_id1),
                runner_id2:parseInt(race.runner_id2),
                coef1:parseFloat(race.coef1),
                coef2:parseFloat(race.coef2)
            },
            {
            headers: {
                'Content-Type': 'application/json'
            }
        }).then(resp => {
            console.log(resp.data)
            console.log("saved race^")
            setRace(initialRace)
            setFirstRunners(runners)
            setSecondRunners(runners)
        }).catch(error => console.log(error))
    }


    return (
        <form className={ "form-check" } autoComplete="off">
           <div className="form-group row">
               <label className="col-sm-2 col-form-label">Name</label>
               <div className="col-sm-10">
                   <input className="form-control" placeholder={ "Race Name" } type="text" value={ race.name }
                          name="name" onChange={ handleInputChange }/>
               </div>
           </div>
           <div className="form-group row">
               <label className="col-sm-2 col-form-label">First Runner</label>
               <div className="col-sm-10">
                   <select className="form-control" value={ race.runner_id1 } name="runner_id1"
                           onChange={ handleInputChange }>
                       { firstRunners.map ( runner => (
                           <option key={runner.id+"first"} value={runner.id}>
                               {runner.name}
                           </option>
                       ) ) }
                       <option disabled hidden value={ '' }>{ "Select first runner" }</option>
                   </select>
               </div>
           </div>
           <div className="form-group row">
               <label className="col-sm-2 col-form-label">First Runner Coefficient</label>
               <div className="col-sm-10">
                   <input className="form-control" placeholder={ "First Coefficient" } type="number" step="0.01" value={ race.coef1 }
                          name="coef1" onChange={ handleInputChange }/>
               </div>
           </div>
           <div className="form-group row">
               <label className="col-sm-2 col-form-label">Second Runner</label>
               <div className="col-sm-10">
                   <select className="form-control" value={ race.runner_id2 } name="runner_id2"
                           onChange={ handleInputChange }>
                       { secondRunners.map ( runner => (
                           <option key={runner.id+"second"} value={runner.id}>
                               {runner.name}
                           </option>
                       ) ) }
                       <option disabled hidden value={ '' }>{ "Select second runner" }</option>
                   </select>
               </div>
           </div>
           <div className="form-group row">
               <label className="col-sm-2 col-form-label">Second Runner Coefficient</label>
               <div className="col-sm-10">
                   <input className="form-control" placeholder={ "Second Coefficient" } type="number" step="0.01" value={ race.coef2 }
                          name="coef2" onChange={ handleInputChange }/>
               </div>
           </div>
           <button className={ "btn btn-primary" } type="button" onClick={ saveRace }>Set up race</button>
       </form>
    );
}

export default Bookmaker;