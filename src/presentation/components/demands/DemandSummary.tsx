import React from 'react';
import { Box, Typography } from '@mui/material';

interface DemandSummaryProps {
  totalPlan?: number;
  totalProd?: number;
}

const DemandSummary: React.FC<DemandSummaryProps> = ({
  totalPlan = 0,
  totalProd = 0
}) => {
  return (
    <Box className="mt-6 p-4 bg-gray-50 rounded">
      <Typography variant="subtitle1" className="font-bold">
        Total Planejado: {totalPlan.toLocaleString('pt-BR')} Ton
      </Typography>
      <Typography variant="subtitle1" className="font-bold">
        Total Produzido: {totalProd.toLocaleString('pt-BR')} Ton
      </Typography>
    </Box>
  );
};

export default DemandSummary; 