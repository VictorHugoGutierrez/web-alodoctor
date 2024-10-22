import { NextRequest, NextResponse } from 'next/server';
import { api } from './lib/axios';

async function verifyPacienteToken(authTokenPaciente: string) {
  const response = await api.post('/token/paciente', {
    token: authTokenPaciente,
  });
  return response.data.paciente;
}

async function verifyHospitalToken(authTokenHospital: string) {
  const response = await api.post('/token/hospital', {
    token: authTokenHospital,
  });
  return response.data.hospital;
}

export async function middleware(req: NextRequest) {
  const url = new URL(req.url);
  const authTokenPaciente = req.cookies.get('authTokenPaciente')?.value;
  const authTokenHospital = req.cookies.get('authTokenHospital')?.value;

  if (authTokenPaciente) {
    try {
      const paciente = await verifyPacienteToken(authTokenPaciente);

      if (paciente && paciente.Leito) {
        if (url.pathname === '/pacientes/espera' || url.pathname === '/') {
          return NextResponse.redirect(new URL('/pacientes', req.url));
        }
      } else {
        if (url.pathname === '/pacientes/espera') {
          return NextResponse.next();
        }

        if (url.pathname.startsWith('/pacientes')) {
          return NextResponse.redirect(new URL('/pacientes/espera', req.url));
        }
      }
    } catch (error) {
      console.error('Erro na verificação do token do paciente:', error);
      return NextResponse.redirect(new URL('/', req.url));
    }
  } else if (authTokenHospital) {
    try {
      const hospital = await verifyHospitalToken(authTokenHospital);
      if (!hospital) {
        return NextResponse.redirect(new URL('/', req.url));
      }

      if (!url.pathname.startsWith('/hospital')) {
        return NextResponse.redirect(new URL('/hospital', req.url));
      }
    } catch (error) {
      console.error('Erro na verificação do token do hospital:', error);
      return NextResponse.redirect(new URL('/', req.url));
    }
  } else {
    if (
      url.pathname.startsWith('/hospital') ||
      url.pathname.startsWith('/pacientes')
    ) {
      return NextResponse.redirect(new URL('/', req.url));
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/pacientes/:path*', '/hospital/:path*', '/'],
};
