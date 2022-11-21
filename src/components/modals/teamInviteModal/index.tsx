import { Form, Formik, FormikProps } from "formik";
import { useRouter } from "next/router";
import { useState } from "react";
import toast from "react-hot-toast";
import { SearchableSelect } from "src/components/searchableSelect";
import { useMatch } from "src/hooks/useMatch";
import { updateMatchInvite } from "src/services/inviteService";
import { Invite, Team } from "src/types";
import BaseModal from "../base";
import * as Yup from "yup";
import { ActionMeta } from "react-select";
import useTeams from "src/hooks/useTeams";
import styles from "./styles.module.css";

type teamInviteModalProps = {
  is_opened: boolean,
  close: Function,
  invite: Invite
}

export function TeamInviteModal({ is_opened, close, invite }: teamInviteModalProps) {
  const [selectedTeam, setSelectedTeam] = useState<Team | null>(null);
  const teams = useTeams();

  const [formSubmitType, setFormSubmitType] = useState<"ACCEPT" | "REJECT">()

  const onSelectTeamChange = (newValue: unknown, actionMeta: ActionMeta<unknown>, props: FormikProps<any>) => {
    props.setFieldValue('team', newValue as Team);
    setSelectedTeam(newValue as Team);
  }

  const router = useRouter();

  const { match, owner } = useMatch();

  const filteredTeams = teams.filter(m => m.uid != owner?.uid)

  const onSubmit = () => {
    if (!selectedTeam) {
      return;
    }

    if (formSubmitType == "ACCEPT") {
      handleAcceptMatchInvite(selectedTeam);
    }

    if (formSubmitType == "REJECT") {
      handleRejectMatchInvite(selectedTeam);
    }

    close();
  }


  const handleRejectMatchInvite = async (team: Team) => {
    await updateMatchInvite(match, invite, "REJECTED", team);

    toast('Convite recusado!',
      {
        icon: '❌',
        style: {
          borderRadius: '10px',
          background: '#333',
          color: '#fff',
        },
      }
    );

    router.push("/");
  }

  const handleAcceptMatchInvite = async (team: Team) => {
    await updateMatchInvite(match, invite, "ACCEPTED", team);

    toast('Convite aceito!',
      {
        icon: '✅',
        style: {
          borderRadius: '10px',
          background: '#333',
          color: '#fff',
        },
      }
    );

    close();
  }

  const FormSchema = Yup.object().shape({
    team: Yup.mixed<Team>().required('Este campo é obrigatório')
  });

  const initalValues = {
    team: null,
  };


  return (
    <BaseModal
      isClosable={false}
      closeModal={close}
      isOpened={is_opened}
      withBackdrop
      header={(
        <h2>Escolha um Time</h2>
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
              </div>
              <div className={styles.footer}>
                <button
                  type="button"
                  className={styles.rejectBtn}
                  onClick={e => {
                    setFormSubmitType("REJECT");
                    props.handleSubmit();
                  }}>
                  Recusar
                </button>
                <button
                  type="button"
                  className={styles.acceptBtn}
                  onClick={e => {
                    setFormSubmitType("ACCEPT");
                    props.handleSubmit();
                  }}>
                  Aceitar
                </button>
              </div>
            </Form>
          )}
        </Formik>
      )}
    />
  )
}