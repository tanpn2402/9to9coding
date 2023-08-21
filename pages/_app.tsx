import apolloClient from '@/lib/apollo';
import { UserProvider } from '@auth0/nextjs-auth0/client';
import { ApolloProvider } from '@apollo/client';
import NextApp, { AppContext, AppProps } from 'next/app';
import { MantineProvider, ColorScheme, ColorSchemeProvider } from '@mantine/core';
import { defaultCache } from '@/emotion-cache';
import { useState } from 'react';
import { getCookie, setCookie } from 'cookies-next';

// globals css
import '@/styles/globals.css';

const COOKIE_COLOR_SCHEMA = 'color-schema';

export default function App(props: AppProps & { colorScheme: ColorScheme }) {
  const { Component, pageProps } = props;
  const [colorScheme, setColorScheme] = useState<ColorScheme>(props.colorScheme);

  const toggleColorScheme = (value?: ColorScheme) => {
    const nextColorScheme = value || (colorScheme === 'dark' ? 'light' : 'dark');
    setColorScheme(nextColorScheme);
    setCookie(COOKIE_COLOR_SCHEMA, nextColorScheme, { maxAge: 60 * 60 * 24 * 30 });
  };

  return (
    <ColorSchemeProvider colorScheme={colorScheme} toggleColorScheme={toggleColorScheme}>
      <MantineProvider
        withGlobalStyles
        withNormalizeCSS
        emotionCache={defaultCache}
        theme={{
          colorScheme
        }}>
        <UserProvider>
          <ApolloProvider client={apolloClient}>
            <Component {...pageProps} />
          </ApolloProvider>
        </UserProvider>
      </MantineProvider>
    </ColorSchemeProvider>
  );
}

App.getInitialProps = async (appContext: AppContext) => {
  const appProps = await NextApp.getInitialProps(appContext);
  return {
    ...appProps,
    colorScheme: getCookie(COOKIE_COLOR_SCHEMA, appContext.ctx) || 'dark'
  };
};
