import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { GetServerSidePropsContext, InferGetServerSidePropsType, NextPage } from "next";
import Image from "next/image";
import Card from "../../../components/cards/baseCard";
import UserCard from "../../../components/cards/user";
import Chip from "../../../components/chips";
import Tabs from "../../../components/tabs";
import style from './styles.module.css';
import { faClock, faMapMarkedAlt, faAngleRight, faTrophy, faShareNodes, faPlus } from '@fortawesome/free-solid-svg-icons';
import BaseButton from "../../../components/buttons/baseButton";
import FormationCard from "../../../components/cards/formation";
import GoalsCard from "../../../components/cards/goals";
import { useAuth } from "src/hooks/useAuth";
import { Goal, Invite, Lineup, Match, Place, Team, User } from "src/types";
import { withAuth } from "src/middleware/withAuth";
import { acceptMatch, getGoal, getMatch, rejectMatch } from "src/services/matchService";
import { MatchContextProvider } from "src/contexts/MatchContext";
import { useMatch } from "src/hooks/useMatch";
import { DAYS_OF_THE_WEEK, MONTHS } from "src/constants/time";
import { addMilisecondsToDate, copyToClipboard, isObjectEmpty } from "src/utils";
import { Dispatch, SetStateAction, useEffect, useState } from "react";
import { getTeam } from "src/services/teamService";
import { buildLineup } from "src/services/lineupService";
import useClientRedirect from "src/hooks/useClientRedirect";
import toast from "react-hot-toast";
import { useRouter } from "next/router";
import { generateMatchInvite, getMatchInvite, isInviteValid, updateMatchInvite } from "src/services/inviteService";
import { TeamInviteModal } from "src/components/modals/teamInviteModal";
import QuickAccess from "src/components/buttons/quickAccess";
import AddGoalModal from "src/components/modals/addGoalModal";

const InfoTab = () => {
  const { match, owner } = useMatch();

  const formatDate = (date: Date) => {
    // @ts-ignore: Unreachable code error
    return `${date.getDate()} de ${MONTHS[date.getMonth() + 1]}, ${DAYS_OF_THE_WEEK[date.getDay() + 1]}`
  }

  const formatHours = (date: Date, duration: number) => {
    const end = addMilisecondsToDate(date, duration * 60 * 1000);

    return `${date.getHours()}h${date.getMinutes()} - ${end.getHours()}h${end.getMinutes()}`
  }

  const formatAddress = (place: Place) => {
    return `${place.address.city} - ${place.address.state.initials}, ${place.address.street}, ${place.address.suburb}, ${place.address.postcode}`
  }

  const placeOnGoogleMaps = (place: Place) => {
    return `https://www.google.com.br/maps/search/?api=1&query=${place.coordinates.lat},${place.coordinates.lon}`
  }

  const confirmedPlayers = match.confirmed.filter(confirmed => !confirmed || confirmed.status != "REJECTED");

  const totalPlayers = () => {
    if (!match || !owner) {
      return
    }

    const ownerLineup = buildLineup(owner.lineup);
    const invitedTeamLineup = match.invitedTeam ? buildLineup(match.invitedTeam.lineup) : [];

    const totalPlayers = [...ownerLineup.flat(), ...invitedTeamLineup.flat()].reduce((acc, p) => {
      if (!p || isObjectEmpty(p.first)) {
        return acc;
      }

      return acc + p.substitutes.length + 1;
    }, 0);

    return totalPlayers;
  }

  return (
    <>
      <Card className={style.dateTimeCard}>
        <div className={style.dateTimeCardBody}>
          <FontAwesomeIcon
            icon={faClock}
            className={style.icon} />
          <div className={style.dateTime}>
            <h4 className={style.date}>
              {formatDate(match.date)}
            </h4>
            <p className={style.time}>
              {formatHours(match.date, match.duration)}
            </p>
          </div>
        </div>
      </Card>

      <Card className={style.locationCard}>
        <a
          className={style.locationCardBody}
          href={placeOnGoogleMaps(match.place)}
          target="_blank"
          rel="noreferrer">
          <span className={style.locationWrapper}>
            <FontAwesomeIcon
              icon={faMapMarkedAlt}
              className={style.icon} />
            <div className={style.location}>
              <h4 className={style.district}>
                {match.place.name}
              </h4>
              <p className={style.street}>
                {formatAddress(match.place)}
              </p>
            </div>
          </span>
          <div className={style.locationIconWrapper}>
            <FontAwesomeIcon
              icon={faAngleRight} />
          </div>
        </a>
      </Card>

      <div className={style.players}>
        <h2 className={style.playersTitle}>
          Confirmados <span>{confirmedPlayers.length} / {totalPlayers()}</span>
        </h2>
        {/* <div className={style.playersFilter}>
          {['Todos', 'Time 1', 'Time 2'].map((label, idx) => (
            <Chip key={idx}>
              {label}
            </Chip>
          ))}
        </div> */}
        <div className={style.playersList}>
          {confirmedPlayers.map(p => (
            <UserCard
              user={p.user}
              key={p.user.uid} />
          ))}
        </div>
      </div>
    </>)
}

