import FormLabel from "./FormLabel";

interface FormInputProps {
    label?: string,
    placeholder: string
    name: string,
    type?: string,
    value?: string | number | null,
    className?: string,
    variant?: string,
    disabled?: boolean,
    readOnly?: boolean
    errors?: any,
    onChange: ({target}: any) => void,
    onBlur?: ({target}: any) => void
}

export default function FormInput({label, placeholder, name, type, value, errors, onChange, className, variant, disabled = false, readOnly = false, onBlur} : FormInputProps) {

    let inputClass = `form-control w-full`;
    if(variant === 'session') {
        inputClass = `intro-x login__input form-control py-3 px-4 border-gray-300 block`;
    }
    if(readOnly) {
        inputClass += ` bg-gray-100 cursor-not-allowed`;
    }

    return <div className={`input-form ${className}`}>
        <FormLabel name={name} label={label ? label : placeholder}></FormLabel>
        <input
            className={`${inputClass} ${(errors && Object.hasOwn(errors, name)) ? 'has-error' : ''}`}
            id={name}
            name={name}
            type={type}
            placeholder={placeholder}
            value={value ?? ''}
            onChange={onChange}
            disabled={disabled}
            readOnly={readOnly}
            onBlur={onBlur} />
        { (errors && Object.hasOwn(errors, name)) && <div className="pristine-error text-primary-3 mt-2">{ errors[name] }</div>}
    </div>;
}
