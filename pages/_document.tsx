import { Html, Head, Main, NextScript } from 'next/document';

export default function Document() {
  return (
    <Html lang='en' className='dark'>
      <Head />
      <body className='bg-white dark:bg-[#1c1e20]'>
        <Main />
        <NextScript />
      </body>
    </Html>
  );
}