const LineupTab = () => {
  const { match, owner } = useMatch();

  const [lineup, setLineup] = useState<Lineup>();
  const [selectedTeam, setSelectedTeam] = useState<Team>(owner);

  useEffect(() => {
    if (selectedTeam) {
      setLineup(buildLineup(selectedTeam.lineup));
    }
  }, [selectedTeam])

  return (
    <div className={style.lineupTab}>
      <div className={style.lineupTeamBtn}>
        <button
          onClick={() => setSelectedTeam(owner)}
          className={selectedTeam.uid == owner.uid ? style.active : ''}>
          {owner.name}
        </button>
        {match.invitedTeam ? (
          <button
            onClick={() => setSelectedTeam(match.invitedTeam as Team)}
            className={selectedTeam.uid == match.invitedTeam.uid ? style.active : ''}>
            {match.invitedTeam.name}
          </button>
        ) : (
          <button>
            A definir
          </button>
        )}
      </div>
      {lineup && (
        <FormationCard lineup={lineup} />
      )}
      {/*  */}
    </div>)
}

const ResultTab = () => {

  const { goals, owner, match } = useMatch();

  const goalResults = goals.reduce((acc: Object, goal: Goal) => {
    const body = acc;

    // @ts-ignore: Unreachable code error
    if (body[goal.team.uid]) {
      // @ts-ignore: Unreachable code error
      body[goal.team.uid].push(goal);
    }

    // @ts-ignore: Unreachable code error
    body[goal.team.uid] = [goal];

    return body;

    // @ts-ignore: Unreachable code error
  }, { [owner.uid]: [], [match.invitedTeam.uid]: [], });

  const teams = (goals && owner && match) ? [
    {
      name: owner.name,
      // @ts-ignore: Unreachable code error
      goals: goalResults[owner.uid]?.length,
      // @ts-ignore: Unreachable code error 
      winner: goalResults[owner.uid]?.length > goalResults[match.invitedTeam.uid]?.length
    },
    {
      name: match.invitedTeam?.name,
      // @ts-ignore: Unreachable code error
      goals: goalResults[match.invitedTeam.uid]?.length,
      // @ts-ignore: Unreachable code error
      winner: goalResults[owner.uid]?.length < goalResults[match.invitedTeam.uid]?.length
    }
  ] : [];

  return (
    <div className={style.resultTab}>
      <Card className={style.winnerCard}>
        {teams.map((team, index) => (
          <div
            key={index}
            className={[style.team, (team.winner ? style.winner : '')].join(" ")}>
            {/* <FontAwesomeIcon icon={faTrophy} className={style.winnerIcon} /> */}
            <h2 className={style.teamName}>{team.winner && <span>🏆</span>} {team.name}</h2>
            <h2>{team.goals}</h2>
          </div>
        ))}
      </Card>

      {/* <BaseButton className={style.statsBtn}>
      <h2>
        Estatísticas completas
      </h2>
    </BaseButton> */}
      <Tabs tabs={[
        { title: 'Gols', component: <GoalsTab /> },
      ]} />

    </div>
  )
}

const GoalsTab = () => {
  const [isGoalsModalOpen, setIsGoalsModalOpen] = useState<boolean>(false);

  const { goals, setGoals } = useMatch();

  const closeGoalsModal = async (goal_id: string) => {
    if (goal_id) {
      const goal = await getGoal(goal_id);

      setGoals([...goals, goal]);
    }

    setIsGoalsModalOpen(false);
  }

  const filteredGoals = goals ? goals.reduce((acc: Array<any>, goal: Goal) => {
    const body = [...acc];

    const goalIdx = body.findIndex((_goal: Goal) => (_goal.user.uid == goal.user.uid && _goal.team.uid == goal.team.uid));

    if (goalIdx != -1) {
      body[goalIdx].quantity++

      return body;
    }

    body.push({
      ...goal,
      quantity: 1
    });

    return body
  }, []) : [];

  return (
    <>
      <div className={style.goals}>
        <button
          className={style.addBtn}
          onClick={() => setIsGoalsModalOpen(true)}>
          Adicionar Gol
        </button>
        <div className={style.goalsList}>
          {filteredGoals.map((goal, index) => (
            <GoalsCard
              user={goal.user}
              team={goal.team}
              quantity={goal.quantity}
              key={index}
            />
          ))}
        </div>
      </div>
      <AddGoalModal
        is_opened={isGoalsModalOpen}
        close={closeGoalsModal}
      />
    </>
  )
}

