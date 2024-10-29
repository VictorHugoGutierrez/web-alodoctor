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
import { CheckIcon, Loader2 } from 'lucide-react';
import { Button } from '../ui/button';
import { CaretSortIcon } from '@radix-ui/react-icons';
import {
  Popover,
  PopoverTrigger,
  PopoverContent,
} from '@radix-ui/react-popover';
import {
  Command,
  CommandList,
  CommandEmpty,
  CommandGroup,
  CommandItem,
} from '@/components/ui/command';

interface RoleComboboxProps {
  onChange: Dispatch<SetStateAction<Usuario>>;
  selectedRole: string;
}

const RoleCombobox: React.FC<RoleComboboxProps> = ({
  onChange,
  selectedRole,
}) => {
  const [open, setOpen] = useState(false);
  const [value, setValue] = useState(selectedRole || '');

  const roles = [
    { value: 'MASTER', label: 'Master' },
    { value: 'ADM', label: 'Administrador' },
    { value: 'FUNCIONARIO', label: 'Funcionário' },
  ];

  const handleSelect = (currentValue: string) => {
    const newRole = currentValue === value ? '' : currentValue;
    setValue(newRole);
    onChange((prevUsuario) => ({
      ...prevUsuario,
      role: newRole,
    }));
    setOpen(false);
  };

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          role="combobox"
          aria-expanded={open}
          className="w-[200px] justify-between"
        >
          {value
            ? roles.find((role) => role.value === value)?.label
            : 'Selecione o nível...'}
          <CaretSortIcon className="ml-2 h-4 w-4 shrink-0 opacity-50" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-[200px] p-0">
        <Command>
          <CommandList>
            <CommandEmpty>Nenhum nível encontrado.</CommandEmpty>
            <CommandGroup>
              {roles.map((role) => (
                <CommandItem
                  key={role.value}
                  value={role.value}
                  onSelect={() => handleSelect(role.value)}
                >
                  {role.label}
                  <CheckIcon
                    className={`ml-auto h-4 w-4 ${
                      value === role.value ? 'opacity-100' : 'opacity-0'
                    }`}
                  />
                </CommandItem>
              ))}
            </CommandGroup>
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  );
};

interface Usuario {
  username: string;
  email: string;
  password: string;
  role: string;
}

interface UsuarioHospitalProps {
  id?: number;
  openDialog: boolean;
  onOpenChange: Dispatch<SetStateAction<boolean>>;
}

export default function UsuarioHospital({
  id,
  openDialog,
  onOpenChange,
}: UsuarioHospitalProps) {
  const [usuario, setUsuario] = useState<Usuario>({
    username: '',
    email: '',
    password: '',
    role: '',
  });
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    const fetchData = async () => {
      if (id !== undefined) {
        setLoading(true);
        try {
          const response = await api.get(`/usuarios/${id}`);
          setUsuario(response.data.usuario);
        } catch (error) {
          console.error('Erro ao verificar o estado do usuário:', error);
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
    if (!usuario) return;

    setLoading(true);
    try {
      const requestMethod = id ? api.put : api.post;
      const url = id ? `/usuarios/${id}` : '/usuarios';

      const response = await requestMethod(url, {
        username: usuario.username,
        password: usuario.password,
        email: usuario.email,
        role: usuario.role.toUpperCase(),
      });
      console.log(
        `Usuário ${id ? 'atualizado' : 'criado'} com sucesso:`,
        response.data
      );
    } catch (error) {
      console.error('Erro ao salvar o usuário:', error);
    } finally {
      setLoading(false);
      onOpenChange(false);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { id, value } = e.target;
    setUsuario((prevUsuario) => ({
      ...prevUsuario,
      [id]: value,
    }));
  };

  return (
    <Dialog open={openDialog} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Usuário</DialogTitle>
          <DialogDescription>Informações do usuário.</DialogDescription>
        </DialogHeader>
        {loading ? (
          <Loader2
            className="animate-spin justify-center items-center"
            size={32}
          />
        ) : (
          <div className="grid gap-4 py-4 text-sm">
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="username">Usuário</Label>
              <Input
                id="username"
                type="text"
                value={usuario.username}
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
                value={usuario.email}
                onChange={handleInputChange}
                className="col-span-3"
                required
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="senha">Senha</Label>
              <Input
                id="password"
                type="password"
                value={usuario.password}
                onChange={handleInputChange}
                className="col-span-3"
                required
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="role">Permissão</Label>
              <div>
                <RoleCombobox
                  selectedRole={usuario.role}
                  onChange={setUsuario}
                />
              </div>
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
