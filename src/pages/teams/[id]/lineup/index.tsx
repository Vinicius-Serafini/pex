import { GetServerSidePropsContext, InferGetServerSidePropsType, NextPage } from "next";
import Image from "next/image";
import { CurrentTeamContextProvider } from "src/contexts/CurrentTeamContext";
import { useCurrentTeam } from "src/hooks/useCurrentTeam";
import useLineup from "src/hooks/useLineup";
import { withAuth } from "src/lib/middleware/withAuth";
import { buildLineup } from "src/services/lineupService";
import { getTeam, getTeamPlayers } from "src/services/teamService";
import { User } from "src/types";
import { isObjectEmpty } from "src/utils";
import FormationCard from "../../../../components/cards/formation";
import UserCard from "../../../../components/cards/user";
import style from './styles.module.css';
import { POSITIONS } from "../../../../constants/lineups";

export const getServerSideProps = withAuth(async (ctx: GetServerSidePropsContext): Promise<{ props: any } | any> => {
  const team = await getTeam(ctx.query.id as string);

  if (!team) {
    return {
      redirect: {
        destination: '/teams',
        permanent: false
      }
    };
  }

  return {
    props: {
      team,
    }
  }
});


const SubstitutesList = () => {

  // added this component because the need of the reactice lineup state provided 
  // by the hook useCurrentTeam(), cannot call this from the component providing
  // this data, maybe is a bad idea, dunno though
  const { lineup } = useCurrentTeam();

  const positions = lineup ? lineup.get().flat().filter((column: any) => {
    if (!column) {
      return false;
    }

    if (isObjectEmpty(column.first)) {
      return false;
    }

    return true;
  }) : [];

  const positionName = (initials: string) => {
    // @ts-ignore: Unreachable code error
    return Object.values(POSITIONS).find(position => position[initials])[initials];
  }

  return (
    <div className={style.substitutes}>
      <h2 className={style.title}>
        Reservas
      </h2>
      <div className={style.substitutesList}>
        {positions.map((position: any) => (
          <div key={Math.random()}>
            {position.substitutes?.length > 0 && (
              <div
                key={Math.random()}>
                <h3>{positionName(position.position)}</h3>
                <div className={style.substitutesContent}>
                  {position.substitutes?.length > 0 ? (
                    <>
                      {position.substitutes.map((player: User, index: number) => (
                        <UserCard
                          user={player}
                          key={player.uid}
                        />
                      ))}
                    </>
                  ) : (
                    <span>Sem jogadores reservas</span>
                  )}
                </div>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  )
}

const Lineup: NextPage = ({ team }: InferGetServerSidePropsType<typeof getServerSideProps>) => {

  return (
    <CurrentTeamContextProvider current_team={team}>
      <div>
        <main className={style.body}>
          <div className={style.lineup}>
            <div className={style.formation}>
              {/* <h3>Esquema tático</h3>
              <select
                className={style.formationSelect}
                name="formation"
                id="formation">
                <option value="1" selected>4-4-2</option>
              </select> */}
            </div>
            <div>
              <h2>Escalação</h2>
              <FormationCard />
            </div>
          </div>
          <SubstitutesList />
        </main>
      </div>
    </CurrentTeamContextProvider>
  );
}

export default Lineup;