import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { GetServerSidePropsContext, InferGetServerSidePropsType, NextPage } from "next";
import Image from "next/image";
import Card from "../../../components/cards/baseCard";
import UserCard from "../../../components/cards/user";
import Chip from "../../../components/chips";
import Tabs from "../../../components/tabs";
import style from './styles.module.css';
import { faClock, faMapMarkedAlt, faAngleRight, faTrophy } from '@fortawesome/free-solid-svg-icons';
import BaseButton from "../../../components/buttons/baseButton";
import FormationCard from "../../../components/cards/formation";
import GoalsCard from "../../../components/cards/goals";
import { useAuth } from "src/hooks/useAuth";
import { Lineup, Match, Place, User } from "src/types";
import { withAuth } from "src/middleware/withAuth";
import { getMatch } from "src/services/matchService";
import { MatchContextProvider } from "src/contexts/MatchContext";
import { useMatch } from "src/hooks/useMatch";
import { DAYS_OF_THE_WEEK, MONTHS } from "src/constants/time";
import { addMilisecondsToDate } from "src/utils";
import { Dispatch, SetStateAction, useEffect, useState } from "react";
import { getTeam } from "src/services/teamService";
import { buildLineup } from "src/services/lineupService";

const InfoTab = () => {
  const { match } = useMatch();

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
          target="_blank">
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
          Confirmados <span>5 / 22</span>
        </h2>
        <div className={style.playersFilter}>
          {['Todos', 'Time 1', 'Time 2'].map((label, idx) => (
            <Chip key={idx}>
              {label}
            </Chip>
          ))}
        </div>
        <div className={style.playersList}>
          {/* {Array.from(Array(5).keys()).map((_, idx) => (
            <UserCard key={idx} />
          ))} */}
        </div>
      </div>
    </>)
}

const LineupTab = () => {
  const { owner } = useMatch();

  const [lineup, setLineup] = useState<Lineup>()

  useEffect(() => {
    if (owner) {
      setLineup(buildLineup(owner.lineup));
    }
  }, [owner])

  return (
    <div className={style.lineupTab}>
      <div className={style.lineupTeamBtn}>
        <button className={style.active}>
          {owner.name}
        </button>
        <button>
          Time 2
        </button>
      </div>
      {lineup && (
        <FormationCard lineup={lineup} />
      )}
      {/*  */}
    </div>)
}

const ResultTab = () => (
  <div className={style.resultTab}>
    <Card className={style.winnerCard}>
      {[{ name: 'Team 1', goals: 3, winner: true }, { name: 'Team 2', goals: 1, winner: false }].map((team, index) => (
        <div className={[style.team, (team.winner ? style.winner : '')].join(" ")}>
          {/* <FontAwesomeIcon icon={faTrophy} className={style.winnerIcon} /> */}
          <h2 className={style.teamName}>{team.winner && <span>🏆</span>} {team.name}</h2>
          <h2>{team.goals}</h2>
        </div>
      ))}
    </Card>

    <BaseButton className={style.statsBtn}>
      <h2>
        Estatísticas completas
      </h2>
    </BaseButton>

    <div className={style.goals}>
      <h2>
        Gols
      </h2>
      <div className={style.goalsList}>
        {Array.from(Array(5).keys()).map((_, index) => (
          <GoalsCard key={index} />
        ))}
      </div>
    </div>
  </div>
)

export const getServerSideProps = withAuth(async (ctx: GetServerSidePropsContext) => {
  try {
    const match = await getMatch(ctx.query.id as string);

    if (!match) {
      throw new Error("Match doesn't exists");
    }

    return {
      props: {
        match: JSON.parse(JSON.stringify(match))
      }
    }

  } catch (e) {
    console.log(e);
    ctx.res.writeHead(302, { Location: '/' });
    ctx.res.end();

    return {
      redirect: {
        destination: '/',
        permanent: false
      }
    };
  }
});

const MatchPage: NextPage = ({ match }: InferGetServerSidePropsType<typeof getServerSideProps>) => {

  return (
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

          <div className={style.tabs}>
            <Tabs tabs={[
              { title: 'Info', component: <InfoTab /> },
              { title: 'Escalação', component: <LineupTab /> },
              { title: 'Resultado', component: <ResultTab /> },
            ]} />
          </div>
        </main>
        <div className={style.fabAcceptMatch}>
          <button className={style.accept}>
            <h3>
              To dentro!
            </h3>
          </button>
          <button className={style.reject}>
            <h3>
              To fora
            </h3>
          </button>
        </div>
      </div>
    </MatchContextProvider>
  );
}

export default MatchPage;