import React from 'react';
import { Typography, Box, Button, IconButton, Tooltip } from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import RefreshIcon from '@mui/icons-material/Refresh';

interface DemandListHeaderProps {
  onAddDemand: () => void;
  onRefresh: () => void;
  isLoading: boolean;
}

const DemandListHeader: React.FC<DemandListHeaderProps> = ({ 
  onAddDemand, 
  onRefresh,
  isLoading 
}) => {
  return (
    <Box className="flex justify-between items-center mb-6">
      <Typography variant="h5" className="text-black-primary font-bold uppercase">
        DEMANDAS DE PRODUÇÃO DE LATINHAS
      </Typography>
      
      <div className="flex items-center gap-4">
        <Button
          variant="contained"
          startIcon={<AddIcon />}
          onClick={onAddDemand}
          className="btn-orange"
          style={{ backgroundColor: 'var(--color-orange-primary)' }}
        >
          ADICIONAR
        </Button>
        
        <Tooltip title="Atualizar dados">
          <IconButton 
            onClick={onRefresh} 
            disabled={isLoading}
            size="small"
            className="text-black-primary hover:text-orange-primary"
          >
            <RefreshIcon />
          </IconButton>
        </Tooltip>
      </div>
    </Box>
  );
};

export default DemandListHeader; 