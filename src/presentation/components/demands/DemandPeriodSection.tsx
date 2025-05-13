import React from 'react';
import { Box, Typography } from '@mui/material';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';

interface DemandPeriodSectionProps {
  startDate: Date | null;
  endDate: Date | null;
  onStartDateChange: (date: Date | null) => void;
  onEndDateChange: (date: Date | null) => void;
}

const DemandPeriodSection: React.FC<DemandPeriodSectionProps> = ({
  startDate,
  endDate,
  onStartDateChange,
  onEndDateChange
}) => {
  return (
    <LocalizationProvider dateAdapter={AdapterDateFns}>
      <Box className="mb-6 p-4 bg-gray-50 rounded-md">
        <Typography variant="subtitle1" className="mb-3 font-bold">
          Período da Demanda
        </Typography>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <DatePicker
            label="Data Inicial"
            value={startDate}
            onChange={onStartDateChange}
          />
          <DatePicker
            label="Data Final"
            value={endDate}
            onChange={onEndDateChange}
            minDate={startDate || undefined}
          />
        </div>
      </Box>
    </LocalizationProvider>
  );
};

export default DemandPeriodSection; 