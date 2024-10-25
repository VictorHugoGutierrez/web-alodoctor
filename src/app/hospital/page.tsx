'use client';

import NavbarHospital from '../../components/hospital/navbarHospital';
import LandingPage from '@/components/hospital/landingPage';

export default function Home() {
  return (
    <>
      <head>
        <title>Hospital | Home</title>
      </head>
      <div>
        <NavbarHospital />
        <LandingPage
          textTitle="Bem vindo ao Alô Doctor!"
          textSubTitle="Sistema Integrado de Comunicação Hospitalar"
        />
      </div>
    </>
  );
}
