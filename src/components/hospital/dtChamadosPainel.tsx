'use client';

import {
  ColumnDef,
  SortingState,
  flexRender,
  getCoreRowModel,
  getSortedRowModel,
  useReactTable,
} from '@tanstack/react-table';

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { useState, useEffect } from 'react';
import { api } from '@/lib/axios';

export type Chamado = {
  id: number;
  descricao: string;
  prioridade: string;
  paciente: {
    id: number;
    nome: string;
  };
  leito: {
    numero: string;
  };
  createdAt: string;
};

export function DtChamadosPainel() {
  const [data, setData] = useState<Chamado[]>([]);
  const [sorting, setSorting] = useState<SortingState>([
    { id: 'prioridade', desc: false },
    { id: 'createdAt', desc: true },
  ]);

  const fetchData = async () => {
    try {
      const response = await api.get(`/chamados`);
      setData(response.data.chamados);
    } catch (error) {
      console.error('Erro ao buscar os chamados:', error);
    }
  };

  useEffect(() => {
    fetchData();

    const interval = setInterval(() => {
      fetchData();
    }, 5000);

    return () => {
      clearInterval(interval);
    };
  }, []);

  const priorityOrder = (priority: string) => {
    switch (priority) {
      case 'Alta':
        return 1;
      case 'Média':
        return 2;
      case 'Baixa':
        return 3;
      default:
        return 4;
    }
  };

  const columns: ColumnDef<Chamado>[] = [
    {
      accessorKey: 'descricao',
      header: 'Descrição',
    },
    {
      accessorKey: 'prioridade',
      header: 'Prioridade',
      sortingFn: (a, b) =>
        priorityOrder(a.original.prioridade) -
        priorityOrder(b.original.prioridade),
    },
    {
      accessorKey: 'paciente.nome',
      header: 'Paciente',
    },
    {
      accessorKey: 'leito.numero',
      header: 'Leito',
    },
    {
      accessorKey: 'createdAt',
      header: 'Criado em',
      cell: ({ row }) => new Date(row.getValue('createdAt')).toLocaleString(),
      sortingFn: (a, b) =>
        new Date(a.original.createdAt).getTime() -
        new Date(b.original.createdAt).getTime(),
    },
  ];

  const table = useReactTable({
    data,
    columns,
    state: { sorting },
    onSortingChange: setSorting,
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
  });

  return (
    <div className="w-full">
      <div className="rounded-md border">
        <Table>
          <TableHeader>
            {table.getHeaderGroups().map((headerGroup) => (
              <TableRow key={headerGroup.id}>
                {headerGroup.headers.map((header) => (
                  <TableHead key={header.id}>
                    {header.isPlaceholder
                      ? null
                      : flexRender(
                          header.column.columnDef.header,
                          header.getContext()
                        )}
                  </TableHead>
                ))}
              </TableRow>
            ))}
          </TableHeader>
          <TableBody>
            {table.getRowModel().rows?.length ? (
              table.getRowModel().rows.map((row) => (
                <TableRow key={row.id}>
                  {row.getVisibleCells().map((cell) => (
                    <TableCell key={cell.id}>
                      {flexRender(
                        cell.column.columnDef.cell,
                        cell.getContext()
                      )}
                    </TableCell>
                  ))}
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell
                  colSpan={columns.length}
                  className="h-24 text-center"
                >
                  Sem resultados.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}
