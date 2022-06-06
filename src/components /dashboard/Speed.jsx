// import React from 'react'
import './speed.css'
import { CircularProgressbar } from 'react-circular-progressbar';
import 'react-circular-progressbar/dist/styles.css';
import SpeedIcon from '@mui/icons-material/Speed';

const Speed = ()=>{
    return(
        <div className="speed">
            <div className="Title">
                <h2>Speed Km/h</h2>
                <SpeedIcon/>
            </div>
            <CircularProgressbar value={70} text={`${70}Km/h`} />
        </div>
    )
}

export default Speed