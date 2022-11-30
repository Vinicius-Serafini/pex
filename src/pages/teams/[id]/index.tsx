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
import { Match, Player, RawLineup, Team, User } from "src/types";
import { withAuth } from "src/middleware/withAuth";
import { CurrentTeamContextProvider } from "src/contexts/CurrentTeamContext";
import { withTeam } from "src/middleware/withTeam";
import { generateTeamInvite, getTeamInvite, isInviteValid, updateTeamInvite } from "src/services/inviteService";
import toast from "react-hot-toast";
import { copyToClipboard } from "src/utils";
import { useAuth } from "src/hooks/useAuth";
import { useEffect, useState } from "react";
import FormationCard from "src/components/cards/formation";
import { buildLineup } from "src/services/lineupService";
import CreateMatchModal from "src/components/modals/createMatchModal";
import { getHistoryMatchesByuser, getMatchesByTeam } from "src/services/matchService";
import { useCurrentTeam } from "src/hooks/useCurrentTeam";

export const getServerSideProps = withAuth(withTeam(async (ctx: GetServerSidePropsContext) => {
  const team_id = ctx.query.id as string;

  const invite_id = ctx.query?.invite;

  const invite = invite_id ? await getTeamInvite(team_id, invite_id as string) : null;

  if (invite && !isInviteValid(invite)) {
    ctx.res.writeHead(302, { Location: '/teams' });
    ctx.res.end();
  }

  return {
    props: {
      ...(invite ? { invite: JSON.parse(JSON.stringify(invite)) } : null)
    }
  }
}));

const TeamIndex: NextPage = ({ team, invite }: InferGetServerSidePropsType<typeof getServerSideProps>) => {
  const router = useRouter();
  const { user } = useAuth();
  const [showInvite, setShowInvite] = useState<boolean>(false);

  const [showNewMatchModal, setShowNewMatchModal] = useState<boolean>(false);
  const [matches, setMatches] = useState<Array<Match>>([]);
  const [historyMatches, setHistoryMatches] = useState<Array<Match>>([]);

  useEffect(() => {
    if (user
      && invite
      && !(team.players.find((p: User) => p.uid == user?.uid))) {
      setShowInvite(true);
    }

  }, [user]);


  const createInvite = async () => {
    const invite_id = await generateTeamInvite(team.uid);

    const invite_link = `${process.env.NEXT_PUBLIC_APP_URL}/teams/${team.uid}?invite=${invite_id}`

    const success = copyToClipboard(invite_link);

    if (!success) {
      return;
    }

    toast('Convite copiado!',
      {
        icon: '📋',
        style: {
          borderRadius: '10px',
          background: '#333',
          color: '#fff',
        },
      }
    );
  }

  const acceptInvite = async () => {
    await updateTeamInvite(team, invite, "ACCEPTED", user as User);

    toast('Convite aceito!',
      {
        icon: '✅',
        style: {
          borderRadius: '10px',
          background: '#333',
          color: '#fff',
        },
      }
    );

    setShowInvite(false);

    router.replace(`/teams/${team.uid}`)
  }

  const rejectInvite = async () => {
    await updateTeamInvite(team, invite, "REJECTED", user as User);

    toast('Convite recusado!',
      {
        icon: '❌',
        style: {
          borderRadius: '10px',
          background: '#333',
          color: '#fff',
        },
      }
    );

    setShowInvite(false);

    router.push("/teams");
  }

  const stats = [
    { title: 'Vitórias', value: 5 },
    { title: 'Empates', value: 3 },
    { title: 'Jogos', value: 12 },
    { title: 'Gols', value: 7 }
  ];

  const quickAccesses = [
    { label: 'Adicionar', icon: faUserPlus, onClick: createInvite },
    { label: 'Escalação', icon: faPeopleGroup, onClick: () => router.push(`${router.asPath}/lineup`) },
    { label: 'Nova Partida', icon: faUserGroup, onClick: () => setShowNewMatchModal(true) }
  ];

  const getMatches = async () => {
    const m = await getMatchesByTeam(team);

    setMatches(m);
  }

  const getHistoryMatches = async () => {
    const _matches = await getHistoryMatchesByuser(user as User);

    setHistoryMatches(_matches);
  }

  useEffect(() => {
    if (user && team) {
      if (matches.length == 0) {
        getMatches();
      }

      if (historyMatches.length == 0) {
        getHistoryMatches();
      }
    }
  }, [user, team]);

  if (!team) {
    return null;
  }

  return (
    <div>
      <CurrentTeamContextProvider current_team={team}>
        <main className={style.main}>
          <Card className={style.card}>
            <h2>{team.name}</h2>
            <div className={style.stats}>
              {/* {stats.map(({ title, value }, index) => (
                <div className={style.stat} key={index}>
                  <p>{title}</p>
                  <span>{value}</span>
                </div>
              ))} */}
            </div>
          </Card>
          {team.owner == user?.uid && (
            <div className={style.quickAccesses}>
              {quickAccesses.map(({ label, icon, onClick }, index) => (
                <QuickAccess
                  key={index}
                  label={label}
                  icon={icon}
                  onClick={onClick} />
              ))}
            </div>
          )}
          <div className={style.body}>
            <Tabs tabs={[
              {
                title: 'Próximos jogos', component: <MatchesTab matches={matches} />
              },
              {
                title: 'Histórico', component: (
                  <div className={style.list}>
                    {historyMatches.map((match, index) => (
                      <HistoryCard
                        match={match}
                        key={index.toString()}
                      />
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
              },
              {
                title: 'Escalação', component: (
                  <div className={style.lineupWrapper}>
                    <FormationCard lineup={buildLineup(team.lineup as RawLineup)} />
                  </div>
                )
              }
            ]} />
          </div>
          {(invite && showInvite) && (
            <div className={style.floatingInviteBtn}>
              <button className={style.acceptBtn} onClick={acceptInvite}>Aceitar convite</button>
              <button className={style.rejectBtn} onClick={rejectInvite}>Recusar</button>
            </div>
          )}
        </main>
        <CreateMatchModal closeModal={() => setShowNewMatchModal(false)} isOpened={showNewMatchModal} />
      </CurrentTeamContextProvider>
    </div>
  );
}

type MatchesTabProps = {
  matches: Array<Match>
}
const MatchesTab = ({ matches }: MatchesTabProps) => {

  const filteredMatches = matches.filter(
    m => m.confirmed.length == 0 || m.confirmed.some(
      confirmed => !confirmed || confirmed.status != "REJECTED")
  );

  return (
    <div className={style.matchesList}>
      {filteredMatches.map(match => (
        <MatchCard
          key={match.uid}
          match={match} />
      ))}
    </div>
  );
}

export default TeamIndex;