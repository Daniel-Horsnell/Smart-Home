import React, { useState } from 'react';
import { Button } from '@mui/material';
import DensityMediumIcon from '@mui/icons-material/DensityMedium';
import Home from './components/Home';
import SidePanel from './components/SidePanel';
import Plants from './components/Plants';
import { pages } from './shared/constants';
import Computer from './components/Computer';

const App: React.FC = () => {
  const [page, setPage] = useState<string>('Home')
  const [open, setOpen] = React.useState<boolean>(false);

  const closeSidePanel = () => {
    setOpen(false);
  }

  const openSidePanel = () => {
    setOpen(true);
  }

  const loadPage = () => {
    switch (page) {
      case pages[0]:
        return <Plants />
      case pages[1]:
        return <Computer />
      default:
        return <Plants />
    }
  }

  return (
    <div style={{ display: 'flex', height: 'max-height'}} key={page}>
      <div style={{ width: '4rem', height: '100vh', borderRight: '1px solid lightGrey'}}>
        <Button onClick={openSidePanel} style={{ position: 'relative', top: '1rem', left: 0, zIndex: 3 }}>
          <DensityMediumIcon />
        </Button>
      </div>
      <SidePanel page={page} open={open} onClose={closeSidePanel} onOpen={openSidePanel} setPage={setPage}/>
      {page == pages[0]? <Plants/> : <Computer/>}
    </div>
  );
};

export default App;
