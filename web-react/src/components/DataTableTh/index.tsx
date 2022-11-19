import { DataTable } from 'primereact/datatable';
import React from 'react';

import { ContainerGrid } from './styles';

export default function DataTableTh(props: any) {
  const { children } = props;
  return (
    <ContainerGrid>
      <DataTable
        stripedRows
        showGridlines
        style={{ marginBottom: '2px' }}
        paginator
        emptyMessage=" "
        {...props}
      >
        {children}
      </DataTable>
    </ContainerGrid>
  );
}
