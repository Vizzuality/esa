import { Inter as SansFont } from 'next/font/google';
import localFont from 'next/font/local';

export const sans = SansFont({
  subsets: ['latin'],
  variable: '--font-inter',
  fallback: ['system-ui', 'Helvetica Neue', 'Helvetica', 'Arial'],
  weight: ['400'],
  display: 'block',
});

export const notesESA = localFont({
  src: [
    {
      path: './NotesEsaBol.otf',
      weight: 'bold',
      style: 'normal',
    },
    {
      path: './NotesEsaBolIta.otf',
      weight: 'bold',
      style: 'italic',
    },
    {
      path: './NotesEsaReg.otf',
      weight: 'normal',
      style: 'normal',
    },
    {
      path: './NotesEsaRegIta.otf',
      weight: 'normal',
      style: 'italic',
    },
  ],
  display: 'block',
  variable: '--font-esa-notes',
});
