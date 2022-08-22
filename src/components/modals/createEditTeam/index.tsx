import Input from "src/components/input";
import BaseModal from "../base";
import styles from './styles.module.css';
import { Formik, Form, FormikProps, FormikHelpers, } from 'formik';
import { useAuth } from "src/hooks/useAuth";
import { useRouter } from "next/router";
import { createTeam } from "src/services/teamService";
import * as Yup from "yup";

type CreateEditTeamModalProps = {
  isOpened: boolean,
  closeModal: Function
}
type formikValues = {
  teamName: string;
}

const CreateEditTeamModal = ({ isOpened, closeModal }: CreateEditTeamModalProps) => {
  const { user } = useAuth();
  const router = useRouter();

  const handleCreateTeam = async (name: string) => {
    if (!user) {
      return null;
    }

    const team_id = await createTeam(name, user.uid);

    return team_id;
  }

  const handleSubmit = async ({ teamName }: formikValues, actions: FormikHelpers<formikValues>) => {
    const team_id = await handleCreateTeam(teamName);

    if (!team_id) {
      return;
    }

    return router.push(`teams/${team_id}`);
  }

  const FormSchema = Yup.object().shape({
    teamName: Yup.string().required('Este campo é obrigatório')
  });

  const initalValues = {
    teamName: ''
  };

  return (
    <BaseModal
      isOpened={isOpened}
      isClosable={true}
      withBackdrop={true}
      closeModal={closeModal}
      header={(
        <h1>
          Criar novo time
        </h1>
      )}
      body={(
        <div className={styles.modalBody}>
          <Formik
            initialValues={initalValues}
            validationSchema={FormSchema}
            onSubmit={handleSubmit}
          >
            {(props: FormikProps<any>) => (
              <Form>
                <Input
                  label='Nome do time'
                  name="teamName"
                  type="text" />

                <div className={styles.btnWrapper}>
                  <button
                    className={styles.btn}
                    type="submit">
                    Criar
                  </button>
                </div>
              </Form>
            )}
          </Formik>
        </div>
      )}
    />
  );
}

export default CreateEditTeamModal