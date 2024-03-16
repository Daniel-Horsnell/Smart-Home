import { WidthFull } from "@mui/icons-material";
import { Box, Button, Grid, TextField, Typography } from "@mui/material";
import { useState } from "react";

interface Response {
  data: string;
}

function Home() {
  const [response, setResponse] = useState<string>('');
  const [value, setValue] = useState<string>('');

  const changeValue = (event: React.ChangeEvent<HTMLInputElement>) => {
    setValue(event.target.value)
  }

  const fetchData = async () => {
    try {
      const response = await fetch('http://localhost:5000/copy/' + value);
      console.log(response.headers)
      const responseData: Response = await response.json();
      console.log(responseData)
      setResponse(responseData.data);
    } catch (error) {
      console.error('Error fetching data:', error);
    }
  };
  return(
    <div style={{width: '100%', backgroundColor: '#e6e6e6', overflowX: 'hidden'}}>
      <Grid container spacing={2} style={{width: '100%', margin: '1px', height: '-webkit-fill-available'}}>
        <Grid item xs={12} md={6}>
          <Box sx={{width: '100%', height: 'fit-content', borderRadius: 5, bgcolor: '#FFFFFF', border: '1px solid lightGrey'}}>
            <div style={{margin: '1rem', height: 'fit-content'}}>
              <TextField variant="outlined" value={value} onChange={changeValue}></TextField>
              <div style={{ display: 'flex', justifyContent: 'space-between'}}>
                <Typography style={{alignSelf: 'end'}}>Response: {response}</Typography>
                <Button onClick={fetchData} variant="contained" style={{alignSelf: 'end'}}>Fetch Data</Button>
              </div>
            </div>
          </Box> 
        </Grid>
        <Grid item xs={12} md={6}>
          <Box sx={{width: '100%', height: 'fit-content', borderRadius: 5, bgcolor: '#FFFFFF', border: '1px solid lightGrey'}}>
          <div style={{margin: '1rem', height: 'fit-content'}}>
              <TextField variant="outlined" value={value} onChange={changeValue}></TextField>
              <div style={{ display: 'flex', justifyContent: 'space-between'}}>
                <Typography style={{alignSelf: 'end'}}>Response: {response}</Typography>
                <Button onClick={fetchData} variant="contained" style={{alignSelf: 'end'}}>Fetch Data</Button>
              </div>
            </div>
          </Box>
        </Grid>
      </Grid>
      </div>
  )
}

export default Home