import { Box, Divider, Drawer, List, ListItem, ListItemButton, ListItemIcon, ListItemText } from "@mui/material";
import HomeIcon from '@mui/icons-material/Home';
import React from "react";

interface SidePanelProps {
  page: string;
  open: boolean;
  onClose: () => void;
  onOpen: () => void;
  setPage: (page: string) => void;
}

const icons = [HomeIcon]

function SidePanel({page, open, onClose, onOpen, setPage}: SidePanelProps) {

  const list = () => (
    <Box
      sx={{ width: '10vw' }}
      role="presentation"
      onClick={onClose}
      onKeyDown={onClose}
    >
      <List>
        {['Home'].map((text, index) => (
          <ListItem key={text} disablePadding>
            <ListItemButton onClick={() => setPage(text)}>
              <ListItemIcon>
                {React.createElement(icons[index])}
              </ListItemIcon>
              <ListItemText primary={text} />
            </ListItemButton>
          </ListItem>
        ))}
      </List>
      <Divider />
    </Box>
  )
  return(
    <div>
      <React.Fragment>
        <Drawer
          anchor={'left'}
          open={open}
          onClose={onClose}
        >
          <div >
            {list()}
          </div>
        </Drawer>
      </React.Fragment>
    </div>

  )
}

export default SidePanel