export const getServerSideProps = withAuth(async (ctx: GetServerSidePropsContext) => {
  try {
    const match_id = ctx.query.id as string;

    const match = await getMatch(match_id);

    if (!match) {
      throw new Error("Match doesn't exists");
    }

    const invite_id = ctx.query?.invite;

    const invite = invite_id ? await getMatchInvite(match_id, invite_id as string) : null;

    if (invite && !isInviteValid(invite)) {
      ctx.res.writeHead(302, { Location: '/' });
      ctx.res.end();
    }

    return {
      props: {
        match: JSON.parse(JSON.stringify(match)) as Match,
        ...(invite && !match.invitedTeam ? { invite: JSON.parse(JSON.stringify(invite)) as Invite } : null)
      }
    }

  } catch (e) {
    ctx.res.writeHead(302, { Location: '/' });
    ctx.res.end();

    return {
      redirect: {
        destination: '/',
        permanent: false
      },
      props: {}
    };
  }
});

const MatchPage: NextPage = ({ match, invite }: InferGetServerSidePropsType<typeof getServerSideProps>) => {
  useClientRedirect(match == null);

  const { user } = useAuth();

  const router = useRouter();

  const [isInviteModalOpen, setIsInviteModalOpen] = useState<boolean>(false);

  const [isInviteOpen, setIsInviteOpen] = useState<boolean>(false);

  const confirmedPlayers = match.confirmed.filter(
    (confirmed: any) => !confirmed || confirmed.status != "REJECTED"
  );

  useEffect(() => {
    const owner = match.owner as Team;

    if (user && (owner.owner != user?.uid && !confirmedPlayers.some((c: any) => c.user.uid == user?.uid))) {
      setIsInviteOpen(true);
    }
  }, [match, user]);

  useEffect(() => {
    if (!user) {
      return;
    }

    if (invite
      && isInviteValid(invite)
      && !match.invitedTeam
      && match.owner.owner != user?.uid) {
      setIsInviteModalOpen(true);
    }
  }, [invite, user])

  const createInvite = async () => {
    const invite_id = await generateMatchInvite(match.uid);

    const invite_link = `${process.env.NEXT_PUBLIC_APP_URL}/match/${match.uid}?invite=${invite_id}`

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

  const handleAcceptMatch = async (e: React.MouseEvent<HTMLElement>) => {
    e.stopPropagation();

    match = await acceptMatch(match, user as User) as Match;

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

    setIsInviteOpen(false);
  }

  const handleRejectMatch = async (e: React.MouseEvent<HTMLElement>) => {
    e.stopPropagation();

    match = await rejectMatch(match, user as User) as Match;

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

    router.replace("/");
  }

  const tabs = [
    { title: 'Info', component: <InfoTab /> },
    { title: 'Escalação', component: <LineupTab /> },
    // @ts-ignore: Unreachable code error
    ...(match.invitedTeam ? [{ title: 'Resultado', component: <ResultTab /> }] : []),
  ];

  return (
    <>
      {match && (
        <MatchContextProvider match={match}>
          <div>
            <main>
              <div
                className={style.header}
                style={{ backgroundImage: `url(${match.imgUrl})`, backgroundSize: 'cover' }}>
                <div className={style.colorOverlay} />
                <div className={style.headerBody}>
                  <h2>{match.name}</h2>
                </div>
              </div>

              {(!match.invitedTeam && match.owner.owner == user?.uid) && (
                <div className={style.adminOptions}>
                  <QuickAccess
                    label={'Convidar'}
                    icon={faShareNodes}
                    onClick={createInvite}
                  />
                </div>
              )}

              <div className={style.tabs}>
                <Tabs tabs={tabs} />
              </div>
            </main>
            {isInviteOpen && (
              <div className={style.fabAcceptMatch}>
                <button
                  onClick={handleAcceptMatch}
                  className={style.accept}>
                  <h3>
                    To dentro!
                  </h3>
                </button>
                <button
                  onClick={handleRejectMatch}
                  className={style.reject}>
                  <h3>
                    To fora
                  </h3>
                </button>
              </div>
            )}
          </div>
          <TeamInviteModal
            is_opened={isInviteModalOpen}
            close={() => setIsInviteModalOpen(false)}
            invite={invite}
          />
        </MatchContextProvider>
      )}
    </>
  );
}

export default MatchPage;