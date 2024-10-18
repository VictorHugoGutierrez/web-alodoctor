'use client';

import { useRouter } from 'next/navigation';
import { api } from '@/lib/axios';
import { useEffect } from 'react';
import Head from 'next/head';
import NavbarHospital from '../../components/hospital/navbarHospital';
import LandingPage from '@/components/hospital/landingPage';

export default function Home() {
  // const router = useRouter();

  // useEffect(() => {
  //   const interval = setInterval(async () => {
  //     try {
  //       const token = document.cookie.split('authTokenHospital=')[1] || '';

  //       const response = await api.post('/token/hospital', {
  //         token,
  //       });

  //       const { hospital } = response.data;

  //       if (!hospital) {
  //         window.location.reload();
  //       }
  //     } catch (error) {
  //       console.error('Erro ao verificar o estado do token hospital:', error);
  //     }
  //   }, 5000);

  //   return () => clearInterval(interval);
  // }, [router]);

  return (
    <div>
      <NavbarHospital />
      <LandingPage
        textTitle="Bem vindo ao Alô Doctor!"
        textSubTitle="Sistema Integrado de Comunicação Hospitalar"
      />
    </div>
  );
}
