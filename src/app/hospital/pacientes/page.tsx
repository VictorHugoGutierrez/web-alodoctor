'use client';

import NavbarHospital from '@/components/hospital/navbarHospital';
import { DtPacientesHospital } from '@/components/hospital/dtPacientesHospital';

export default function Home() {
  return (
    <>
      <head>
        <title>Hospital | Pacientes</title>
      </head>
      <div>
        <NavbarHospital />
        <div className="flex m-5">
          <DtPacientesHospital />
        </div>
      </div>
    </>
  );
}
