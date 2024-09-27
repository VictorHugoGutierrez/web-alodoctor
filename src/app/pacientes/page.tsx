'use client';

import { useRouter } from 'next/navigation';
import { api } from '@/lib/axios';
import { useEffect } from 'react';
import Buttons from '../../components/paciente/buttons';
import Head from 'next/head';
import NavbarPacientes from '../../components/paciente/navbarPacientes';

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

        if (!paciente.Leito) {
          window.location.reload();
        } else if (!paciente) {
          window.location.reload();
        }
      } catch (error) {
        console.error('Erro ao verificar o estado do leito:', error);
      }
    }, 5000);

    return () => clearInterval(interval); // Limpa o intervalo quando o componente desmonta
  }, [router]);

  return (
    <>
      <Head>
        <title>Pacientes | Home</title>
        <meta name="description" content="Descrição da página principal" />
      </Head>
      <div>
        <NavbarPacientes />
        <Buttons />
      </div>
    </>
  );
}
