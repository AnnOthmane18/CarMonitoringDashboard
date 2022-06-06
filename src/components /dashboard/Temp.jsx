// import React from 'react'
import './speed.css'
import { CircularProgressbar } from 'react-circular-progressbar';
import 'react-circular-progressbar/dist/styles.css';
import DeviceThermostatIcon from '@mui/icons-material/DeviceThermostat';

const Temp = ()=>{
    return(
        <div className="speed">
            <div className="Title">
                <h2>Temperature</h2>
                <DeviceThermostatIcon/>
            </div>
            <CircularProgressbar value={70} text={`${70} °C`} />
        </div>
    )
}

export default Temp