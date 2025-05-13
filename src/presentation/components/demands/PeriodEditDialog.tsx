import React, { useState } from 'react';
import { 
  Dialog, 
  DialogTitle, 
  DialogContent, 
  DialogActions, 
  Button, 
  Box, 
  CircularProgress 
} from '@mui/material';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { Demand } from '../../../domain/entities/Demand';

interface PeriodEditDialogProps {
  open: boolean;
  demand: Demand | null;
  onClose: () => void;
  onSave: (demandId: number, startDate: string, endDate: string) => Promise<void>;
}

const PeriodEditDialog: React.FC<PeriodEditDialogProps> = ({
  open,
  demand,
  onClose,
  onSave
}) => {
  const [startDate, setStartDate] = useState<Date | null>(demand ? new Date(demand.startDate) : null);
  const [endDate, setEndDate] = useState<Date | null>(demand ? new Date(demand.endDate) : null);
  const [saving, setSaving] = useState(false);

  const handleSave = async () => {
    if (!demand || !startDate || !endDate) return;

    if (endDate < startDate) {
      alert('A data final deve ser posterior à data inicial');
      return;
    }

    setSaving(true);
    try {
      await onSave(demand.id, startDate.toISOString(), endDate.toISOString());
      onClose();
    } catch (error) {
      console.error('Erro ao atualizar período:', error);
      alert('Erro ao atualizar período. Tente novamente.');
    } finally {
      setSaving(false);
    }
  };

  return (
    <LocalizationProvider dateAdapter={AdapterDateFns}>
      <Dialog open={open} onClose={onClose}>
        <DialogTitle>Editar Período da Demanda</DialogTitle>
        <DialogContent>
          <Box className="flex flex-col gap-4 mt-2">
            <DatePicker
              label="Data Inicial"
              value={startDate}
              onChange={(newDate) => setStartDate(newDate)}
            />
            <DatePicker
              label="Data Final"
              value={endDate}
              onChange={(newDate) => setEndDate(newDate)}
              minDate={startDate || undefined}
            />
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={onClose} color="inherit">Cancelar</Button>
          <Button 
            onClick={handleSave} 
            variant="contained" 
            style={{ backgroundColor: 'var(--color-orange-primary)' }}
            disabled={saving || !startDate || !endDate}
          >
            {saving ? <CircularProgress size={24} /> : 'Salvar'}
          </Button>
        </DialogActions>
      </Dialog>
    </LocalizationProvider>
  );
};

export default PeriodEditDialog; 