import { addDoc, collection, doc, getDoc, setDoc, Timestamp } from "firebase/firestore";
import { Match, Place, Team } from "src/types";
import { clientFirestore } from "./firebaseClient";
import { getRandomImage } from "./imageService";

type createMatchProps = {
  owner: Team;
  name: string;
  date: string;
  time: string;
  duration: number;
  place: Place;
}

export async function createMatch({ owner, name, date, time, duration, place }: createMatchProps) {
  const matchDateTime = new Date(`${date}T${time}`);

  const matchBgUrl = await getRandomImage();

  const matchId = await saveMatch({ owner, name, date: matchDateTime, duration, place, imgUrl: matchBgUrl });

  return matchId;
}

type saveMatchArgs = {
  owner: Team;
  name: string;
  date: Date;
  duration: number;
  place: Place;
  imgUrl: string
}
export async function saveMatch({ owner, date, name, duration, place, imgUrl }: saveMatchArgs) {
  const matchRef = await addDoc(collection(clientFirestore, 'matches'), {
    owner: doc(clientFirestore, 'teams', owner.uid as string),
    name,
    date: Timestamp.fromDate(date),
    duration,
    place,
    imgUrl
  });

  return matchRef.id;
}


export const getMatch = async (uid: string): Promise<Match | null> => {
  const matchRef = doc(clientFirestore, 'matches', uid);
  const matchSnap = await getDoc(matchRef);

  if (!matchSnap.exists()) {
    return null;
  }

  const match = matchSnap.data();

  return {
    uid: matchSnap.id,
    name: match.name,
    date: match.date.toDate(),
    duration: match.duration,
    owner: match.owner.id,
    place: match.place,
    imgUrl: match.imgUrl
  };
}