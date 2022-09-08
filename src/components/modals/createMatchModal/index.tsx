import Input from "src/components/input";
import BaseModal from "../base";
import style from './style.module.css';
import { Formik, Form, FormikProps, FormikHelpers, } from 'formik';
import { useAuth } from "src/hooks/useAuth";
import { useRouter } from "next/router";
import * as Yup from "yup";
import { Select as CustomSelect } from "src/components/select";
import { SearchableSelect } from "src/components/searchableSelect";
import { Place } from "src/types";
import { ActionMeta, InputActionMeta, OptionProps } from "react-select";
import { SyntheticEvent, useEffect, useState } from "react";
import useDebounce from "src/hooks/useDebounce";
import { getPlaces } from "src/services/placesService";
import toast from "react-hot-toast";
import { createMatch } from "src/services/matchService";
import { useCurrentTeam } from "src/hooks/useCurrentTeam";

type CreateMatchModalProps = {
  isOpened: boolean,
  closeModal: Function
}

type FormikValues = {
  name: string;
  date: string;
  time: string;
  duration: number;
  place: Place | any;
}

const CityOption = (option: OptionProps) => {
  // @ts-ignore: Unreachable code error
  const place = option.data as Place

  const formatAddress = (place: Place) => {
    return `${place.address.city} - ${place.address.state?.name || ''}, ${place.address.street}, ${place.address?.suburb || ''}, ${place.address.postcode}`
  }

  return (
    <div className={[style.cityOption, (option.isSelected ? 'bg-primary-light' : '')].join(' ')} {...option.innerProps}>
      <p className={style.cityOption__title}>
        {place.name}
      </p>
      <span className={style.cityOption__description}>
        {formatAddress(place)}
      </span>
    </div>
  )
}

const CreateMatchModal = ({ isOpened, closeModal }: CreateMatchModalProps) => {
  const { user } = useAuth();
  const { team } = useCurrentTeam();
  const router = useRouter();
  const [selectedPlace, setSelectedPlace] = useState<Place>();
  const [places, setPlaces] = useState<Array<Place>>([]);
  const [filterPlaces, setFilterPlaces] = useState<string>('');

  const debouncedFilterPlaces = useDebounce(filterPlaces, 1000);

  const onSelectPlaceChange = (newValue: unknown, actionMeta: ActionMeta<unknown>, props: FormikProps<any>) => {
    props.setFieldValue('place', newValue as Place);
    setSelectedPlace(newValue as Place);
  }

  const findPlaces = (newValue: unknown, actionMeta: InputActionMeta) => {
    if (actionMeta.action == 'input-change') {
      setFilterPlaces(newValue as string);
    }
  }

  const handleFilterPlaces = async () => {
    try {
      const places = await getPlaces(debouncedFilterPlaces);
      if (places) {
        const placesFormattedArr = places.filter((p) => p.place_id != selectedPlace?.place_id);

        setPlaces([
          ...(selectedPlace ? [selectedPlace] : []),
          ...placesFormattedArr
        ]);
      }
    } catch (e) {
      toast('❌ Erro ao consultar lugares');
    }
  }

  useEffect(() => {
    if (debouncedFilterPlaces) {
      handleFilterPlaces();
    }

  }, [debouncedFilterPlaces]);

  const durations = [
    { label: '45min', value: 45 },
    { label: '1h30min', value: 90 },
    { label: '2h', value: 120 },
    { label: '3h', value: 180 },
    { label: '4h', value: 240 },
  ];

  const handleSubmit = async (
    { date, name, time, duration, place }: FormikValues,
    actions: FormikHelpers<FormikValues>) => {
    const team_id = await createMatch({ owner: team.get(), date, name, time, duration, place });

    if (!team_id) {
      return;
    }

    return router.replace(`match/${team_id}`);
  }

  const FormSchema = Yup.object().shape({
    name: Yup.string().required('Este campo é obrigatório'),
    date: Yup.date().required('Este campo é obrigatório'),
    time: Yup.string().required('Este campo é obrigatório'),
    duration: Yup.number().required('Este campo é obrigatório'),
    place: Yup.mixed<Place>().required('Este campo é obrigatório')
  });

  const initalValues = {
    name: '',
    date: '',
    time: '',
    duration: durations[0].value,
    place: ''
  };

  return (
    <BaseModal
      isOpened={isOpened}
      isClosable={true}
      withBackdrop={true}
      closeModal={closeModal}
      header={(
        <h1>
          Criar nova partida
        </h1>
      )}
      body={(
        <div className={style.modalBody}>
          <Formik
            initialValues={initalValues}
            validationSchema={FormSchema}
            onSubmit={handleSubmit}
          >
            {(props: FormikProps<any>) => (
              <Form className={style.form}>
                <Input
                  label='Nome da partida'
                  name="name"
                  type="text"
                />

                <div className={style.row}>
                  <Input
                    label='Data da partida'
                    name="date"
                    type="date"
                  />

                  <Input
                    label='Início da partida'
                    name="time"
                    type="time"
                  />
                </div>

                <CustomSelect
                  label="Duração"
                  name="duration"
                  options={durations}
                />

                <SearchableSelect
                  name="place"
                  label="Lugar"
                  placeholder="Pesquisar cidade"
                  reactSelect={{
                    options: places,
                    components: { Option: CityOption },
                    getOptionLabel(option: any) {
                      return option.name;
                    },
                    getOptionValue(option: any) {
                      return option;
                    },
                    filterOption(option): any {
                      return option;
                    },
                    onInputChange: findPlaces,
                    onChange: (newValue, actionMeta) => onSelectPlaceChange(newValue, actionMeta, props),
                    value: selectedPlace,
                    isOptionSelected(option: any) {
                      return option.place_id == selectedPlace?.place_id;
                    },
                  }}
                />

                <div className={style.btnWrapper}>
                  <button
                    className={style.btn}
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

export default CreateMatchModal;


const temp_places = [{
  name: "Primato Supermercado",
  address: {
    state: {
      name: "Paraná",
      initials: "PR"
    },
    street: "Rua Tomaz Gonzaga",
    suburb: "Vila Pioneiro",
    city: "Toledo",
    postcode: "85914-120",
  },
  coordinates: {
    lon: -53.723895,
    lat: -24.7419195,
  },
  place_id: "51745e6397a8dc4ac059c2c3b46feebd38c0f00103f9011d52c89c00000000c002019203145072696d61746f2053757065726d65726361646f"
},
{
  name: "Primato Supermercadooooo",
  address: {
    state: {
      name: "Paraná",
      initials: "PR"
    },
    street: "Rua Tomaz Gonzaga",
    suburb: "Vila Pioneiro",
    city: "Toledo",
    postcode: "85914-120",
  },
  coordinates: {
    lon: -53.723895,
    lat: -24.7419195,
  },
  place_id: "414151745e6397a8dc4ac059c2c3b46feebd38c0f00103f9011d52c89c00000000c002019203145072696d61746f2053757065726d65726361646f"
},];