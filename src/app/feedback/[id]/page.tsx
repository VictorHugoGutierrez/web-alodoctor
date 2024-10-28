'use client';

import { Suspense } from 'react';
import { useParams, useSearchParams } from 'next/navigation';
import Agradecimento from '@/components/feedback/agradecimento';

export default function FeedbackPage() {
  const searchParams = useSearchParams();
  const { id } = useParams();
  const levelFromUrl = searchParams.get('level');

  return (
    <>
      <head>
        <title>Alô Doctor | Feedback</title>
      </head>
      <Suspense fallback={<div>Carregando...</div>}>
        <Agradecimento
          id={Array.isArray(id) ? id[0] : id}
          levelFromUrl={levelFromUrl}
        />
      </Suspense>
    </>
  );
}
