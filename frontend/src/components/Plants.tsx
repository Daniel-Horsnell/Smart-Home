import { WidthFull } from "@mui/icons-material";
import { Box, Button, Divider, Grid, TextField, Typography } from "@mui/material";
import { useEffect, useState } from "react";
import { plants } from "../shared/constants";
import { Gauge, gaugeClasses } from '@mui/x-charts/Gauge';
import { capitalizeFirstLetter } from "../shared/helperFunctions";

interface Response {
  data: string;
}

function Plants() {
  const [moistureData, setMoistureData] = useState<{[key: string]: string}>({});
  const [error, setError] = useState<{[key: string]: boolean}>({});
  const [amountFetches, setAmountFetches] = useState<number>(0);

  useEffect(() => {
    plants.forEach(plant => {
      fetchData(plant)
    })
    setAmountFetches(amountFetches + 1)
  }, [])


  const fetchData = async (plant: string) => {
    try {
      const response = await fetch('http://192.168.0.212/moisture/' + plant);
      console.log(response.headers)
      console.log(response)
      const responseData: Response = await response.json();
      setMoistureData(prevData => ({
        ...prevData,
        [plant]: responseData.data
      }));
    } catch (error) {
      console.error('Error fetching data:', error);
    }
  };
  
  const sendData = async (plant: string, moisturePercentage: number) => {
    const response = await fetch('https://api.example.com/endpoint', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        moisture: moisturePercentage,
      }),
    });

    if (!response.ok) {
      setError(prevData => ({
        ...prevData,
        [plant]: false
      }));
    }
  }

  return(
    <div style={{width: '100%', backgroundColor: '#e6e6e6', overflowX: 'hidden'}} key={String(amountFetches)}>
      <Grid container spacing={2} style={{width: '100%', margin: '1px', height: '-webkit-fill-available'}} >
          {moistureData && plants.map(plant => {return(
            <Grid item xs={12} md={6} key={moistureData[plant]}>
            <Box sx={{width: '100%', height: 'fit-content', borderRadius: 5, bgcolor: '#FFFFFF', border: '1px solid lightGrey'}} key={moistureData[plant]}>
              <div style={{margin: '1rem', height: 'fit-content'}}>
              <Typography style={{alignSelf: 'start'}} key={moistureData[plant]}>{capitalizeFirstLetter(plant)} Moisture</Typography>
              <Divider />
              <div style={{ height: '25vh'}}>
                
                <Gauge
                    value={+moistureData[plant]}
                    startAngle={-100}
                    endAngle={100}
                    cornerRadius='10%'
                    outerRadius='100%'
                    innerRadius='60%'
                    sx={
                      (theme) => ({
                        [`& .${gaugeClasses.valueText}`]: {
                          fontSize: 40,
                        },
                        [`& .${gaugeClasses.valueArc}`]: {
                          fill: '#036f7a',
                        },
                        [`& .${gaugeClasses.root}`]: {
                          animation: 'linear',
                          animationDuration: '3s',
                        },
                      })
                    }
                    text={
                      ({ value }) => `${value} %`
                   }
                  />
              </div>
              </div>
            </Box> 
            </Grid>)
          })}
      </Grid>
      </div>
  )
}

export default Plants