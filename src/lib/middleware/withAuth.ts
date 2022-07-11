import { adminAuth } from "src/services/firebaseAdmin";
import nookies from "nookies";
import { GetServerSideProps, GetServerSidePropsContext } from "next";

export function withAuth(gssp?: GetServerSideProps) {
  return async (ctx: GetServerSidePropsContext) => {
    try {
      const { ['nextauth.token']: token } = nookies.get(ctx);
      const decodedIdToken = await adminAuth.verifyIdToken(token);

      if (gssp) {
        return gssp(ctx);
      }

      return {
        props: {
          decodedIdToken
        }
      }
    } catch (err) {
      ctx.res.writeHead(302, { Location: '/login' });
      ctx.res.end();

      return {
        redirect: {
          destination: '/login',
          permanent: false
        }
      };
    }
  };
};