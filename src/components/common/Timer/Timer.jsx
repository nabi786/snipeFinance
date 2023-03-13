import React from 'react';
import { useTimer } from 'react-timer-hook';
import {Box, Typography} from '@mui/material'

function MyTimer({ expiryTimestamp }) {
  let {
    seconds,
    minutes,
    hours,
    days
  } = useTimer({ expiryTimestamp, onExpire: () => console.warn('onExpire called') });

  if(seconds < 10){
    seconds = `0${seconds}`
  }

  if(minutes < 10){
    minutes = `0${minutes}`
  }
  if(hours < 10){
    hours = `0${hours}`
  }
  if(days < 10){
    days = `0${days}`
  }

  return (
    <Box style={{textAlign: 'center'}}>
      <Box style={{fontSize : "20px", fontWeight : "bold", display : "flex", justifyContent : "center", alignItems :'center'}}>
        <Box sx={{ display: 'flex', flexDirection : "column"}}>
            <span style={{fontSize : "14px", fontWeight : "300"}}>D</span>
            <span  style={{minWidth : "50px", padding : "5px 10px", boxShadow : "0px 0px 10px 5px rgba(0,0,0,0.08)", color : "black", backgroundColor : "white",
        borderRadius : "5px",}}>{days}</span>
        </Box>
        <Box sx={{ display: 'flex', flexDirection : "column"}}>
            <span style={{fontSize : "14px", fontWeight : "300"}}>H</span>
        <span style={{minWidth : "50px", padding : "5px 10px", boxShadow : "0px 0px 10px 5px rgba(0,0,0,0.08)", color : "black", backgroundColor : "white",
        borderRadius : "5px", margin : "0px 5px"}}>{hours}</span>
        </Box>
        <Box sx={{ display: 'flex', flexDirection : "column"}}>
            <span style={{fontSize : "14px", fontWeight : "300"}}>M</span>

        <span style={{minWidth : "50px", padding : "5px 10px", boxShadow : "0px 0px 10px 5px rgba(0,0,0,0.08)", color : "black", backgroundColor : "white",
        borderRadius : "5px", marginRight : "5px"}}>{minutes}</span>
        </Box>
        <Box sx={{ display: 'flex', flexDirection : "column"}}>
            <span style={{fontSize : "14px", fontWeight : "300"}}>S</span>
        <span style={{minWidth : "50px", padding : "5px 10px", boxShadow : "0px 0px 10px 5px rgba(0,0,0,0.08)", color : "black", backgroundColor : "white",
        borderRadius : "5px",}}>{seconds}</span>
        </Box>
      </Box>

    </Box>
  );
}

export default function App(expiryTimeObject) {



        console.log('plan Remain TimeStamp', expiryTimeObject.expiryTime)


        // this is timer
       
        const time = new Date();
        

        if(expiryTimeObject.expiryTime){

          time.setSeconds(time.getSeconds() + Number(expiryTimeObject.expiryTime));
          // time.setSeconds(time.getSeconds()+Number(futureTiem));
         
        }
      


  return (
    <div>
      <MyTimer expiryTimestamp={time} />
    </div>
  );
}