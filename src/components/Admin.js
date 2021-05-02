import React , {useState , useEffect} from 'react';
import axios from "axios";

const Bookmaker = props => {
    const qs = require ( "qs" )
    const [races , setRaces] = useState ( [] );
    const handleWinnerChange = ( race_id , event ) => {
        const { name , value } = event.target
        setRaces ( races.map ( race => ( race.race_id === race_id ? ( value === race.runner1.id.toString() ? {
                race_id: race.race_id ,
                raceName: race.raceName ,
                runner1: race.runner1 ,
                runner2: race.runner2 ,
                coef1: race.coef1 ,
                coef2: race.coef2 ,
                winner_id: value ,
                winner_coef: race.coef1
            } : {
                race_id: race.race_id ,
                raceName: race.raceName ,
                runner1: race.runner1 ,
                runner2: race.runner2 ,
                coef1: race.coef1 ,
                coef2: race.coef2 ,
                winner_id: value ,
                winner_coef: race.coef2
            } ) : race ) )
        )
    };

    useEffect ( () => {
            if (props.loggedIn) {
                getRaces ()
            }
        } , [props.loggedIn]
    )

    const getRaces = () => {
        axios.get ( 'http://localhost:3001/races' , {
            params: {
                token: props.token
            } ,
            headers: {
                'Content-Type': 'application/json'
            }
        } ).then ( resp => {
            console.log ( resp.data )
            console.log ( "races^" )
            setRaces ( resp.data.races.map ( race => ( {
                race_id: race.race_id ,
                raceName: race.raceName ,
                runner1: race.runner1 ,
                runner2: race.runner2 ,
                coef1: race.coef1 ,
                coef2: race.coef2 ,
                winner_id: '' ,
                winner_coef: ''
            } ) ) )
        } ).catch ( error => console.log ( error ) )
    }
    const finishRace = ( race ) => {
        axios.put ( 'http://localhost:3001/races' , {
            race_id: parseInt(race.race_id) ,
            winner_id: parseInt(race.winner_id) ,
            winner_coef: parseFloat(race.winner_coef) ,
            token: props.token
        } , {
            headers: {
                'Content-Type': 'application/json'
            }
        } ).then ( resp => {
            console.log ( resp.data )
            getRaces()
        } ).catch ( error => console.log ( error ) )
    }

    return (
        <div>
            <h2>Races</h2>
            <table className={ "table" }>
                <thead>
                <tr>
                    <th scope="col">Race Name</th>
                    <th scope="col">Choose winner</th>
                    <th scope="col">Action</th>
                </tr>
                </thead>
                <tbody>
                { races.map ( ( race ) => (
                    <tr key={ race.race_id }>
                        <td>
                            { race.raceName }
                        </td>
                        <td>
                            <select className="form-control" value={ race.winner_id } name="winner_id"
                                    onChange={ ( event ) => handleWinnerChange ( race.race_id , event ) }>
                                <option value={ race.runner1.id }>
                                    { race.runner1.name }/{ "   Coefficient:" + race.coef1 }
                                </option>
                                <option value={ race.runner2.id }>
                                    { race.runner2.name }/{ "   Coefficient:" + race.coef2 }
                                </option>
                                <option disabled hidden value={ '' }>{ "Select winner" }</option>
                            </select>
                        </td>
                        <td>
                            <button type="button" className={ "btn btn-success" }
                                    onClick={ () => finishRace ( race ) }>Finish race
                            </button>
                        </td>
                    </tr>
                ) ) }
                </tbody>
            </table>
        </div>
    );
}

export default Bookmaker;