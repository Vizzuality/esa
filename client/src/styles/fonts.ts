import { Open_Sans, Inter } from 'next/font/google';
import localFont from 'next/font/local';

export const openSans = Open_Sans({
  subsets: ['latin'],
  variable: '--font-open-sans',
  fallback: ['system-ui', 'Helvetica Neue', 'Helvetica', 'Arial'],
  weight: ['300', '400'],
  style: ['italic', 'normal'],
  display: 'block',
});

export const inter = Inter({
  subsets: ['latin'],
  variable: '--font-inter',
  fallback: ['system-ui', 'Helvetica Neue', 'Helvetica', 'Arial'],
  weight: ['300'],
  style: ['normal'],
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
