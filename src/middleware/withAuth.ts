import { adminAuth } from "src/services/firebaseAdmin";
import nookies from "nookies";
import { GetServerSideProps, GetServerSidePropsContext, GetServerSidePropsResult } from "next";


export function withAuth(gssp?: GetServerSideProps): GetServerSideProps {
  return async (ctx: GetServerSidePropsContext): Promise<GetServerSidePropsResult<any>> => {
    try {
      const { ['nextauth.token']: token } = nookies.get(ctx);
      const decodedIdToken = await adminAuth.verifyIdToken(token);

      const gsspData = gssp ? await gssp(ctx) : null;

      return {
        props: {
          decodedIdToken,
          ...(gsspData && 'props' in gsspData ? gsspData.props : null)
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