'use client';

import ModeToggle from '@/components/themeButton';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
  CardFooter,
} from '@/components/ui/card';
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar';
import { Label } from '@/components/ui/label';
import { useRouter, useSearchParams } from 'next/navigation';
import { Input } from '@/components/ui/input';
import { Dispatch, FormEvent, SetStateAction, useState } from 'react';
import { CaretSortIcon, CheckIcon } from '@radix-ui/react-icons';
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandItem,
  CommandList,
} from '@/components/ui/command';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';
import { api } from '@/lib/axios';
import { sonnerMessage } from '@/lib/sonnerMessage';

interface LevelComboboxProps {
  onChange: Dispatch<SetStateAction<string>>;
  selectedLevel: string;
}

const LevelCombobox: React.FC<LevelComboboxProps> = ({
  onChange,
  selectedLevel,
}) => {
  const [open, setOpen] = useState(false);
  const [value, setValue] = useState(selectedLevel || '');

  const levels = [
    { value: 'SATISFEITO', label: 'Satisfeito' },
    { value: 'INSATISFEITO', label: 'Insatisfeito' },
    { value: 'NEUTRO', label: 'Neutro' },
  ];

  const handleSelect = (currentValue: string) => {
    setValue(currentValue === value ? '' : currentValue);
    onChange(currentValue === value ? '' : currentValue);
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
            ? levels.find((level) => level.value === value)?.label
            : 'Selecione o nível...'}
          <CaretSortIcon className="ml-2 h-4 w-4 shrink-0 opacity-50" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-[200px] p-0">
        <Command>
          <CommandList>
            <CommandEmpty>Nenhum nível encontrado.</CommandEmpty>
            <CommandGroup>
              {levels.map((level) => (
                <CommandItem
                  key={level.value}
                  value={level.value}
                  onSelect={() => handleSelect(level.value)}
                >
                  {level.label}
                  <CheckIcon
                    className={`ml-auto h-4 w-4 ${
                      value === level.value ? 'opacity-100' : 'opacity-0'
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

export default function Agradecimento() {
  const router = useRouter();
  const searchParams = useSearchParams();

  const id = searchParams.get('id');
  const levelFromUrl = searchParams.get('level');

  const [comentario, setComentario] = useState('');
  const [selectedLevel, setSelectedLevel] = useState(levelFromUrl || '');

  const handleSubmitFeedback = async (e?: FormEvent) => {
    if (e) e.preventDefault();

    try {
      const response = await api.post(`/pacientes/${Number(id)}/satisfacao`, {
        level: selectedLevel,
        comentario: comentario,
      });

      if (response.status === 200) {
        sonnerMessage(
          'Feedback feito com sucesso!',
          'Muito obrigado! Sua opinião irá ajudar muito a gente!',
          'success'
        );
        router.push('/');
      }
    } catch (error: any) {
      sonnerMessage(
        'Erro',
        'Erro inesperado ao tentar criar o feedback.',
        'error'
      );
    }
  };

  return (
    <>
      <head>
        <title>Feedback | Paciente</title>
      </head>
      <div className="h-screen w-screen flex items-center justify-center">
        <form onSubmit={handleSubmitFeedback}>
          <Card>
            <div className="flex items-center">
              <CardHeader>
                <CardTitle>Feedback</CardTitle>
                <CardDescription>Deixe sua avaliação aqui!</CardDescription>
              </CardHeader>
              <Avatar className="w-40 h-20 ml-auto items-end">
                <AvatarImage src="/alodoctor-logo.svg" />
                <AvatarFallback>Logo</AvatarFallback>
              </Avatar>
            </div>
            <CardContent className="space-y-2">
              <div className="space-y-1">
                <Label htmlFor="level">Nível de Satisfação:</Label>
                <div>
                  <LevelCombobox
                    selectedLevel={selectedLevel}
                    onChange={setSelectedLevel}
                  />
                </div>
              </div>
              <div className="space-y-1">
                <Label htmlFor="comentario">Comentários da Avaliação:</Label>
                <Input
                  id="comentario"
                  type="text"
                  onChange={(e) => setComentario(e.target.value)}
                  required
                />
              </div>
            </CardContent>
            <CardFooter className="gap-2">
              <Button type="submit">Enviar</Button>
              <ModeToggle />
            </CardFooter>
          </Card>
        </form>
      </div>
    </>
  );
}
