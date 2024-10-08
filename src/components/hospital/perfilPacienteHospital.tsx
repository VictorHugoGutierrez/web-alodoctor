import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Label } from '@radix-ui/react-label';
import { Input } from '@/components/ui/input';
import { api } from '@/lib/axios';
import { Dispatch, SetStateAction, useEffect, useState } from 'react';
import { Loader2 } from 'lucide-react';

interface Paciente {
  nome: string;
  Leito: { numero: string };
  email: string;
  dataNascimento: string;
}

interface PerfilPacienteHospitalProps {
  id: number;
  openDialog: boolean;
  onOpenChange: Dispatch<SetStateAction<boolean>>;
}

export default function PerfilPacienteHospital({
  id,
  openDialog,
  onOpenChange,
}: PerfilPacienteHospitalProps) {
  const [paciente, setPaciente] = useState<Paciente | null>(null);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const response = await api.get(`/pacientes/${id}`);
        setPaciente(response.data.paciente);
      } catch (error) {
        console.error('Erro ao verificar o estado do leito:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [id]);

  function formatDate(data: string) {
    const [year, month, day] = data.split('T')[0].split('-');
    return `${day}/${month}/${year}`;
  }

  return (
    <Dialog open={openDialog} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Perfil</DialogTitle>
          <DialogDescription>
            Informações do perfil do paciente.
          </DialogDescription>
        </DialogHeader>
        {loading ? (
          <Loader2
            className="animate-spin justify-center items-center"
            size={32}
          />
        ) : (
          <div className="grid gap-4 py-4 text-sm">
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="nome">Nome</Label>
              <Input
                id="nome"
                value={paciente?.nome}
                className="col-span-3"
                readOnly
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="leito">Leito</Label>
              <Input
                id="leito"
                value={paciente?.Leito.numero}
                className="col-span-3"
                readOnly
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                value={paciente?.email}
                className="col-span-3"
                readOnly
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="email">Data de Nascimento</Label>
              <Input
                id="date"
                value={
                  paciente?.dataNascimento
                    ? formatDate(paciente.dataNascimento)
                    : ''
                }
                className="col-span-3"
                readOnly
              />
            </div>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
}
