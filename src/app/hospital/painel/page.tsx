'use client';

import { DtChamadosPainel } from '@/components/hospital/dtChamadosPainel';
import { Button } from '@/components/ui/button';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';

export default function Home() {
  const router = useRouter();
  const [isFullScreen, setIsFullScreen] = useState(false);

  const enterFullScreen = async (
    element: HTMLElement = document.documentElement
  ) => {
    try {
      if (element.requestFullscreen) {
        await element.requestFullscreen();
      } else if ((element as any).webkitRequestFullscreen) {
        await (element as any).webkitRequestFullscreen();
      } else if ((element as any).msRequestFullscreen) {
        await (element as any).msRequestFullscreen();
      } else {
        console.warn('O modo tela cheia não é suportado neste navegador.');
      }
      setIsFullScreen(true);
    } catch (error) {
      console.error('Erro ao tentar entrar em tela cheia:', error);
    }
  };

  useEffect(() => {
    const handleFullScreenChange = () => {
      if (!document.fullscreenElement) {
        router.push('/hospital');
      }
    };

    document.addEventListener('fullscreenchange', handleFullScreenChange);

    return () => {
      document.removeEventListener('fullscreenchange', handleFullScreenChange);
    };
  }, [router]);

  return (
    <>
      <head>
        <title>Hospital | Painel</title>
      </head>
      <div className="m-5">
        <div className="flex items-center py-4">
          {!isFullScreen && (
            <Button variant="outline" onClick={() => enterFullScreen()}>
              Entrar em tela cheia
            </Button>
          )}
        </div>
        <DtChamadosPainel />
      </div>
    </>
  );
}
