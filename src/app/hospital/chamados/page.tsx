'use client';

import NavbarHospital from '@/components/hospital/navbarHospital';
import { DtChamadosHospital } from '@/components/hospital/dtChamadosHospital';

export default function Home() {
  return (
    <>
      <head>
        <title>Hospital | Chamados</title>
      </head>
      <div>
        <NavbarHospital />
        <div className="flex m-5">
          <DtChamadosHospital />
        </div>
      </div>
    </>
  );
}
