'use client';

import {
  ChevronDownIcon,
  DotsHorizontalIcon,
  PlusIcon,
} from '@radix-ui/react-icons';

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
import { Checkbox } from '@/components/ui/checkbox';
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
import { Chamado } from './dtChamadosHospital';
import PerfilPacienteHospital from './perfilPacienteHospital';

export type Paciente = {
  id: number;
  nome: string;
  email: string;
  dataNascimento: string;
  qtdChamados: Chamado[];
  leito?: string | null;
};

export function DtPacientesHospital() {
  const [data, setData] = useState<Paciente[]>([]);
  const [sorting, setSorting] = useState<SortingState>([]);
  const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([]);
  const [columnVisibility, setColumnVisibility] = useState<VisibilityState>({});
  const [rowSelection, setRowSelection] = useState({});
  const [openDialog, setOpenDialog] = useState(false);
  const [openDialogEditar, setOpenDialogEditar] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await api.get(`/pacientes`);
        setData(response.data.pacientes);
      } catch (error) {
        console.error('Erro ao buscar os pacientes:', error);
      }
    };

    fetchData();
  }, []);

  const handleDelete = async (id: number) => {
    try {
      const response = await api.delete(`/pacientes/${id}`);
      if (response.status === 200) {
        sonnerMessage('Paciente', 'Paciente excluído.', 'success');
        setData((prevData) => prevData.filter((c) => c.id !== id));
      } else {
        sonnerMessage('Paciente', 'Erro ao excluir o paciente.', 'error');
      }
    } catch (error) {
      console.error('Erro ao excluir o paciente:', error);
      sonnerMessage(
        'Paciente',
        'Erro ao excluir o paciente. Por favor, tente novamente.',
        'error'
      );
    }
  };

  const columns: ColumnDef<Paciente>[] = [
    {
      id: 'select',
      header: ({ table }) => (
        <Checkbox
          checked={
            table.getIsAllPageRowsSelected() ||
            (table.getIsSomePageRowsSelected() && 'indeterminate')
          }
          onCheckedChange={(value) => table.toggleAllPageRowsSelected(!!value)}
          aria-label="Selecionar todos"
        />
      ),
      cell: ({ row }) => (
        <Checkbox
          checked={row.getIsSelected()}
          onCheckedChange={(value) => row.toggleSelected(!!value)}
          aria-label="Selecionar linha"
        />
      ),
      enableSorting: false,
      enableHiding: false,
    },
    {
      accessorKey: 'nome',
      header: 'Nome',
    },
    {
      accessorKey: 'email',
      header: 'Email',
    },
    {
      accessorKey: 'dataNascimento',
      header: 'Data de Nascimento',
      cell: ({ row }) => {
        const data = row.original.dataNascimento;
        const [year, month, day] = data.split('T')[0].split('-');
        const dataNascimento = `${day}/${month}/${year}`;

        return dataNascimento;
      },
    },
    {
      accessorKey: 'chamados',
      header: 'Qtd. de Chamados',
      cell: ({ row }) => row.original.qtdChamados,
    },
    {
      accessorKey: 'leito',
      header: 'Leito',
      cell: ({ row }) =>
        row.original.leito ? `Leito ${row.original.leito}` : 'Sem Leito',
    },
    {
      id: 'actions',
      enableHiding: false,
      cell: ({ row }) => {
        const paciente = row.original;

        return (
          <>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" className="h-8 w-8 p-0">
                  <span className="sr-only">Abrir menu</span>
                  <DotsHorizontalIcon className="h-4 w-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuLabel>Ações</DropdownMenuLabel>
                <DropdownMenuItem onClick={() => handleDelete(paciente.id)}>
                  Excluir
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => setOpenDialogEditar(true)}>
                  Editar
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>

            {openDialogEditar && (
              <PerfilPacienteHospital
                id={paciente.id}
                openDialog={openDialogEditar}
                onOpenChange={setOpenDialogEditar}
                edita={true}
                readOnly={false}
              />
            )}
          </>
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
    getPaginationRowModel: getPaginationRowModel(),
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
        <Button
          variant="outline"
          className="mx-4"
          onClick={() => setOpenDialog(true)}
        >
          Criar <PlusIcon className="ml-2 h-4 w-4" />
        </Button>
        {openDialog && (
          <PerfilPacienteHospital
            openDialog={openDialog}
            onOpenChange={setOpenDialog}
            edita={true}
            readOnly={false}
          />
        )}
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
      <div className="rounded-md border">
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
      <div className="flex items-center justify-end space-x-2 py-4">
        <div className="flex-1 text-sm text-muted-foreground">
          {table.getFilteredSelectedRowModel().rows.length} de{' '}
          {table.getFilteredRowModel().rows.length} linha(s) selecionada(s).
        </div>
      </div>
    </div>
  );
}
