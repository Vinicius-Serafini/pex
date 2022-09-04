import style from './style.module.css';
import { useField, FieldHookConfig } from 'formik';
import ReactSelect, { Props } from 'react-select';

type SearchableSelectProps = FieldHookConfig<string> & {
  label: string;
  reactSelect: Props;
  value?: any
}

const customStyles = {
  // @ts-ignore: Unreachable code error
  control: (provided, state) => ({
    ...provided,
    border: '2px solid #5DCD4A',
    boxShadow: "none",
    "&:hover": {
      borderColor: "#5DCD4A"
    },
  })
}

export function SearchableSelect({ label, value, reactSelect, ...props }: SearchableSelectProps) {

  const [field, meta, helpers] = useField(props);

  return (
    <div className={style.selectWrapper}>
      <ReactSelect
        {...field}
        {...reactSelect}
        value={reactSelect.value}
        styles={customStyles}
        placeholder={props.placeholder}
        onChange={reactSelect.onChange}
      />
      <label>{label}</label>
      {(meta.touched && meta.error) && (
        <div className={style.error}>{meta.error}</div>
      )}
    </div>
  )
}
