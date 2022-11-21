import { useEffect, useState } from 'react';
import { getGoalsFromMatch } from 'src/services/matchService';
import { getTeamShallow } from 'src/services/teamService';
import { Goal, Match, Team } from 'src/types';
import style from './styles.module.css';

type HistoryCardProps = {
  match: Match
}

const HistoryCard = ({ match }: HistoryCardProps) => {
  const [goals, setGoals] = useState<Array<Goal>>([]);

  const loadGoals = async () => {
    const goals = await getGoalsFromMatch(match);

    setGoals(goals);
  }

  useEffect(() => {
    if (match) {
      loadGoals();
    }

  }, [match]);

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

  }, {});

  return (
    <div className={style.body}>
      <div className={style.team}>
        <h3>
          {match.owner.name}
        </h3>
      </div>
      <div className={style.score}>
        <h2>{
          // @ts-ignore: Unreachable code error
          goalResults[match.owner.uid] ? goalResults[match.owner.uid].length : 0}</h2>
        <p>x</p>
        <h2>{
          // @ts-ignore: Unreachable code error
          goalResults[match.invitedTeam?.uid] ? goalResults[match.invitedTeam?.uid].length : 0}</h2>
      </div>
      <div className={style.team}>
        <h3>
          {match.invitedTeam?.name}
        </h3>
      </div>
    </div>
  );
}

export default HistoryCard;