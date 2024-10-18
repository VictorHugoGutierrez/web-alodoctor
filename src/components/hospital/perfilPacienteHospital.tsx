import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Label } from '@radix-ui/react-label';
import { Input } from '@/components/ui/input';
import { api } from '@/lib/axios';
import { Dispatch, SetStateAction, useEffect, useState } from 'react';
import { Loader2 } from 'lucide-react';
import { Button } from '../ui/button';
import { open } from 'fs';

interface Paciente {
  nome: string;
  Leito: { numero: string };
  email: string;
  dataNascimento: string;
  senha: string;
}

interface PerfilPacienteHospitalProps {
  id?: number;
  openDialog: boolean;
  onOpenChange: Dispatch<SetStateAction<boolean>>;
  edita?: boolean;
  readOnly?: boolean;
}

export default function PerfilPacienteHospital({
  id,
  openDialog,
  onOpenChange,
  edita = false,
  readOnly = true,
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

  const handleSalvar = async () => {
    try {
      const response = await api.post('/pacientes', {
        email: paciente?.email,
        senha: paciente?.senha,
        nome: paciente?.nome,
        dataNascimento: paciente?.dataNascimento,
      });
    } catch (error) {
      console.error('Erro ao criar o paciente: ', error);
    }
  };

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
          <>
            {readOnly == true ? (
              <div className="grid gap-4 py-4 text-sm">
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="nome">Nome</Label>
                  <Input
                    id="nome"
                    type="text"
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
            ) : (
              <div className="grid gap-4 py-4 text-sm">
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="nome">Nome</Label>
                  <Input
                    id="nome"
                    value={paciente?.nome}
                    onChange={(e) =>
                      setPaciente((prev) =>
                        prev ? { ...prev, nome: e.target.value } : null
                      )
                    }
                    className="col-span-3"
                    required
                  />
                </div>
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="email">Email</Label>
                  <Input
                    id="email"
                    value={paciente?.email}
                    onChange={(e) =>
                      setPaciente((prev) =>
                        prev ? { ...prev, email: e.target.value } : null
                      )
                    }
                    className="col-span-3"
                    required
                  />
                </div>
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="email">Senha</Label>
                  <Input
                    id="password"
                    value={paciente?.senha}
                    onChange={(e) =>
                      setPaciente((prev) =>
                        prev ? { ...prev, senha: e.target.value } : null
                      )
                    }
                    className="col-span-3"
                    required
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
                    onChange={(e) =>
                      setPaciente((prev) =>
                        prev
                          ? { ...prev, dataNascimento: e.target.value }
                          : null
                      )
                    }
                    className="col-span-3"
                    required
                  />
                </div>
              </div>
            )}
            {edita && (
              <DialogFooter>
                <Button type="submit">Salvar</Button>
              </DialogFooter>
            )}
          </>
        )}
      </DialogContent>
    </Dialog>
  );
}
