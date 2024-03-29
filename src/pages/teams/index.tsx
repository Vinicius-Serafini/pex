import type { NextPage } from 'next'
import Head from 'next/head'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faMagnifyingGlass, faPlus } from '@fortawesome/free-solid-svg-icons';
import style from './styles.module.css';
import Chip from '../../components/chips';
import TeamCard from '../../components/cards/team';
import { FAB } from 'src/components/FAB';
import CreateEditTeamModal from 'src/components/modals/createEditTeam';
import { useEffect, useRef, useState } from 'react';
import { withAuth } from 'src/middleware/withAuth';
import useTeams from 'src/hooks/useTeams';
import { useAuth } from 'src/hooks/useAuth';
import { Team } from 'src/types';
import Link from 'next/link';
import useDebounce from 'src/hooks/useDebounce';

export const getServerSideProps = withAuth();

const Teams: NextPage = () => {
  const { user } = useAuth();
  const teams = useTeams();

  const [showModal, setShowModal] = useState<boolean>(false);

  const [filteredTeams, setFilteredTeams] = useState<Array<Team>>(teams);

  const [activeFilterIdx, setActiveFilterIdx] = useState<number>(0)

  const [textSearch, setTextSearch] = useState<string>('');

  const debouncedTextSearch = useDebounce(textSearch);

  const FILTERS = [
    { title: 'Todos', condition: (team: Team) => true },
    { title: 'Organizador', condition: (team: Team) => user?.uid == (typeof team.owner == 'string' ? team.owner : team.owner.uid) },
    { title: 'Jogador', condition: (team: Team) => team.players?.find(player => player.uid == user?.uid) && user?.uid != (typeof team.owner == 'string' ? team.owner : team.owner.uid) }
  ];

  useEffect(() => {
    if (activeFilterIdx) {
      setFilteredTeams(teams.filter(team => FILTERS[activeFilterIdx].condition(team)));
    } else if (debouncedTextSearch.trim() != '') {
      setFilteredTeams(teams.filter(team => team.name.includes(debouncedTextSearch)));
    } else {
      setFilteredTeams(teams);
    }
  }, [activeFilterIdx, teams, debouncedTextSearch])


  return (
    <>
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
            <input
              type="text"
              placeholder='Pesquisar time'
              value={textSearch}
              onChange={e => setTextSearch(e.target.value)} />
          </div>
          <div className={style.body}>
            <div className={style.filter}>
              {FILTERS.map(({ title }, index) => (
                <Chip
                  filled={activeFilterIdx == index}
                  onClick={() => setActiveFilterIdx(index)}
                  key={index}>
                  {title}
                </Chip>
              ))}
            </div>
            <div className={style.teams}>
              {filteredTeams.map((team, index) => (
                <Link
                  href={`/teams/${team.uid}`}
                  key={index}>
                  <button>
                    <TeamCard
                      team={team}
                      isUserOwner={(typeof team.owner == 'string' ? team.owner : team.owner.uid) == user?.uid}
                    />
                  </button>
                </Link>
              ))}
            </div>
          </div>
        </main>
      </div>
      <FAB
        icon={faPlus}
        onClick={() => { setShowModal(true) }} />
      <CreateEditTeamModal
        isOpened={showModal}
        closeModal={() => setShowModal(false)} />
    </>
  )
}

export default Teams
