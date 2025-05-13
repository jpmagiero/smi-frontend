import React from 'react';
import { DialogActions, Button } from '@mui/material';

interface DemandModalActionsProps {
  onClose: () => void;
  onSave: () => void;
  isLoading: boolean;
}

const DemandModalActions: React.FC<DemandModalActionsProps> = ({
  onClose,
  onSave,
  isLoading
}) => {
  return (
    <DialogActions className="p-4 bg-gray-100">
      <Button
        variant="outlined"
        className="btn-red"
        onClick={onClose}
        style={{ borderColor: '#F44336', color: '#F44336' }}
      >
        CANCELAR
      </Button>
      <Button
        variant="contained"
        className="btn-green"
        onClick={onSave}
        disabled={isLoading}
        style={{ backgroundColor: '#4CAF50' }}
      >
        SALVAR
      </Button>
    </DialogActions>
  );
};

export default DemandModalActions; 