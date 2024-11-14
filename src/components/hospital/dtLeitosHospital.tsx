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
import AssociaPacienteLeito from './associarPacienteLeito';
import DesassociaPacienteLeito from './desassociaPacienteLeito';
import LeitoHospital from './leitoHospital';

export type Leito = {
  id: number;
  numero: string;
  Paciente?: { nome: string } | null;
};

export function DtLeitosHospital() {
  const [data, setData] = useState<Leito[]>([]);
  const [sorting, setSorting] = useState<SortingState>([
    { id: 'numero', desc: false },
  ]);
  const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([]);
  const [columnVisibility, setColumnVisibility] = useState<VisibilityState>({});
  const [openDialogAssocia, setOpenDialogAssocia] = useState(false);
  const [openDialogDesassocia, setOpenDialogDesassocia] = useState(false);
  const [openDialogEditar, setOpenDialogEditar] = useState(false);
  const [openDialogCriar, setOpenDialogCriar] = useState(false);
  const [selectedLeitoId, setselectedLeitoId] = useState<number>();

  useEffect(() => {
    if (!openDialogAssocia && !openDialogDesassocia) {
      fetchData();
    }
  }, [openDialogAssocia, openDialogDesassocia]);

  const fetchData = async () => {
    try {
      const response = await api.get(`/leitos`);
      setData(response.data.leitos);
    } catch (error) {
      console.error('Erro ao buscar os leitos:', error);
    }
  };

  const columns: ColumnDef<Leito>[] = [
    {
      accessorKey: 'numero',
      header: 'Numero do Leito',
    },
    {
      accessorKey: 'Paciente.nome',
      header: 'Nome Paciente',
      cell: ({ row }) =>
        row.original.Paciente?.nome
          ? row.original.Paciente.nome
          : 'Sem paciente',
    },
    {
      id: 'situacao',
      header: 'Situação',
      cell: ({ row }) => (row.original.Paciente ? 'Ocupado' : 'Disponível'),
      enableSorting: false,
    },
    {
      id: 'actions',
      enableHiding: false,
      cell: ({ row }) => {
        const leito = row.original;

        const handleOpenDialogAssocia = () => {
          if (leito.Paciente) {
            sonnerMessage('Erro', 'Este leito já está ocupado.', 'error');
          } else {
            setOpenDialogAssocia(true);
            setselectedLeitoId(leito.id);
          }
        };

        const handleOpenDialogDesassocia = () => {
          if (!leito.Paciente) {
            sonnerMessage('Erro', 'Este leito já está desocupado.', 'error');
          } else {
            setOpenDialogDesassocia(true);
            setselectedLeitoId(leito.id);
          }
        };

        const handleOpenDialogEditar = () => {
          setOpenDialogEditar(true);
          setselectedLeitoId(leito.id);
        };

        const handleDelete = async (id: number) => {
          try {
            const response = await api.delete(`/leitos/${id}`);
            if (response.status === 200) {
              sonnerMessage('Leito', 'Leito excluído com sucesso.', 'success');
              setData((prevData) => prevData.filter((c) => c.id !== id));
            } else {
              sonnerMessage('Leito', 'Erro ao excluir o leito.', 'error');
            }
          } catch (error) {
            console.error('Erro ao excluir o leito:', error);
            sonnerMessage(
              'Leito',
              'Erro ao excluir o leito. Por favor, tente novamente.',
              'error'
            );
          }
        };

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
                <DropdownMenuItem onClick={() => handleOpenDialogAssocia()}>
                  Associar paciente
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => handleOpenDialogDesassocia()}>
                  Desassociar paciente
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => handleOpenDialogEditar()}>
                  Editar
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => handleDelete(leito.id)}>
                  Excluir
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>

            {openDialogAssocia && (
              <AssociaPacienteLeito
                openDialog={openDialogAssocia}
                onOpenChange={setOpenDialogAssocia}
                leitoId={selectedLeitoId}
              />
            )}

            {openDialogDesassocia && (
              <DesassociaPacienteLeito
                openDialog={openDialogDesassocia}
                onOpenChange={setOpenDialogDesassocia}
                leitoId={selectedLeitoId}
              />
            )}

            {openDialogEditar && (
              <LeitoHospital
                id={selectedLeitoId}
                openDialog={openDialogEditar}
                onOpenChange={(open) => {
                  setOpenDialogEditar(open);
                  if (!open) {
                    fetchData();
                  }
                }}
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
          placeholder="Filtrar número..."
          value={(table.getColumn('numero')?.getFilterValue() as string) ?? ''}
          onChange={(event) =>
            table.getColumn('numero')?.setFilterValue(event.target.value)
          }
          className="max-w-sm"
        />
        <Button
          variant="outline"
          className="mx-4"
          onClick={() => setOpenDialogCriar(true)}
        >
          Criar <PlusIcon className="ml-2 h-4 w-4" />
        </Button>
        {openDialogCriar && (
          <LeitoHospital
            openDialog={openDialogCriar}
            onOpenChange={(open) => {
              setOpenDialogCriar(open);
              if (!open) {
                fetchData();
              }
            }}
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
