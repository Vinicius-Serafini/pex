import { Form, Formik, FormikProps } from "formik";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { SearchableSelect } from "src/components/searchableSelect";
import { useMatch } from "src/hooks/useMatch";
import { Team, User } from "src/types";
import BaseModal from "../base";
import * as Yup from "yup";
import { ActionMeta } from "react-select";
import styles from "./styles.module.css";
import { createGoal } from "src/services/matchService";

type addGoalModalProps = {
  is_opened: boolean,
  close: Function,
}

export default function AddGoalModal({ is_opened, close }: addGoalModalProps) {
  const [selectedTeam, setSelectedTeam] = useState<Team | null>(null);
  const [selectedUser, setSelectedUser] = useState<User | null>(null);

  const onSelectTeamChange = (newValue: unknown, actionMeta: ActionMeta<unknown>, props: FormikProps<any>) => {
    props.setFieldValue('team', newValue as Team);
    setSelectedTeam(newValue as Team);
  }

  const onSelectUserChange = (newValue: unknown, actionMeta: ActionMeta<unknown>, props: FormikProps<any>) => {
    props.setFieldValue('user', newValue as User);
    setSelectedUser(newValue as User);
  }

  const { match, owner } = useMatch();

  const filteredTeams = [owner, (match.invitedTeam ? match.invitedTeam : null)].filter(t => t != null);

  const filteredUsers = selectedTeam ? selectedTeam.players : [];

  useEffect(() => {
    setSelectedUser(null);
  }, [selectedTeam])

  const onSubmit = async () => {
    if (!selectedTeam || !selectedUser) {
      return;
    }

    const goalId = await createGoal(match, selectedUser, selectedTeam);

    toast('Gol criado!',
      {
        icon: '⚽',
        style: {
          borderRadius: '10px',
          background: '#333',
          color: '#fff',
        },
      }
    );

    close(goalId);
  }

  const FormSchema = Yup.object().shape({
    team: Yup.mixed<Team>().required('Este campo é obrigatório'),
    user: Yup.mixed<User>().required('Este campo é obrigatório')
  });

  const initalValues = {
    team: null,
    user: null,
  };


  return (
    <BaseModal
      isClosable={true}
      closeModal={close}
      isOpened={is_opened}
      withBackdrop
      header={(
        <h2>Adicionar gol</h2>
      )}
      body={(
        <Formik
          initialValues={initalValues}
          validationSchema={FormSchema}
          onSubmit={onSubmit}>
          {(props: FormikProps<any>) => (
            <Form>
              <div className={styles.body}>
                <SearchableSelect
                  name="team"
                  label="Time"
                  placeholder="Selecione um time"
                  reactSelect={{
                    options: filteredTeams,
                    value: selectedTeam,
                    getOptionLabel(option: any) {
                      return option?.name;
                    },
                    getOptionValue(option: any) {
                      return option;
                    },
                    isOptionSelected(option: any) {
                      return option.uid == selectedTeam?.uid;
                    },
                    onChange: (newValue, actionMeta) => onSelectTeamChange(newValue, actionMeta, props),
                  }}
                />
                <SearchableSelect
                  name="user"
                  label="Jogador"
                  placeholder="Selecione um jogador"
                  reactSelect={{
                    options: filteredUsers,
                    value: selectedUser,
                    getOptionLabel(option: any) {
                      return option?.name;
                    },
                    getOptionValue(option: any) {
                      return option;
                    },
                    isOptionSelected(option: any) {
                      return option.uid == selectedUser?.uid;
                    },
                    onChange: (newValue, actionMeta) => onSelectUserChange(newValue, actionMeta, props),
                  }}
                />
              </div>
              <div className={styles.footer}>
                <button
                  type="submit"
                  className={styles.acceptBtn}>
                  Criar
                </button>
              </div>
            </Form>
          )}
        </Formik>
      )}
    />
  )
}