import React from 'react';
import { TableRow, TableCell, IconButton } from '@mui/material';
import EditIcon from '@mui/icons-material/Edit';
import CalendarMonthIcon from '@mui/icons-material/CalendarMonth';
import { Demand, DemandStatus } from '../../../domain/entities/Demand';

interface DemandRowProps {
  demand: Demand;
  onEdit: (demand: Demand) => void;
  onEditPeriod: (demand: Demand) => void;
}

const formatDateRange = (startDate: string, endDate: string): string => {
  try {
    const start = new Date(startDate).toLocaleDateString('pt-BR');
    const end = new Date(endDate).toLocaleDateString('pt-BR');
    return `${start} - ${end}`;
  } catch (error) {
    console.error('Invalid date:', startDate, endDate);
    return `${startDate} - ${endDate}`;
  }
};

const getStatusLabel = (status: DemandStatus): string => {
  switch (status) {
    case 'PLANEJAMENTO':
    case 'PLANNING':
      return 'PLANEJAMENTO';
    case 'EM_ANDAMENTO':
    case 'IN_PROGRESS':
      return 'EM ANDAMENTO';
    case 'CONCLUIDO':
    case 'COMPLETED':
      return 'CONCLUÍDO';
    default:
      return status;
  }
};

const getStatusClass = (status: DemandStatus): string => {
  switch (status) {
    case 'PLANEJAMENTO':
    case 'PLANNING':
      return 'status-planning';
    case 'EM_ANDAMENTO':
    case 'IN_PROGRESS':
      return 'status-in-progress';
    case 'CONCLUIDO':
    case 'COMPLETED':
      return 'status-completed';
    default:
      return '';
  }
};

const DemandRow: React.FC<DemandRowProps> = ({ demand, onEdit, onEditPeriod }) => {
  const totalPlan = typeof demand.totalPlan === 'number' ? demand.totalPlan : 0;
  const totalProd = typeof demand.totalProd === 'number' ? demand.totalProd : 0;
  
  return (
    <TableRow key={demand.id} className="hover:bg-gray-50">
      <TableCell align="center" sx={{ width: '60px' }}>
        <IconButton
          size="small"
          onClick={() => onEdit(demand)}
          className="text-black-primary hover:text-orange-primary"
        >
          <EditIcon fontSize="small" />
        </IconButton>
      </TableCell>
      <TableCell>
        <div className="flex items-center justify-between">
          <span>{formatDateRange(demand.startDate, demand.endDate)}</span>
          <IconButton
            size="small"
            onClick={() => onEditPeriod(demand)}
            className="text-black-primary hover:text-blue-500"
          >
            <CalendarMonthIcon fontSize="small" />
          </IconButton>
        </div>
      </TableCell>
      <TableCell align="right">{totalPlan.toLocaleString('pt-BR')}</TableCell>
      <TableCell align="right">{totalProd.toLocaleString('pt-BR')}</TableCell>
      <TableCell align="center">
        <span className={`status-badge ${getStatusClass(demand.status || 'PLANEJAMENTO')}`}>
          {getStatusLabel(demand.status || 'PLANEJAMENTO')}
        </span>
      </TableCell>
    </TableRow>
  );
};

export default DemandRow; 