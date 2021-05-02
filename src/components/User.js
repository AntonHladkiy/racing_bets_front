import React , {useState , useEffect} from 'react';
import axios from "axios";

const Bookmaker = props => {
    const qs = require ( "qs" )
    const [finishedRaces , setFinishedRaces] = useState ( [] );
    const [availableRaces , setAvailableRaces] = useState ( [] );
    const [bettedRaces , setBettedRaces] = useState ( [] );
    useEffect ( () => {
            if (props.loggedIn) {
                getRaces ()
            }
        } , [props.loggedIn]
    )
    const handleWinnerChange = ( race_id , event ) => {
        const { name , value } = event.target
        setAvailableRaces ( availableRaces.map ( race => ( race.race_id === race_id ? {
                race_id: race.race_id ,
                raceName: race.raceName ,
                runner1: race.runner1 ,
                runner2: race.runner2 ,
                coef1: race.coef1 ,
                coef2: race.coef2 ,
                runner_id: value ,
                bet: race.bet
            } : race ) )
        )
    };
    const handleAdditionalBetChange = ( race_id , event ) => {
        const { name , value } = event.target
        setBettedRaces ( bettedRaces.map ( race => ( race.race_id === race_id ? {
                race_id: race.race_id ,
                raceName: race.raceName ,
                runner: race.runner ,
                coef: race.coef ,
                additional_bet: value ,
                bet: race.bet
            } : race ) )
        )
    };
    const handleBetChange = ( race_id , event ) => {
        const { name , value } = event.target
        setAvailableRaces ( availableRaces.map ( race => ( race.race_id === race_id ? {
                race_id: race.race_id ,
                raceName: race.raceName ,
                runner1: race.runner1 ,
                runner2: race.runner2 ,
                coef1: race.coef1 ,
                coef2: race.coef2 ,
                runner_id: race.runner_id ,
                bet: value
            } : race ) )
        )
    };
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
            setAvailableRaces ( resp.data.availableRaces.map ( race => ( {
                race_id: race.race_id ,
                raceName: race.raceName ,
                runner1: race.runner1 ,
                runner2: race.runner2 ,
                coef1: race.coef1 ,
                coef2: race.coef2 ,
                runner_id: '' ,
                bet: ''
            } ) ) )
            setFinishedRaces ( resp.data.finishedRaces.map ( race => ( {
                race_id: race.race_id ,
                raceName: race.raceName ,
                bet: race.bet ,
                win: race.win
            } ) ) )
            setBettedRaces ( resp.data.bettedRaces.map ( race => ( {
                race_id: race.race_id ,
                raceName: race.raceName ,
                runner: race.runner ,
                coef: race.coef ,
                additional_bet: '' ,
                bet: race.bet
            } ) ) )
        } ).catch ( error => console.log ( error ) )
    }
    const bet = ( race ) => {
        console.log(race)
        axios.post ( 'http://localhost:3001/bets' , {
            token:props.token,
            bet:parseFloat(race.bet),
            race_id:parseInt(race.race_id),
            runner_id:parseInt(race.runner_id)
        } , {
            headers: {
                'Content-Type': 'application/json'
            }
        } ).then ( resp => {
            console.log ( resp.data )
            getRaces()
        } ).catch ( error => console.log ( error ) )
    }
    const addBet = ( race ) => {
        axios.put ( 'http://localhost:3001/bets' , {
            token:props.token,
            additionalBet:parseFloat(race.additional_bet),
            currentBet:parseFloat(race.bet),
            race_id:parseInt(race.race_id)
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
            <h2>Available Races</h2>
            <table className={ "table" }>
                <thead>
                <tr>
                    <th scope="col">Race Name</th>
                    <th scope="col">Choose winner</th>
                    <th scope="col">Bet</th>
                    <th scope="col">Action</th>
                </tr>
                </thead>
                <tbody>
                { availableRaces.map ( ( race ) => (
                    <tr key={ race.race_id }>
                        <td>
                            { race.raceName }
                        </td>
                        <td>
                            <select className="form-control" value={ race.runner_id } name="runner_id"
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
                            <input type="number" className={ "form-control" } name={ "bet" } value={ race.bet }
                                   onChange={ ( event ) => handleBetChange ( race.race_id , event ) }/>
                        </td>
                        <td>
                            <button type="button" className={ "btn btn-success" }
                                    onClick={()=>bet(race)}
                            >Bet
                            </button>
                        </td>
                    </tr>
                ) ) }
                </tbody>
            </table>
            <h2>Races with bet</h2>
            <table className={ "table" }>
                <thead>
                <tr>
                    <th scope="col">Race Name</th>
                    <th scope="col">Current bet</th>
                    <th scope="col">Runner</th>
                    <th scope="col">Additional bet</th>
                    <th scope="col">Action</th>
                </tr>
                </thead>
                <tbody>
                { bettedRaces.map ( ( race ) => (
                    <tr key={ race.race_id }>
                        <td>
                            { race.raceName }
                        </td>
                        <td>
                            { race.bet }
                        </td>
                        <td>
                            { race.runner.name +"/ Coefficient"+race.coef}
                        </td>
                        <td>
                            <input type="number" className={ "form-control" } name={ "additional_bet" }
                                   value={ race.additional_bet }
                                   onChange={ ( event ) => handleAdditionalBetChange( race.race_id , event ) }/>
                        </td>
                        <td>
                            <button type="button" className={ "btn btn-success" }
                                    onClick={()=>addBet(race)}
                            >Add bet
                            </button>
                        </td>
                    </tr>
                ) ) }
                </tbody>
            </table>
            <h2>Finished Races</h2>
            <table className={ "table" }>
                <thead>
                <tr>
                    <th scope="col">Race Name</th>
                    <th scope="col">Result</th>
                </tr>
                </thead>
                <tbody>
                { finishedRaces.filter ( race => parseInt ( race.win ) <= 0 ).map ( ( race ) => (
                    <tr key={ race.race_id }>
                        <td>
                            { race.raceName }
                        </td>
                        <td>
                            Lost:{race.win}
                        </td>
                    </tr>
                ) ) }
                { finishedRaces.filter ( race => parseInt ( race.win ) > 0 ).map ( ( race ) => (
                    <tr key={ race.race_id }>
                        <td>
                            { race.raceName }
                        </td>
                        <td>
                            Won:{ race.win }
                        </td>
                    </tr>
                ) ) }
                </tbody>
            </table>
        </div>
    );
}

export default Bookmaker;