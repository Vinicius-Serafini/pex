import { NextPage } from "next";
import Image from "next/image";
import FormationCard from "../../../../components/cards/formation";
import UserCard from "../../../../components/cards/user";
import style from './TeamLineup.module.css';

const Lineup: NextPage = () => {
  return (
    <div>
      <main className={style.body}>
        <div className={style.lineup}>
          <div className={style.formation}>
            <h3>Esquema tático</h3>
            <select
              className={style.formationSelect}
              name="formation"
              id="formation">
              <option value="1" selected>4-4-2</option>
            </select>
          </div>
          <div>
            <FormationCard />
          </div>
        </div>
        <div className={style.substitutes}>
          <h3 className={style.title}>Reservas</h3>
          <div className={style.substitutesList}>
            {Array.from(Array(5).keys()).map((_, index) => (
              <UserCard key={index} />
            ))}
          </div>
        </div>
      </main>
    </div>
  );
}

export default Lineup;