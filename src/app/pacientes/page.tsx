'use client';

import Buttons from '../../components/paciente/buttons';
import Head from 'next/head';
import NavbarPacientes from '../../components/paciente/navbarPacientes';

export default function Home() {
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
