'use client';

import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { sonnerMessage } from '@/lib/sonnerMessage';
import { CircleAlert, LogOut } from 'lucide-react';
import Cookies from 'js-cookie';
import { useRouter } from 'next/navigation';
import { api } from '@/lib/axios';
import { Button } from '@/components/ui/button';

export default function Home() {
  const router = useRouter();

  const handleSairButton = async () => {
    try {
      const token = document.cookie.split('authTokenPaciente=')[1] || '';

      if (token) {
        const response = await api.post('/token', { token: token });

        if (response.status === 200) {
          Cookies.remove('authTokenPaciente');
          router.push('/');
        }
      }
    } catch (error) {
      sonnerMessage(
        'Erro',
        'Não foi possível sair da sua seção. Tente novamente mais tarde.',
        'error'
      );
    }
  };

  return (
    <>
      <head>
        <title>Pacientes | Espera</title>
      </head>
      <div className="w-screen h-screen flex items-center justify-center">
        <div className="md:w-1/2 mx-2">
          <Alert>
            <CircleAlert className="h-4 w-4" />
            <AlertTitle>Aguarde um momento!</AlertTitle>
            <AlertDescription>
              Você será redirecionado assim que estiver em um leito. Se preferir
              sair da conta, clique no botão abaixo.
            </AlertDescription>
            <div>
              <Button onClick={handleSairButton} className="mt-4">
                <LogOut className="mr-2" />
                Sair
              </Button>
            </div>
          </Alert>
        </div>
      </div>
    </>
  );
}
