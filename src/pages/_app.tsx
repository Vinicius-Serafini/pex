import '../styles/globals.css'
import type { AppProps } from 'next/app'
import { AuthContextProvider } from '../contexts/AuthContext'
import { Header } from 'src/components/header';
import { useRouter } from 'next/router';

const PAGES_WHO_NOT_SHOW_HEADER = ["/login"]

function MyApp({ Component, pageProps }: AppProps) {
  const router = useRouter();

  return (
    <AuthContextProvider>
      {PAGES_WHO_NOT_SHOW_HEADER.some(
        (url) => !router.pathname.includes(url)
      ) ? <Header /> : null}
      <Component {...pageProps} />
    </AuthContextProvider>
  );
}

export default MyApp
