import { NextRequest, NextResponse } from 'next/server';
import { api } from './lib/axios';

export async function middleware(req: NextRequest) {
  // const url = new URL(req.url);
  // const authTokenPaciente = req.cookies.get('authTokenPaciente')?.value;
  // const authTokenHospital = req.cookies.get('authTokenHospital')?.value;
  // // Se o token de paciente existir, verificar estado do paciente a cada requisição
  // if (authTokenPaciente) {
  //   try {
  //     const response = await api.post('/token/paciente', {
  //       token: authTokenPaciente,
  //     });
  //     const { paciente } = response.data;
  //     // Paciente com leito: Permite o acesso às rotas de paciente e redireciona da página de espera
  //     if (paciente && paciente.Leito) {
  //       if (url.pathname === '/pacientes/espera') {
  //         return NextResponse.redirect(new URL('/pacientes', req.url));
  //       }
  //       if (url.pathname === '/') {
  //         return NextResponse.redirect(new URL('/pacientes', req.url));
  //       }
  //       if (url.pathname.startsWith('/pacientes')) {
  //         return NextResponse.next(); // Permite o acesso às rotas de paciente
  //       }
  //     } else {
  //       // Paciente sem leito: Redireciona para a página de espera
  //       if (
  //         url.pathname.startsWith('/pacientes') &&
  //         url.pathname !== '/pacientes/espera'
  //       ) {
  //         return NextResponse.redirect(new URL('/pacientes/espera', req.url));
  //       }
  //       // Paciente sem leito: Redireciona para a página de espera
  //       if (
  //         url.pathname.startsWith('/') &&
  //         url.pathname !== '/pacientes/espera'
  //       ) {
  //         return NextResponse.redirect(new URL('/pacientes/espera', req.url));
  //       }
  //       return NextResponse.next(); // Permite o acesso à página de espera
  //     }
  //   } catch (error) {
  //     console.error('Erro na verificação do token do paciente:', error);
  //     return NextResponse.redirect(new URL('/', req.url));
  //   }
  // }
  // // Se o token do hospital existir, permite o acesso às rotas de hospital
  // if (authTokenHospital) {
  //   if (url.pathname.startsWith('/hospital')) {
  //     return NextResponse.next(); // Permite o acesso às rotas de hospital
  //   }
  // }
}

// Definir as rotas que o middleware deve monitorar
export const config = {
  matcher: ['/pacientes/:path*', '/hospital/:path*', '/'],
};
