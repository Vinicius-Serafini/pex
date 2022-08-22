import type { GetServerSidePropsContext, NextPage } from 'next';
import Card from '../../components/cards/baseCard';
import { useAuth } from '../../hooks/useAuth';
import style from './styles.module.css';
import Image from 'next/image';
import { useEffect } from 'react';
import { useRouter } from 'next/router';
import nookies from "nookies";
import { adminAuth } from 'src/services/firebaseAdmin';

export const getServerSideProps = async (ctx: GetServerSidePropsContext) => {
  try {
    const { ['nextauth.token']: token } = nookies.get(ctx);
    const decodedIdToken = await adminAuth.verifyIdToken(token);

    ctx.res.writeHead(302, { Location: '/' });
    ctx.res.end();

  } catch (err) {
    return { props: {} } as never;
  }
}

const Login: NextPage = () => {
  const { user, signInWithGoogle } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (user) {
      router.replace("/")
    }
  }, [user])

  const handleLogin = async () => {
    if (!user) {
      await signInWithGoogle();
    }
  }

  return (
    <div
      className={style.body}
      style={{
        backgroundImage: `url('https://cdn.pixabay.com/photo/2014/10/14/20/24/ball-488718_960_720.jpg')`
      }}>
      <div className={style.colorOverlay} />
      {/* <Head>
        <title>Create Next App</title>
        <meta name="description" content="Generated by create next app" />
        <link rel="icon" href="/favicon.ico" />
      </Head> */}
      <Card className={style.card}>
        <div className={style.logoWrapper}>
          <Image
            src="/svg/Logo_flat.svg"
            height={75}
            width={150}
          />
        </div>
        <div className={style.login}>
          <hr className={style.line} />
          <p>Entrar</p>
          <hr className={style.line} />
        </div>
        <button
          className={style.googleBtn}
          onClick={handleLogin}>
          <span className={style.icon}>
            <Image
              src="/svg/Google_logo.svg"
              height={30}
              width={30} />
          </span>
          <h3>
            Faça login com sua conta google
          </h3>
        </button>
      </Card>

    </div>
  )
}

export default Login;
