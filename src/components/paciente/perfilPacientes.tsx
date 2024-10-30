'use client';

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { Label } from '@radix-ui/react-label';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { api } from '@/lib/axios';
import { useEffect, useState } from 'react';
import { sonnerMessage } from '@/lib/sonnerMessage';

interface Paciente {
  id: string;
  nome: string;
  Leito: { numero: string };
  email: string;
  dataNascimento: string;
  senha: string;
}

export default function Perfil() {
  const [paciente, setPaciente] = useState<Paciente>({
    id: '',
    nome: '',
    Leito: { numero: '' },
    email: '',
    dataNascimento: '',
    senha: '',
  });
  const [novaSenha, setNovaSenha] = useState('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const token = document.cookie.split('authTokenPaciente=')[1] || '';
        if (token) {
          const response = await api.post('/token/paciente', { token });
          setPaciente(response.data.paciente);
        }
      } catch (error) {
        console.error('Erro ao verificar o estado do leito:', error);
      }
    };

    fetchData();
  }, []);

  const handleSalvar = async () => {
    if (!paciente) return;

    setLoading(true);
    try {
      const payload = {
        email: paciente.email,
        nome: paciente.nome,
        dataNascimento: new Date(paciente.dataNascimento)
          .toISOString()
          .split('T')[0],
        senha: novaSenha || paciente.senha,
      };

      const response = await api.put(`/pacientes/${paciente.id}`, payload);
      sonnerMessage('Paciente', 'Paciente atualizado com sucesso.', 'success');
      if (novaSenha) setNovaSenha('');
    } catch (error) {
      sonnerMessage('Paciente', 'Erro ao salvar o paciente.', 'error');
      console.error('Erro ao salvar o paciente: ', error);
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { id, value } = e.target;
    if (id === 'novaSenha') {
      setNovaSenha(value);
    } else {
      setPaciente((prevPaciente) => ({
        ...prevPaciente,
        [id]: value,
      }));
    }
  };

  if (!paciente || !paciente.Leito.numero) return <div>Carregando...</div>;

  return (
    <Dialog>
      <DialogTrigger>Perfil</DialogTrigger>
      <DialogContent className="max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Perfil</DialogTitle>
          <DialogDescription>
            Faça alterações no seu perfil aqui. Clique em salvar quando você
            terminar.
          </DialogDescription>
        </DialogHeader>
        <div className="grid gap-4 py-4 text-sm">
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="nome">Nome</Label>
            <Input
              id="nome"
              value={paciente.nome}
              onChange={handleInputChange}
              className="col-span-3"
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
              onChange={handleInputChange}
              className="col-span-3"
            />
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="dataNascimento">Data de Nascimento</Label>
            <Input
              id="dataNascimento"
              type="date"
              value={
                new Date(paciente.dataNascimento).toISOString().split('T')[0]
              }
              onChange={handleInputChange}
              className="col-span-3"
            />
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="novaSenha">Nova Senha</Label>
            <Input
              id="novaSenha"
              type="password"
              value={novaSenha}
              onChange={handleInputChange}
              className="col-span-3"
            />
          </div>
        </div>
        <DialogFooter>
          <Button onClick={handleSalvar} disabled={loading}>
            {loading ? 'Salvando...' : 'Salvar alterações'}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
