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
import UsuarioHospital from './usuarioHospital';

export type Usuarios = {
  id: number;
  username: string;
  email: string;
  senha: string;
  role: string;
};

export function DtUsuariosHospital() {
  const [data, setData] = useState<Usuarios[]>([]);
  const [sorting, setSorting] = useState<SortingState>([]);
  const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([]);
  const [columnVisibility, setColumnVisibility] = useState<VisibilityState>({});
  const [openDialog, setOpenDialog] = useState(false);
  const [openDialogEditar, setOpenDialogEditar] = useState(false);
  const [seletedUsuarioId, setSeletedUsuarioId] = useState<
    number | undefined
  >();
  const [userRole, setUserRole] = useState<'ADM' | 'MASTER' | null>(null);

  useEffect(() => {
    fetchData();
    checkUserRole();
  }, []);

  const fetchData = async () => {
    try {
      const response = await api.get(`/usuarios`);
      setData(response.data.usuarios);
    } catch (error) {
      console.error('Erro ao buscar os usuários:', error);
    }
  };

  const checkUserRole = async () => {
    try {
      const token = document.cookie.split('authTokenHospital=')[1] || '';
      if (token) {
        const response = await api.post('/token/hospital', {
          token,
        });
        setUserRole(response.data.hospital.user.role);
      }
    } catch (error) {
      console.error('Erro ao verificar o papel do usuário:', error);
      setUserRole(null);
    }
  };

  const formatRole = (role: string) => {
    switch (role) {
      case 'MASTER':
        return 'Master';
      case 'ADM':
        return 'Administrador';
      case 'FUNCIONARIO':
        return 'Funcionário';
      default:
        return role;
    }
  };

  const handleDelete = async (id: number) => {
    if (!userRole || (userRole !== 'ADM' && userRole !== 'MASTER')) {
      sonnerMessage(
        'Usuário',
        'Você não tem permissão para excluir usuários.',
        'error'
      );
      return;
    }

    try {
      const response = await api.delete(`/usuarios/${id}`);
      if (response.status === 200) {
        sonnerMessage('Usuário', 'Usuário excluído.', 'success');
        setData((prevData) => prevData.filter((c) => c.id !== id));
      } else {
        sonnerMessage('Usuário', 'Erro ao excluir o usuário.', 'error');
      }
    } catch (error) {
      console.error('Erro ao excluir o usuário:', error);
      sonnerMessage(
        'Usuário',
        'Erro ao excluir o usuário. Por favor, tente novamente.',
        'error'
      );
    }
  };

  const columns: ColumnDef<Usuarios>[] = [
    {
      accessorKey: 'username',
      header: 'Usuário',
    },
    {
      accessorKey: 'email',
      header: 'Email',
    },
    {
      accessorKey: 'password',
      header: 'Senha',
    },
    {
      accessorKey: 'role',
      header: 'Permissão',
      cell: ({ row }) => formatRole(row.original.role),
    },
    {
      id: 'actions',
      enableHiding: false,
      cell: ({ row }) => {
        const usuario = row.original;

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
                <DropdownMenuItem onClick={() => handleDelete(usuario.id)}>
                  Excluir
                </DropdownMenuItem>
                <DropdownMenuItem
                  onClick={() => {
                    if (
                      userRole &&
                      (userRole === 'ADM' || userRole === 'MASTER')
                    ) {
                      setOpenDialogEditar(true);
                      setSeletedUsuarioId(usuario.id);
                    } else {
                      sonnerMessage(
                        'Usuário',
                        'Você não tem permissão para editar usuários.',
                        'error'
                      );
                    }
                  }}
                >
                  Editar
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>

            {openDialogEditar && (
              <>
                <UsuarioHospital
                  id={seletedUsuarioId}
                  openDialog={openDialogEditar}
                  onOpenChange={(open) => {
                    setOpenDialogEditar(open);
                    if (!open) {
                      fetchData();
                    }
                  }}
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
          onClick={() => {
            if (userRole && (userRole === 'ADM' || userRole === 'MASTER')) {
              setOpenDialog(true);
            } else {
              sonnerMessage(
                'Usuário',
                'Você não tem permissão para criar usuários.',
                'error'
              );
            }
          }}
        >
          Criar <PlusIcon className="ml-2 h-4 w-4" />
        </Button>
        {openDialog && (
          <UsuarioHospital
            openDialog={openDialog}
            onOpenChange={(open) => {
              setOpenDialog(open);
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
