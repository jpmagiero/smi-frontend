import React from 'react';
import {
  Drawer,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Box,
  Typography,
} from '@mui/material';
import ListAltIcon from '@mui/icons-material/ListAlt';

interface SideBarProps {
  activeItem: string;
  onNavigate: (item: string) => void;
}

const SideBar: React.FC<SideBarProps> = ({ activeItem, onNavigate }) => {
  return (
    <Drawer
      variant="permanent"
      sx={{
        width: 240,
        flexShrink: 0,
        '& .MuiDrawer-paper': {
          width: 240,
          boxSizing: 'border-box',
          backgroundColor: '#1C1C1C',
          color: 'white',
        },
      }}
    >
      <Box sx={{ p: 2, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <Typography variant="h6" sx={{ fontWeight: 'bold', color: '#F05225' }}>
          SMI GROUP
        </Typography>
      </Box>
      <List>
        <ListItem
          button
          selected={activeItem === 'demands'}
          onClick={() => onNavigate('demands')}
          sx={{
            '&.Mui-selected': {
              backgroundColor: 'rgba(240, 82, 37, 0.2)',
              '&:hover': {
                backgroundColor: 'rgba(240, 82, 37, 0.3)',
              },
            },
            '&:hover': {
              backgroundColor: 'rgba(255, 255, 255, 0.1)',
            },
          }}
        >
          <ListItemIcon sx={{ color: activeItem === 'demands' ? '#F05225' : '#FFFFFF' }}>
            <ListAltIcon />
          </ListItemIcon>
          <ListItemText primary="Demandas" />
        </ListItem>
      </List>
    </Drawer>
  );
};

export default SideBar; 