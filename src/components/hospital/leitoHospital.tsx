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

interface Leito {
  numero: string;
  Paciente: { nome: string };
}

interface LeitoHospitalProps {
  id?: number;
  openDialog: boolean;
  onOpenChange: Dispatch<SetStateAction<boolean>>;
}

export default function LeitoHospital({
  id,
  openDialog,
  onOpenChange,
}: LeitoHospitalProps) {
  const [leito, setLeito] = useState<Leito>({
    numero: '',
    Paciente: { nome: '' },
  });
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    const fetchData = async () => {
      if (id !== undefined) {
        setLoading(true);
        try {
          const response = await api.get(`/leitos/${id}`);
          setLeito(response.data.leito);
        } catch (error) {
          console.error('Erro ao verificar o estado do leito:', error);
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
    if (!leito) return;

    setLoading(true);
    try {
      if (id) {
        const response = await api.put(`/leitos/${id}`, {
          numero: leito.numero.toUpperCase(),
        });
        console.log('Leito atualizado com sucesso:', response.data);
      } else {
        const response = await api.post('/leitos', {
          numero: leito.numero.toUpperCase(),
        });
        console.log('Leito criado com sucesso:', response.data);
      }
    } catch (error) {
      console.error('Erro ao salvar o leito: ', error);
    } finally {
      setLoading(false);
      onOpenChange(false);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { id, value } = e.target;
    setLeito((prevLeito) => ({
      ...prevLeito,
      [id]: value,
    }));
  };

  return (
    <Dialog open={openDialog} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Leito</DialogTitle>
          <DialogDescription>Informações do leito.</DialogDescription>
        </DialogHeader>
        {loading ? (
          <Loader2
            className="animate-spin justify-center items-center"
            size={32}
          />
        ) : (
          <div className="grid gap-4 py-4 text-sm">
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="numero">Número</Label>
              <Input
                id="numero"
                type="text"
                value={leito.numero}
                onChange={handleInputChange}
                className="col-span-3"
                required
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="numero">Paciente</Label>
              <Input
                id="numero"
                type="text"
                value={leito.Paciente ? leito.Paciente.nome : 'Sem paciente'}
                onChange={handleInputChange}
                className="col-span-3"
                readOnly
              />
            </div>
            <DialogFooter>
              <Button type="submit" onClick={handleSalvar}>
                Salvar
              </Button>
            </DialogFooter>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
}
