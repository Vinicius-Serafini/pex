import '../styles/globals.css'
import type { AppProps } from 'next/app'
import { AuthContextProvider } from '../contexts/AuthContext'
import { Header } from 'src/components/header';
import { useRouter } from 'next/router';
import { Toaster } from 'react-hot-toast';

const PAGES_THAT_NOT_SHOW_HEADER = ["/login"]

function MyApp({ Component, pageProps }: AppProps) {
  const router = useRouter();

  return (
    <AuthContextProvider>
      {PAGES_THAT_NOT_SHOW_HEADER.some(
        (url) => !router.pathname.includes(url)
      ) ? <Header /> : null}
      <Component {...pageProps} />
      <Toaster
        position="bottom-center"
        reverseOrder={false}
      />
    </AuthContextProvider>
  );
}

export default MyApp
