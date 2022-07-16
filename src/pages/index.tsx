import type { GetServerSidePropsContext, NextPage } from 'next';
import Head from 'next/head';
import BaseButton from '../components/buttons/baseButton';
import HistoryCard from '../components/cards/history';
import MatchCard from '../components/cards/match';
import Tabs from '../components/tabs';
import styles from './styles.module.css';
import UserSticker from '../components/userSticker';
import { useAuth } from 'src/hooks/useAuth';
import { User } from 'src/types';
import { withAuth } from 'src/lib/middleware/withAuth';

export const getServerSideProps = withAuth();

const Home: NextPage = () => {
  const { user } = useAuth();

  const data = [
    { title: 'Total de jogos', value: 10 },
    { title: 'Total de gols', value: 5 },
    { title: 'Vitórias', value: 7 },
    { title: 'Média de gols:', value: 2.5 },
  ]

  return (
    <div>
      {/* <Head>
        <title>Create Next App</title>
        <meta name="description" content="Generated by create next app" />
        <link rel="icon" href="/favicon.ico" />
      </Head> */}

      <main className={styles.main}>
        <div className={styles.hero}>
          {user ? (<UserSticker user={user as User} />) : null}
          <div className={styles.statsContainer}>
            <div className={styles.statsWrapper}>
              {data.map(({ title, value }, index) => (
                <div className={styles.stats} key={index}>
                  <h3>{title}</h3>
                  <div>
                    <span>{value}</span>
                  </div>
                </div>
              ))}
            </div>
            <div className={styles.btnStatsContainer}>
              <BaseButton className={styles.btnStats}>
                <span>Estatísticas completas</span>
              </BaseButton>
            </div>
          </div>
        </div>

        <div className={styles.matchesList}>
          <Tabs tabs={[
            {
              title: 'Próximos jogos', component: (
                <div className={styles.matchesListBody}>
                  {Array.from(Array(5).keys()).map((_, index) => (
                    <MatchCard key={index.toString()} />
                  ))}
                </div>
              )
            },
            {
              title: 'Histórico', component: (
                <div className={styles.matchesListBody}>
                  {Array.from(Array(5).keys()).map((_, index) => (
                    // <MatchCard />
                    <HistoryCard key={index.toString()} />
                  ))}
                </div>
              )
            },
          ]} />
        </div>
      </main >
    </div >
  )
}
export default Home;

