'use client';

import { useState } from 'react';
import {
  faRestroom,
  faBowlFood,
  faSnowflake,
  faFireFlameCurved,
  faSyringe,
  faBottleWater,
  faUserNurse,
  faHeartPulse,
} from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { api } from '@/lib/axios';
import { Progress } from '@/components/ui/progress';
import { sonnerMessage } from '@/lib/sonnerMessage';

export default function Buttons() {
  const icons = [
    faRestroom,
    faBowlFood,
    faSnowflake,
    faFireFlameCurved,
    faSyringe,
    faBottleWater,
    faUserNurse,
    faHeartPulse,
  ];

  const iconsName = [
    'Banheiro',
    'Alimentação',
    'Frio',
    'Calor',
    'Medicação',
    'Água',
    'Enfermeira',
    'Emergência',
  ] as const;

  type IconName = (typeof iconsName)[number];

  const prioridadeMap: Record<IconName, string> = {
    Banheiro: 'Média',
    Alimentação: 'Baixa',
    Frio: 'Baixa',
    Calor: 'Baixa',
    Medicação: 'Alta',
    Água: 'Média',
    Enfermeira: 'Alta',
    Emergência: 'Alta',
  };

  const [loading, setLoading] = useState(false);
  const [progress, setProgress] = useState(13);

  const delay = (ms: number) =>
    new Promise((resolve) => setTimeout(resolve, ms));

  const handleClick = async (name: IconName) => {
    setLoading(true);

    try {
      const token = document.cookie.split('authTokenPaciente=')[1] || '';
      const responsePaciente = await api.post('/token/paciente', { token });
      await delay(500);
      const { paciente } = responsePaciente.data;

      setProgress(25);
      await delay(500);
      const response = await api.post('/chamados', {
        descricao: name,
        prioridade: prioridadeMap[name],
        pacienteId: paciente.id,
        leitoId: paciente.Leito.id,
      });

      setProgress(50);
      await delay(500);
      setProgress(75);

      if (response.status === 200) {
        setProgress(100);
        sonnerMessage(
          'Chamado criado com sucesso!',
          name + ' com prioridade ' + prioridadeMap[name],
          'success'
        );
      } else {
        sonnerMessage(
          'Erro ao criar o chamado.',
          'Erro ao criar o chamado. Por favor, tente novamente.',
          'error'
        );
      }
    } catch (error) {
      console.error('Erro:', error);
      sonnerMessage(
        'Erro ao criar o chamado.',
        'Erro ao criar o chamado. Por favor, tente novamente.',
        'error'
      );
    } finally {
      await delay(500);
      setLoading(false);
      setProgress(13);
    }
  };

  return (
    <div className="flex h-screen items-center justify-center">
      <div className="grid grid-cols-2 gap-4 md:grid-cols-4 md:gap-6">
        {icons.map((icon, index) => (
          <Card
            key={index}
            className={`lg:w-full w-full flex flex-col items-center justify-center hover:scale-110 transition-all duration-500 cursor-pointer ${
              loading ? 'opacity-50 cursor-not-allowed' : ''
            }`}
            onClick={() => !loading && handleClick(iconsName[index])}
          >
            <CardHeader className="flex flex-col items-center">
              <CardTitle>
                <p className="lg:text-xl text-base">{iconsName[index]}</p>
              </CardTitle>
            </CardHeader>
            <CardContent className="flex items-center justify-center">
              <FontAwesomeIcon
                id="icon"
                icon={icon}
                size="2xl"
                color="#208B3A"
              />
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
