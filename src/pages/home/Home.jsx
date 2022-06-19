// import React from 'react'
import './home.css'
import Sidebar from '../../components /sidebar/Sidebar'
import Chart1 from '../../components /dashboard/Chart1'
import Chart from '../../components /dashboard/Chart'
import Chart2 from '../../components /dashboard/Chart2'
import Speed from '../../components /dashboard/Speed'
import GraphRender from '../../components /dashboard/GraphRender'
import Fuel from '../../components /dashboard/Fuel'
import Temp from '../../components /dashboard/Temp'
import Chart3 from '../../components /Chart3'
import Box from '@mui/material/Box';
import { styled, useTheme } from '@mui/material/styles';

import { CircularProgressbar } from 'react-circular-progressbar';
import 'react-circular-progressbar/dist/styles.css';

const DrawerHeader = styled('div')(({ theme }) => ({
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'flex-end',
    padding: theme.spacing(0, 1),
    // necessary for content to be below app bar
    ...theme.mixins.toolbar,
  }));
  

const Home = ()=>{
    return(
        <div className="home">
            {/* <Navbar/> */}
            <Sidebar/>
            <Box component="main" sx={{ flexGrow: 1, p: 3 }}>
                <DrawerHeader />
                <div className="var">
                    <div className="temp variants">
                        <Temp/>
                    </div>
                    <div className="sped variants">
                        <Speed/>
                    </div>
                    <div className="fuel variants">
                        <Fuel/>
                    </div>
                </div>
                <div className="fuel-consumption">
                    <Chart3 title="Fuel consumption" aspect = {4/1} />
                </div>
                {/* <Chart1 title="1st chart" aspect = {3/2} />*/}
                {/*<div className="fuel-consumption">
                    {/* test 
                </div>*/}
            
            {/* <Chart2 title="2nd chart" aspect = {2/1} /> */}
             
            </Box>        
            
           
        </div>
    )
}

export default Home