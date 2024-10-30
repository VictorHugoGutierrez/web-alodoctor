'use client';

import {
  ColumnDef,
  SortingState,
  flexRender,
  getCoreRowModel,
  getPaginationRowModel,
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
import { Button } from '../ui/button';
import { useRouter } from 'next/navigation';

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
};

export function DtChamadosPainel() {
  const [data, setData] = useState<Chamado[]>([]);
  const [sorting, setSorting] = useState<SortingState>([]);
  const [isFullScreen, setIsFullScreen] = useState(false);
  const router = useRouter();

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

  const enterFullScreen = async (
    element: HTMLElement = document.documentElement
  ) => {
    try {
      if (element.requestFullscreen) {
        await element.requestFullscreen();
      } else if ((element as any).webkitRequestFullscreen) {
        await (element as any).webkitRequestFullscreen();
      } else if ((element as any).msRequestFullscreen) {
        await (element as any).msRequestFullscreen();
      } else {
        console.warn('O modo tela cheia não é suportado neste navegador.');
      }
      setIsFullScreen(true);
    } catch (error) {
      console.error('Erro ao tentar entrar em tela cheia:', error);
    }
  };

  useEffect(() => {
    const handleFullScreenChange = () => {
      if (!document.fullscreenElement) {
        setIsFullScreen(false);
        router.push('/hospital');
      }
    };

    document.addEventListener('fullscreenchange', handleFullScreenChange);

    return () => {
      document.removeEventListener('fullscreenchange', handleFullScreenChange);
    };
  }, [router]);

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
  ];

  const table = useReactTable({
    data,
    columns,
    onSortingChange: setSorting,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getSortedRowModel: getSortedRowModel(),
    state: {
      sorting: [{ id: 'prioridade', desc: false }],
    },
  });

  return (
    <div className="w-full">
      <div className="flex items-center py-4">
        {!isFullScreen && (
          <Button variant="outline" onClick={() => enterFullScreen()}>
            Entrar em tela cheia
          </Button>
        )}
      </div>
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
