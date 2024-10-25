'use client';

import Buttons from '../../components/paciente/buttons';
import NavbarPacientes from '../../components/paciente/navbarPacientes';

export default function Home() {
  return (
    <>
      <head>
        <title>Pacientes | Home</title>
      </head>
      <div>
        <NavbarPacientes />
        <Buttons />
      </div>
    </>
  );
}
