'use client';

import { DtUsuariosHospital } from '@/components/hospital/dtUsuarioHospital';
import NavbarHospital from '@/components/hospital/navbarHospital';

export default function Home() {
  return (
    <>
      <head>
        <title>Hospital | Usuários</title>
      </head>
      <div>
        <NavbarHospital />
        <div className="flex m-5">
          <DtUsuariosHospital />
        </div>
      </div>
    </>
  );
}
