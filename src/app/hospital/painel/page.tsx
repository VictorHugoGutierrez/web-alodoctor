'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { DtChamadosPainel } from '@/components/hospital/dtChamadosPainel';

export default function Home() {
  const router = useRouter();

  const enterFullScreen = async () => {
    const element = document.documentElement as HTMLElement;

    try {
      if (element.requestFullscreen) {
        await element.requestFullscreen();
      } else if ((element as any).webkitRequestFullscreen) {
        await (element as any).webkitRequestFullscreen();
      } else if ((element as any).msRequestFullscreen) {
        await (element as any).msRequestFullscreen();
      }
    } catch (error) {
      console.error('Erro ao entrar em tela cheia:', error);
    }
  };

  useEffect(() => {
    enterFullScreen();

    const onFullScreenChange = () => {
      if (!document.fullscreenElement) {
        router.push('/hospital');
      }
    };

    document.addEventListener('fullscreenchange', onFullScreenChange);

    return () => {
      document.removeEventListener('fullscreenchange', onFullScreenChange);
    };
  }, [router]);

  return (
    <div className="m-5">
      <DtChamadosPainel />
    </div>
  );
}
