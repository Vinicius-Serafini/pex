import { GetServerSideProps, GetServerSidePropsContext, GetServerSidePropsResult, InferGetServerSidePropsType, NextPage } from "next";
import QuickAccess from "../../../components/buttons/quickAccess";
import Card from "../../../components/cards/baseCard";
import style from './styles.module.css';
import { faUserPlus, faPeopleGroup, faUserGroup } from '@fortawesome/free-solid-svg-icons';
import Tabs from "../../../components/tabs";
import MatchCard from "../../../components/cards/match";
import HistoryCard from "../../../components/cards/history";
import UserCard from "../../../components/cards/user";
import { useRouter } from "next/router";
import { getTeam } from "src/services/teamService";
import { Player, Team, User } from "src/types";
import { withAuth } from "src/lib/middleware/withAuth";
import { CurrentTeamContextProvider } from "src/contexts/CurrentTeamContext";

export const getServerSideProps = withAuth(async (ctx: GetServerSidePropsContext): Promise<{ props: Team } | any> => {
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
      team
    }
  }

});

const TeamIndex: NextPage = ({ team }: InferGetServerSidePropsType<typeof getServerSideProps>) => {
  const router = useRouter();

  const stats = [
    { title: 'Vitórias', value: 5 },
    { title: 'Empates', value: 3 },
    { title: 'Jogos', value: 12 },
    { title: 'Gols', value: 7 }
  ];

  const quickAccesses = [
    { label: 'Adicionar', icon: faUserPlus, onClick: () => console.log('hehehe') },
    { label: 'Escalação', icon: faPeopleGroup, onClick: () => router.push(`${router.asPath}/lineup`) },
    { label: 'Nova Partida', icon: faUserGroup, onClick: () => console.log('hehehe') }
  ]

  return (
    <div>
      <CurrentTeamContextProvider current_team={team}>
        <main>
          <Card className={style.card}>
            <h2>{team.name}</h2>
            <div className={style.stats}>
              {stats.map(({ title, value }, index) => (
                <div className={style.stat} key={index}>
                  <p>{title}</p>
                  <span>{value}</span>
                </div>
              ))}
            </div>
          </Card>
          <div className={style.quickAccesses}>
            {quickAccesses.map(({ label, icon, onClick }, index) => (
              <QuickAccess
                key={index}
                label={label}
                icon={icon}
                onClick={onClick} />
            ))}
          </div>
          <div className={style.body}>
            <Tabs tabs={[
              {
                title: 'Próximos jogos', component: (
                  <div className={style.matchesList}>
                    {Array.from(Array(5).keys()).map((_, index) => (
                      <MatchCard key={index.toString()} />
                    ))}
                  </div>
                )
              },
              {
                title: 'Histórico', component: (
                  <div className={style.list}>
                    {Array.from(Array(5).keys()).map((_, index) => (
                      // <MatchCard />
                      <HistoryCard key={index.toString()} />
                    ))}
                  </div>
                )
              },
              {
                title: 'Jogadores', component: (
                  <div className={style.list}>
                    {team.players.map((user: User, index: number) => (
                      <UserCard
                        user={user}
                        key={index.toString()} />
                    ))}
                  </div>
                )
              }
            ]} />
          </div>
        </main>
      </CurrentTeamContextProvider>
    </div>
  );
}

export default TeamIndex;