import { GetServerSidePropsContext, InferGetServerSidePropsType, NextPage } from "next";
import { withAuth } from "src/lib/middleware/withAuth";

export const getServerSideProps = withAuth();

export const withAuthHOC = (Component: NextPage) => {
  return function WithAuthHoc(props: InferGetServerSidePropsType<typeof getServerSideProps>) {
    return <Component {...props} />
  }
}

