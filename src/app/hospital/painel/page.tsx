'use client';

import { DtChamadosPainel } from '@/components/hospital/dtChamadosPainel';

export default function Home() {
  return (
    <>
      <head>
        <title>Hospital | Painel</title>
      </head>
      <div className="m-5">
        <DtChamadosPainel />
      </div>
    </>
  );
}
