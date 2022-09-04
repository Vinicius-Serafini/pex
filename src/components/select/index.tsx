import styles from './styles.module.css';
import { useField, FieldHookConfig } from 'formik';

type SelectProps = FieldHookConfig<string> & {
  label: string;
  options: Array<{ label: string, value: any }>
}


export function Select({ label, options, ...props }: SelectProps) {

  const [field, meta, helpers] = useField(props);

  return (
    <div className={styles.selectWrapper}>
      <select className={styles.select} {...field}>
        {options.map(({ value, label }) => (
          <option value={value} key={Math.random()}>
            {label}
          </option>
        ))}
      </select>
      <label>{label}</label>
      {(meta.touched && meta.error) && (
        <div className={styles.error}>{meta.error}</div>
      )}
    </div>
  )
}
