import { GetServerSideProps, GetServerSidePropsContext, GetServerSidePropsResult } from "next";
import { getTeam } from "src/services/teamService";
import nookies from "nookies";

export function withTeam(gssp?: GetServerSideProps): GetServerSideProps {
  return async (ctx: GetServerSidePropsContext): Promise<GetServerSidePropsResult<any>> => {
    try {
      const team = await getTeam(ctx.query.id as string);

      if (!team) {
        throw new Error("Team does't exists.");
      }

      const gsspData = gssp ? await gssp(ctx) : null;

      return {
        props: {
          team,
          ...(gsspData && 'props' in gsspData ? gsspData.props : null)
        }
      }

    } catch (err) {
      ctx.res.writeHead(302, { Location: '/teams' });
      ctx.res.end();
      console.log(err)

      return {
        redirect: {
          destination: '/teams',
          permanent: false
        }
      };
    }
  };
};
