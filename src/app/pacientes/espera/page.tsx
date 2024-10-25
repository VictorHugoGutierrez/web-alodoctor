'use client';

import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { CircleAlert } from 'lucide-react';

export default function Home() {
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
              Você será redirecionado quando estiver em um leito.
            </AlertDescription>
          </Alert>
        </div>
      </div>
    </>
  );
}
