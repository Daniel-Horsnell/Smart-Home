import { WidthFull } from "@mui/icons-material";
import { Box, Button, Checkbox, Divider, FormControlLabel, Grid, TextField, Typography } from "@mui/material";
import { useEffect, useState } from "react";
import { plants } from "../shared/constants";
import { Gauge, gaugeClasses } from '@mui/x-charts/Gauge';
import { capitalizeFirstLetter } from "../shared/helperFunctions";
import { RgbColorPicker } from "react-colorful";
import { numLEDsInFan } from "../shared/constants";

interface Response {
  data: string;
}

interface RGBColour {
  r: number;
  g: number;
  b: number;
}

function Computer() {
  const [moistureData, setMoistureData] = useState<{[key: string]: string}>({});
  const [error, setError] = useState<{[key: string]: boolean}>({});
  const [amountFetches, setAmountFetches] = useState<number>(0);
  const [colourAll, setColourAll] = useState<RGBColour>({r: 0, g: 0, b: 0});
  const [individualColours, setIndividualColours] = useState<RGBColour[]>([]);
  const [showAllLEDs, setShowAllLEDs] = useState<boolean>(false);

  useEffect(() => {
    let tempColours = [] as RGBColour[];
    for (let i = 0; i < numLEDsInFan; i++) {
      tempColours.push(colourAll)
    }
    setIndividualColours(tempColours);
  }, [])

  const handleSetIndividualColour = (colour: RGBColour, index: number) => {
    setIndividualColours(individualColours.map((currColour, currIndex) => {
      if(index === currIndex) {
        return colour
      } else {
        return currColour
      }
    }))
  }

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
  
  const sendColour = async (colour: RGBColour, index: number) => {
    const bodyString = JSON.stringify({
      "r": colour.r,
      "g": colour.g,
      "b": colour.b,
      "index": index
    })
    console.log(bodyString)
    const response = await fetch('http://192.168.0.153/set_colour', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: bodyString,
      mode: 'no-cors',
    });

    if (!response.ok) {
    }
  }

  const getButtonColour = (index: number): string => {
    if(index == -1) {
      return 'rgba(' + String(colourAll.r) + ',' + String(colourAll.g) + ',' + String(colourAll.b) + ',1)'; 
    }
    return 'rgba(' + String(individualColours[index].r) + ',' + String(individualColours[index].g) + ',' + String(individualColours[index].b) + ',1)'; 
  }

  const handleToggleShowAllLEDs = (e: React.ChangeEvent<HTMLInputElement>) => {
    setShowAllLEDs(e.target.checked);
  }

  return(
    <div style={{width: '100%', backgroundColor: '#e6e6e6', overflowX: 'hidden'}} key={String(amountFetches)}>
      <Grid container spacing={2} style={{width: '100%', margin: '1px', height: '-webkit-fill-available'}} >
        <Grid item xs={12} md={6} >
        <Box sx={{width: '100%', height: 'fit-content', borderRadius: 5, bgcolor: '#FFFFFF', border: '1px solid lightGrey'}} >
          <div style={{margin: '1rem', height: 'fit-content'}}>
          <Typography style={{alignSelf: 'start'}}>General</Typography>
          <Divider />
          <div style={{ height: '25vh'}}>
            <FormControlLabel control={<Checkbox onChange={(e) => handleToggleShowAllLEDs(e)}/>} label="Show all LEDs" />
          </div>
          </div>
        </Box> 
        </Grid>
        <Grid item xs={12} md={6} >
        <Box sx={{width: '100%', height: 'fit-content', borderRadius: 5, bgcolor: '#FFFFFF', border: '1px solid lightGrey'}} >
          <div style={{margin: '1rem', height: 'fit-content'}}>
          <Typography style={{alignSelf: 'start'}}>Fan LEDs</Typography>
          <Divider />
          <div style={{ display: 'flex', justifyContent: 'space-between',  height: '25vh'}}>
            <RgbColorPicker color={colourAll} onChange={setColourAll} style={{width: '-webkit-fill-available', height: '-webkit-fill-available', margin: '1rem', marginBottom: '0px', marginLeft: '0px'}}/>
            <Button onClick={() => sendColour(colourAll, -1)} variant="contained" style={{alignSelf: 'end', backgroundColor: getButtonColour(-1)}}>Change Colour</Button>
          </div>
          </div>
        </Box> 
        </Grid>
        {showAllLEDs && individualColours.map((colour, index) => {return (
          <Grid item xs={12} md={6} >
          <Box sx={{width: '100%', height: 'fit-content', borderRadius: 5, bgcolor: '#FFFFFF', border: '1px solid lightGrey'}} >
            <div style={{margin: '1rem', height: 'fit-content'}}>
            <Typography style={{alignSelf: 'start'}}>Fan LED {index}</Typography>
            <Divider />
            <div style={{ display: 'flex', justifyContent: 'space-between',  height: '25vh'}}>
              <RgbColorPicker color={colour} onChange={(newColor) => handleSetIndividualColour(newColor, index)} style={{width: '-webkit-fill-available', height: '-webkit-fill-available', margin: '1rem', marginBottom: '0px', marginLeft: '0px'}}/>
              <Button onClick={() => sendColour(colour, index)} variant="contained" style={{alignSelf: 'end', backgroundColor: getButtonColour(index)}}>Change Colour</Button>
            </div>
            </div>
          </Box> 
          </Grid>
        )})}
      </Grid>
      </div>
  )
}

export default Computer