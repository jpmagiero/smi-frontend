import React from 'react';
import { DialogTitle, Typography, IconButton } from '@mui/material';
import { Close as CloseIcon } from '@mui/icons-material';

interface DemandModalHeaderProps {
  weekNumber: number;
  period: string;
  onClose: () => void;
}

const DemandModalHeader: React.FC<DemandModalHeaderProps> = ({
  weekNumber,
  period,
  onClose
}) => {
  return (
    <DialogTitle className="flex justify-between items-center bg-black-primary text-white">
      <div>
        <Typography variant="h6" className="font-bold">
          SEMANA {weekNumber}
        </Typography>
        <Typography variant="body2">
          {period}
        </Typography>
      </div>
      <IconButton
        edge="end"
        color="inherit"
        onClick={onClose}
        aria-label="close"
      >
        <CloseIcon />
      </IconButton>
    </DialogTitle>
  );
};

export default DemandModalHeader; 