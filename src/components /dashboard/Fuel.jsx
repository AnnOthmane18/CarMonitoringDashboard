// import React from 'react'
import './speed.css'
import { CircularProgressbar } from 'react-circular-progressbar';
import 'react-circular-progressbar/dist/styles.css';
import LocalGasStationIcon from '@mui/icons-material/LocalGasStation';

const Fuel = ()=>{
    return(
        <div className="speed">
             <div className="Title">
                <h2>Fuel</h2>
                <LocalGasStationIcon/>
            </div>
            <CircularProgressbar value={70} text={`${70}Leters`} />
        </div>
    )
}

export default Fuel