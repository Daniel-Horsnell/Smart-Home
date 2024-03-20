import { WidthFull } from "@mui/icons-material";
import { Box, Button, Grid, TextField, Typography } from "@mui/material";
import { useEffect, useState } from "react";
import { plants } from "../shared/constants";

interface Response {
  data: string;
}

function Plants() {
  const [moistureData, setMoistureData] = useState<{[key: string]: string}>({});
  const [fetchedChangeFlag, setFetchedChangeFlag] = useState<boolean>(false);

  useEffect(() => {
    plants.forEach(plant => {
      fetchData(plant)
    })
    setFetchedChangeFlag(!fetchedChangeFlag)
  }, [])


  const fetchData = async (plant: string) => {
    try {
      const response = await fetch('http://localhost:5000/plant/moisture/' + plant);
      console.log(response.headers)
      const responseData: Response = await response.json();
      let tempMoistureData = moistureData;
      tempMoistureData[plant] = responseData.data;
      console.log(responseData.data)
      setMoistureData(tempMoistureData)
    } catch (error) {
      console.error('Error fetching data:', error);
    }
  };

  return(
    <div style={{width: '100%', backgroundColor: '#e6e6e6', overflowX: 'hidden'}}>
      <Grid container spacing={2} style={{width: '100%', margin: '1px', height: '-webkit-fill-available'}} key={String(fetchedChangeFlag)}>
          {plants.map(plant => {return(
            <Grid item xs={12} md={6} >
            <Box sx={{width: '100%', height: 'fit-content', borderRadius: 5, bgcolor: '#FFFFFF', border: '1px solid lightGrey'}}>
              <div style={{margin: '1rem', height: 'fit-content'}}>
              <Typography style={{alignSelf: 'end'}}>{plant} moisture: {moistureData?.[plant]}</Typography>
              </div>
            </Box> 
            </Grid>)
          })}
      </Grid>
      </div>
  )
}

export default Plants