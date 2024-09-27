'use client';

import { useEffect } from 'react';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { CircleAlert } from 'lucide-react';
import { api } from '@/lib/axios';
import { useRouter } from 'next/navigation';

export default function Home() {
  const router = useRouter();

  useEffect(() => {
    const interval = setInterval(async () => {
      try {
        const token = document.cookie.split('authTokenPaciente=')[1] || '';

        const response = await api.post('/token/paciente', {
          token,
        });

        const { paciente } = response.data;

        if (paciente.Leito) {
          window.location.reload();
        }
      } catch (error) {
        console.error('Erro ao verificar o estado do leito:', error);
      }
    }, 5000);

    return () => clearInterval(interval);
  }, [router]);

  return (
    <>
      <div className="w-screen h-screen flex items-center justify-center">
        <div className="md:w-1/2 mx-2">
          <Alert>
            <CircleAlert className="h-4 w-4" />
            <AlertTitle>Aguarde um momento!</AlertTitle>
            <AlertDescription>
              Você será redirecionado quando estiver em um leito.
            </AlertDescription>
          </Alert>
        </div>
      </div>
    </>
  );
}
