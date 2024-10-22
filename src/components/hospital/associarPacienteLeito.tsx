import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Checkbox } from '@/components/ui/checkbox';
import { useState, useEffect } from 'react';
import { api } from '@/lib/axios';
import { sonnerMessage } from '@/lib/sonnerMessage';
import { Paciente } from './dtPacientesHospital';

interface AssociaPacienteLeitoProps {
  openDialog: boolean;
  onOpenChange: (value: boolean) => void;
  leitoId?: number;
}

export default function AssociaPacienteLeito({
  openDialog,
  onOpenChange,
  leitoId,
}: AssociaPacienteLeitoProps) {
  const [pacientes, setPacientes] = useState<Paciente[]>([]);
  const [selectedPaciente, setSelectedPaciente] = useState<number | null>(null);
  const [numeroLeito, setNumeroLeito] = useState<string | null>(null);

  useEffect(() => {
    const fetchPacientes = async () => {
      try {
        const response = await api.get('/pacientes');
        setPacientes(response.data.pacientes);
      } catch (error) {
        console.error('Erro ao buscar pacientes:', error);
      }
    };

    fetchPacientes();
  }, []);

  useEffect(() => {
    const fetchLeito = async () => {
      try {
        const response = await api.get(`/leitos/${leitoId}`);
        setNumeroLeito(response.data.leito.numero);
      } catch (error) {
        console.error('Erro ao buscar detalhes do leito:', error);
      }
    };

    if (leitoId) {
      fetchLeito();
    }
  }, [leitoId]);

  const handleAssociate = async () => {
    if (selectedPaciente === null) {
      sonnerMessage('Erro', 'Nenhum paciente selecionado.', 'error');
      return;
    }

    try {
      const response = await api.post('/associaPacienteLeito', {
        pacienteId: selectedPaciente,
        leitoId,
      });

      if (response.status === 200) {
        sonnerMessage(
          'Sucesso',
          'Paciente associado ao leito com sucesso.',
          'success'
        );
        onOpenChange(false);
      } else {
        sonnerMessage('Erro', 'Erro ao associar paciente.', 'error');
      }
    } catch (error) {
      console.error('Erro ao associar paciente ao leito:', error);
      sonnerMessage(
        'Erro',
        'Erro ao associar paciente ao leito. Tente novamente.',
        'error'
      );
    }
  };

  return (
    <Dialog open={openDialog} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-[600px]">
        <DialogHeader>
          <DialogTitle>Associar Paciente ao Leito</DialogTitle>
          <DialogDescription>
            Selecione um paciente para associar ao leito {numeroLeito}.
          </DialogDescription>
        </DialogHeader>
        <div className="py-4">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Selecionar</TableHead>
                <TableHead>Nome</TableHead>
                <TableHead>Email</TableHead>
                <TableHead>Leito Atual</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {pacientes.map((paciente) => (
                <TableRow key={paciente.id}>
                  <TableCell>
                    <Checkbox
                      checked={selectedPaciente === paciente.id}
                      onCheckedChange={() => {
                        if (!paciente.leito) {
                          setSelectedPaciente(paciente.id);
                        }
                      }}
                      disabled={!!paciente.leito}
                    />
                  </TableCell>
                  <TableCell>{paciente.nome}</TableCell>
                  <TableCell>{paciente.email}</TableCell>
                  <TableCell>
                    {paciente.leito ? `Leito ${paciente.leito}` : 'Sem leito'}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
        <div className="flex justify-end space-x-2">
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Cancelar
          </Button>
          <Button onClick={handleAssociate}>Associar</Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
