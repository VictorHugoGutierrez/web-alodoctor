'use client';

import NavbarHospital from '@/components/hospital/navbarHospital';
import { DtSatisfacaoHospital } from '@/components/hospital/dtSatisfacaoHospital';

export default function Home() {
  return (
    <>
      <head>
        <title>Hospital | Feedback</title>
      </head>
      <div>
        <NavbarHospital />
        <div className="flex m-5">
          <DtSatisfacaoHospital />
        </div>
      </div>
    </>
  );
}
