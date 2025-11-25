import FormLabel from "./FormLabel";

interface FormRadioProps {
    label: string,
    name: string,
    multiple?: boolean,
    variant?: string,
    className: string,
    value?: number | string,
    checked: boolean,
    onChange: (event: { target: { id: string, value: string | number | boolean | undefined } }) => void
}

export default function FormRadio({label, name, multiple, variant, className, value, checked, onChange}: FormRadioProps) {
    let inputCLass = 'form-check-switch';

    if(variant === 'session') {
        inputCLass = 'form-check-input border mr-2';
    }
    return <div className={className}>
        <FormLabel name={name} label={label}></FormLabel>
        <div className="mt-2">
            <input
                type="checkbox"
                name={name}
                id={name}
                value={value ?? name}
                checked={checked ?? false}
                className={inputCLass}
                onChange={(event) => {
                    const valueRadio = multiple ? value : event.target.checked;

                    if((multiple && event.target.checked) || !multiple) {
                        onChange({ target: { id: name, value: valueRadio } })
                    }
                }}/>
        </div>
    </div>
}
