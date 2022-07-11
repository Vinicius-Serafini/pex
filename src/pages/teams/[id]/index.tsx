import { NextPage } from "next";
import QuickAccess from "../../../components/buttons/quickAccess";
import Card from "../../../components/cards/baseCard";
import style from './Team.module.css';
import { faChartColumn, faPeopleGroup, faUserGroup } from '@fortawesome/free-solid-svg-icons';
import Tabs from "../../../components/tabs";
import MatchCard from "../../../components/cards/match";
import HistoryCard from "../../../components/cards/history";
import UserCard from "../../../components/cards/user";


const Team: NextPage = () => {
  const stats = [
    { title: 'Vitórias', value: 5 },
    { title: 'Empates', value: 3 },
    { title: 'Jogos', value: 12 },
    { title: 'Gols', value: 7 }
  ];

  const quickAccesses = [
    { label: 'Estatísticas', icon: faChartColumn, onClick: () => console.log('hehehe') },
    { label: 'Escalação', icon: faPeopleGroup, onClick: () => console.log('hehehe') },
    { label: 'Nova Partida', icon: faUserGroup, onClick: () => console.log('hehehe') }
  ]

  return (
    <div>
      <main>
        <Card className={style.card}>
          <h2>Nome do time</h2>
          <div className={style.stats}>
            {stats.map(({ title, value }) => (
              <div className={style.stat}>
                <p>{title}</p>
                <span>{value}</span>
              </div>
            ))}
          </div>
        </Card>
        <div className={style.quickAccesses}>
          {quickAccesses.map(({ label, icon, onClick }) => (
            <QuickAccess
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
                  {Array.from(Array(5).keys()).map((_, index) => (
                    <UserCard key={index.toString()} />
                  ))}
                </div>
              )
            }
          ]} />
        </div>
      </main>
    </div>
  );
}

export default Team;