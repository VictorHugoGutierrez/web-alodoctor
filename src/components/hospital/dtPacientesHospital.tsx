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
  const [openDialog, setOpenDialog] = useState(false);
  const [openDialogEditar, setOpenDialogEditar] = useState(false);
  const [selectedPacienteId, setSelectedPacienteId] = useState<
    number | undefined
  >();

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const response = await api.get(`/pacientes`);
      setData(response.data.pacientes);
    } catch (error) {
      console.error('Erro ao buscar os pacientes:', error);
    }
  };

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

  const handleConcluirAtendimento = async (id: number) => {
    try {
      const response = await api.patch(`/pacientes/${id}`);
      if (response.status === 200) {
        sonnerMessage('Paciente', 'Atendimento concluído!', 'success');
      } else {
        sonnerMessage('Paciente', 'Erro ao concluir o atendimento.', 'error');
      }
    } catch (error) {
      console.error('Erro ao concluir o atendimento:', error);
      sonnerMessage(
        'Paciente',
        'Erro ao concluir o atendimento Por favor, tente novamente.',
        'error'
      );
    }
  };

  const columns: ColumnDef<Paciente>[] = [
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
                <DropdownMenuItem
                  onClick={() => {
                    setOpenDialogEditar(true);
                    setSelectedPacienteId(paciente.id);
                  }}
                >
                  Editar
                </DropdownMenuItem>
                <DropdownMenuItem
                  onClick={() => handleConcluirAtendimento(paciente.id)}
                >
                  Concluir Atendimento
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>

            {openDialogEditar && (
              <>
                <PerfilPacienteHospital
                  id={selectedPacienteId}
                  openDialog={openDialogEditar}
                  onOpenChange={(open) => {
                    setOpenDialogEditar(open);
                    if (!open) {
                      fetchData();
                    }
                  }}
                  edita={true}
                  readOnly={false}
                />
              </>
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
    state: {
      sorting,
      columnFilters,
      columnVisibility,
    },
  });

  return (
    <div className="w-full">
      <div className="flex items-center py-4">
        <Input
          placeholder="Filtrar nome..."
          value={(table.getColumn('nome')?.getFilterValue() as string) ?? ''}
          onChange={(event) =>
            table.getColumn('nome')?.setFilterValue(event.target.value)
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
            onOpenChange={(open) => {
              setOpenDialog(open);
              if (!open) {
                fetchData();
              }
            }}
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
    </div>
  );
}
