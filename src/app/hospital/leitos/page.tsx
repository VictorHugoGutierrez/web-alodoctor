'use client';

import NavbarHospital from '@/components/hospital/navbarHospital';
import { DtLeitosHospital } from '@/components/hospital/dtLeitosHospital';

export default function Home() {
  return (
    <>
      <head>
        <title>Hospital | Leitos</title>
      </head>
      <div>
        <NavbarHospital />
        <div className="flex m-5">
          <DtLeitosHospital />
        </div>
      </div>
    </>
  );
}
