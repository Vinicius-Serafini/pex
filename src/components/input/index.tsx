import styles from './styles.module.css';
import { useField, FieldHookConfig } from 'formik';

type InputProps = FieldHookConfig<string> & {
  label: string;
}


const Input = ({ label, ...props }: InputProps) => {

  const [field, meta, helpers] = useField(props);

  return (
    <div className={styles.input}>
      <label>{label}</label>
      <input {...field} placeholder={props.placeholder} type={props.type} />
      {meta.touched && meta.error ? (
        <div className={styles.error}>{meta.error}</div>
      ) : null}
    </div>
  )
}

export default Input;