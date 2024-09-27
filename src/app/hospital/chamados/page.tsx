'use client';

import { useRouter } from 'next/navigation';
import { api } from '@/lib/axios';
import { useEffect } from 'react';
import NavbarHospital from '@/components/hospital/navbarHospital';
import { DataTableDemo } from '@/components/hospital/dtChamadosHospital';

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
    <>
      <head>
        <title>Hospital | Chamados</title>
      </head>
      <div>
        <NavbarHospital />
        <div className="flex m-5">
          <DataTableDemo />
        </div>
      </div>
    </>
  );
}
