'use client';

import { ChevronDownIcon, DotsHorizontalIcon } from '@radix-ui/react-icons';
import {
  ColumnDef,
  ColumnFiltersState,
  SortingState,
  VisibilityState,
  flexRender,
  getCoreRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  useReactTable,
} from '@tanstack/react-table';

import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Input } from '@/components/ui/input';
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
import { sonnerMessage } from '@/lib/sonnerMessage';

export type Chamado = {
  id: number;
  descricao: string;
  createdAt: string;
  prioridade: string;
  paciente: {
    nome: string;
  };
  leito: {
    numero: string;
  };
};

export function DataTableDemo() {
  const [data, setData] = useState<Chamado[]>([]);
  const [sorting, setSorting] = useState<SortingState>([
    { id: 'prioridade', desc: false },
  ]);
  const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([]);
  const [columnVisibility, setColumnVisibility] = useState<VisibilityState>({});
  const [rowSelection, setRowSelection] = useState({});

  useEffect(() => {
    const fetchData = async () => {
      try {
        const token = document.cookie.split('authTokenPaciente=')[1] || '';
        const responsePaciente = await api.post('/token/paciente', { token });
        const { paciente } = responsePaciente.data;

        const response = await api.get(`/chamados/paciente/${paciente.id}`);
        console.log(response.data.chamados);
        setData(response.data.chamados);
      } catch (error) {
        console.error('Erro ao buscar os chamados:', error);
      }
    };

    fetchData();
  }, []);

  const handleDelete = async (id: number) => {
    try {
      const response = await api.delete(`/chamados/${id}`);
      if (response.status === 200) {
        sonnerMessage('Chamado', 'Excluído com sucesso.', 'success');
        setData((prevData) => prevData.filter((c) => c.id !== id));
      } else {
        sonnerMessage('Chamado', 'Erro ao excluir o chamado.', 'error');
      }
    } catch (error) {
      console.error('Erro ao excluir o chamado:', error);
      sonnerMessage(
        'Chamado',
        'Erro ao excluir o chamado. Por favor, tente novamente.',
        'error'
      );
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
    },
    {
      accessorKey: 'paciente.nome',
      header: 'Nome',
    },
    {
      accessorKey: 'leito.numero',
      header: 'Leito',
    },
    {
      accessorKey: 'createdAt',
      header: 'Criado em',
      cell: ({ row }) => new Date(row.getValue('createdAt')).toLocaleString(),
    },
    {
      id: 'actions',
      enableHiding: false,
      cell: ({ row }) => {
        const chamado = row.original;

        return (
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" className="h-8 w-8 p-0">
                <span className="sr-only">Abrir menu</span>
                <DotsHorizontalIcon className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuLabel>Ações</DropdownMenuLabel>
              <DropdownMenuItem onClick={() => handleDelete(chamado.id)}>
                Cancelar o chamado
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        );
      },
    },
  ];

  const table = useReactTable({
    data,
    columns,
    onSortingChange: setSorting,
    onColumnFiltersChange: setColumnFilters,
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    onColumnVisibilityChange: setColumnVisibility,
    onRowSelectionChange: setRowSelection,
    state: {
      sorting,
      columnFilters,
      columnVisibility,
      rowSelection,
    },
  });

  return (
    <div className="w-full">
      <div className="flex items-center py-4">
        <Input
          placeholder="Filtrar descrições..."
          value={
            (table.getColumn('descricao')?.getFilterValue() as string) ?? ''
          }
          onChange={(event) =>
            table.getColumn('descricao')?.setFilterValue(event.target.value)
          }
          className="max-w-sm"
        />
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="outline" className="ml-auto">
              Colunas <ChevronDownIcon className="ml-2 h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            {table
              .getAllColumns()
              .filter((column) => column.getCanHide())
              .map((column) => {
                return (
                  <DropdownMenuCheckboxItem
                    key={column.id}
                    className="capitalize"
                    checked={column.getIsVisible()}
                    onCheckedChange={(value) =>
                      column.toggleVisibility(!!value)
                    }
                  >
                    {column.id}
                  </DropdownMenuCheckboxItem>
                );
              })}
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
      <div className="rounded-md border h-64 overflow-y-auto overflow-x-auto">
        <Table>
          <TableHeader>
            {table.getHeaderGroups().map((headerGroup) => (
              <TableRow key={headerGroup.id}>
                {headerGroup.headers.map((header) => {
                  return (
                    <TableHead key={header.id}>
                      {header.isPlaceholder
                        ? null
                        : flexRender(
                            header.column.columnDef.header,
                            header.getContext()
                          )}
                    </TableHead>
                  );
                })}
              </TableRow>
            ))}
          </TableHeader>
          <TableBody>
            {table.getRowModel().rows?.length ? (
              table.getRowModel().rows.map((row) => (
                <TableRow
                  key={row.id}
                  data-state={row.getIsSelected() && 'selected'}
                >
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
