import type { NextPage } from 'next'
import Head from 'next/head'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faMagnifyingGlass } from '@fortawesome/free-solid-svg-icons';
import style from './styles.module.css';
import Chip from '../../components/chips';
import PlayerCard from '../../components/cards/player';

const Teams: NextPage = () => {

  const filters = [
    { title: 'Todos' },
    { title: 'Organizador' },
    { title: 'Jogador' }
  ];

  return (
    <div className={style.container}>
      {/* <Head>
        <title>Create Next App</title>
        <meta name="description" content="Generated by create next app" />
        <link rel="icon" href="/favicon.ico" />
      </Head> */}

      <main>
        <div className={style.title}>
          <h1>
            Times
          </h1>
        </div>
        <div className={style.search}>
          <FontAwesomeIcon
            className={style.icon}
            icon={faMagnifyingGlass} />
          <input type="text" placeholder='Pesquisar time' />
        </div>
        <div className={style.body}>
          <div className={style.filter}>
            {filters.map(({ title }) => (
              <Chip>
                {title}
              </Chip>
            ))}
          </div>
          <div className={style.teams}>
            {Array.from(Array(5).keys()).map(() => (
              <PlayerCard />
            ))}
          </div>
        </div>
      </main>
    </div>
  )
}

export default Teams
