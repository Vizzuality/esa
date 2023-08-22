'use client';

import { Inter as SansFont } from 'next/font/google';
import localFont from 'next/font/local';
import { useServerInsertedHTML } from 'next/navigation';

const sans = SansFont({
  subsets: ['latin'],
  variable: '--font-inter',
  fallback: ['system-ui', 'Helvetica Neue', 'Helvetica', 'Arial'],
  weight: ['400'],
  display: 'swap',
});

const esaNotes = localFont({
  src: [
    {
      path: '../../../public/fonts/NotesEsaBol.otf',
      weight: 'bold',
      style: 'normal',
    },
    {
      path: '../../../public/fonts/NotesEsaBolIta.otf',
      weight: 'bold',
      style: 'italic',
    },
    {
      path: '../../../public/fonts/NotesEsaReg.otf',
      weight: 'normal',
      style: 'normal',
    },
    {
      path: '../../../public/fonts/NotesEsaRegIta.otf',
      weight: 'normal',
      style: 'italic',
    },
  ],
  display: 'swap',
  variable: '--font-esa-notes',
});

function Fonts() {
  useServerInsertedHTML(() => {
    return (
      <style
        dangerouslySetInnerHTML={{
          __html: `
          :root {
            --font-inter: ${sans.style.fontFamily};
            --font-esa-notes: ${esaNotes.style.fontFamily};
          }
        `,
        }}
      />
    );
  });

  return null;
}

export default Fonts;
