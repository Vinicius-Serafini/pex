import Image from "next/image";
import UserAvatar from "../../userAvatar";
import Card from "../baseCard";
import style from "./styles.module.css";

const FormationCard = () => {

  return (
    <Card>
      <div className={style.lineupWrapper}>
        <div className={style.lineup}>
          {Array.from(Array(5).keys()).map((_, index) => (
            <div className={style.lineupRow} key={index}>
              {Array.from(Array(5).keys()).map(() => (
                <UserAvatar
                  src="https://www.lance.com.br/files/article_main/uploads/2022/05/25/628ea38f22dcc.jpeg"
                  alt=""
                  size='4rem'
                  key={index}
                />
              ))}
            </div>
          ))}
        </div>
        <img src="/images/soccer_field.png" alt="soccer-field" />
        {/* <Image
          src="/images/soccer_field.png"
          height={545}
          width={394}
        /> */}
      </div>
    </Card>
  )
}

export default FormationCard;