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
  const [paciente, setPaciente] = useState<Paciente>({
    nome: '',
    Leito: { numero: '' },
    email: '',
    dataNascimento: '',
    senha: '',
  });
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    const fetchData = async () => {
      if (id !== undefined) {
        setLoading(true);
        try {
          const response = await api.get(`/pacientes/${id}`);
          const fetchedPaciente = response.data.paciente;
          setPaciente(fetchedPaciente);
        } catch (error) {
          console.error('Erro ao verificar o estado do paciente:', error);
        } finally {
          setLoading(false);
        }
      } else {
        setLoading(false);
      }
    };

    fetchData();
  }, [id]);

  const handleSalvar = async () => {
    if (!paciente) return;

    setLoading(true);
    try {
      if (id) {
        console.log(paciente.dataNascimento);
        const response = await api.put(`/pacientes/${id}`, {
          email: paciente.email,
          senha: paciente.senha,
          nome: paciente.nome,
          dataNascimento: paciente.dataNascimento,
        });
        console.log('Paciente atualizado com sucesso:', response.data);
      } else {
        const response = await api.post('/pacientes', {
          email: paciente.email,
          senha: paciente.senha,
          nome: paciente.nome,
          dataNascimento: paciente.dataNascimento,
        });
        console.log('Paciente criado com sucesso:', response.data);
      }
    } catch (error) {
      console.error('Erro ao salvar o paciente: ', error);
    } finally {
      setLoading(false);
      onOpenChange(false);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { id, value } = e.target;
    setPaciente((prevPaciente) => ({
      ...prevPaciente,
      [id]: value,
    }));
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
            {readOnly ? (
              <div className="grid gap-4 py-4 text-sm">
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="nome">Nome</Label>
                  <Input
                    id="nome"
                    type="text"
                    value={paciente.nome}
                    className="col-span-3"
                    readOnly
                  />
                </div>
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="leito">Leito</Label>
                  <Input
                    id="leito"
                    value={paciente.Leito.numero}
                    className="col-span-3"
                    readOnly
                  />
                </div>
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="email">Email</Label>
                  <Input
                    id="email"
                    value={paciente.email}
                    className="col-span-3"
                    readOnly
                  />
                </div>
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="dataNascimento">Data de Nascimento</Label>
                  <Input
                    id="dataNascimento"
                    type="date"
                    value={
                      paciente?.dataNascimento
                        ? new Date(paciente.dataNascimento)
                            .toISOString()
                            .split('T')[0]
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
                    type="text"
                    value={paciente.nome}
                    onChange={handleInputChange}
                    className="col-span-3"
                    required
                  />
                </div>
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="email">Email</Label>
                  <Input
                    id="email"
                    type="email"
                    value={paciente.email}
                    onChange={handleInputChange}
                    className="col-span-3"
                    required
                  />
                </div>
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="senha">Senha</Label>
                  <Input
                    id="senha"
                    type="password"
                    value={paciente.senha}
                    onChange={handleInputChange}
                    className="col-span-3"
                    required
                  />
                </div>
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="dataNascimento">Data de Nascimento</Label>
                  <Input
                    id="dataNascimento"
                    type="date"
                    value={
                      paciente?.dataNascimento
                        ? new Date(paciente.dataNascimento)
                            .toISOString()
                            .split('T')[0]
                        : ''
                    }
                    onChange={handleInputChange}
                    className="col-span-3"
                    required
                  />
                </div>
              </div>
            )}
            {edita && (
              <DialogFooter>
                <Button type="submit" onClick={handleSalvar}>
                  Salvar
                </Button>
              </DialogFooter>
            )}
          </>
        )}
      </DialogContent>
    </Dialog>
  );
}
