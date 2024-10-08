import { NextRequest, NextResponse } from 'next/server';
import { api } from './lib/axios';

export async function middleware(req: NextRequest) {
  const url = new URL(req.url);
  const authTokenPaciente = req.cookies.get('authTokenPaciente')?.value;
  const authTokenHospital = req.cookies.get('authTokenHospital')?.value;

  if (authTokenPaciente) {
    try {
      const response = await api.post('/token/paciente', {
        token: authTokenPaciente,
      });
      const { paciente } = response.data;

      if (paciente && paciente.Leito) {
        if (url.pathname === '/pacientes/espera') {
          return NextResponse.redirect(new URL('/pacientes', req.url));
        }
        if (url.pathname === '/') {
          return NextResponse.redirect(new URL('/pacientes', req.url));
        }
        if (url.pathname.startsWith('/pacientes')) {
          return NextResponse.next();
        }
      } else {
        if (
          url.pathname.startsWith('/pacientes') &&
          url.pathname !== '/pacientes/espera'
        ) {
          return NextResponse.redirect(new URL('/pacientes/espera', req.url));
        }

        if (
          url.pathname.startsWith('/') &&
          url.pathname !== '/pacientes/espera'
        ) {
          return NextResponse.redirect(new URL('/pacientes/espera', req.url));
        }
        return NextResponse.next();
      }
    } catch (error) {
      console.error('Erro na verificação do token do paciente:', error);
      return NextResponse.redirect(new URL('/', req.url));
    }
  }
  if (authTokenHospital) {
    if (url.pathname.startsWith('/hospital')) {
      return NextResponse.next();
    }
  }
}

export const config = {
  matcher: ['/pacientes/:path*', '/'],
};
