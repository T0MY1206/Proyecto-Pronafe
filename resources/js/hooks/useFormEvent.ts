import { required, string, number, date, minLength, length, email } from "@/lib/validationFunctions";
import { useForm } from "@inertiajs/react";

export function useFormEvent(fields: any) {

    const formFields: any = {};
    const validationFields: any = {};

    Object.keys(fields).forEach( (field) => {
        if(typeof fields[field] === 'object') {
            formFields[field] = fields[field].value;

            if(fields[field].validations) {
                validationFields[field] = fields[field].validations;
            }
        } else {
            formFields[field] = '';
        }
    });

    const { data, errors, setData, post, put, setError, clearErrors, reset, processing } = useForm(formFields);

    let updatedData = {...data};

    const actionValidate: any = {
        required,
        string,
        number,
        date,
        email,
        minLength,
        length
    }

    const onChangeData = async ({target}: any) => {
        const { id, value } = target;

        if(id?.length > 0) {
            const inputValue = value === '' ? null : value;

            await setData((prevData: any) => {
                updatedData = {...prevData, [id]: inputValue};
                return updatedData;
            });
        }
    };

    const onChangeDataExtra = async (event: any, index: number, field: string) => {
        const datos_extras = {...data.alumno_dato_extras};

        if(event.target.type === 'checkbox' || event.target.type === 'radio') {
            datos_extras[index].valor[field] = event.target.checked;
        } else {
            datos_extras[index].valor[field] = event.target.value;
        }

        await onChangeData({ target: { id: 'alumno_dato_extras', value: datos_extras } });
    };

    const onReset = () => {
        if(reset) {
            reset();
        }
    };

    const validateData = ( validations?: any[] ) => {
        let result = true;
        clearErrors();

        const optionsValidations = validations || validationFields;

        Object.keys(optionsValidations).forEach( (key: any) => {
            const functions = optionsValidations[key].split('|');

            for(let i = 0; i < functions.length; i++) {
                const functionItem = functions[i];
                const [action, ...params] = functionItem.split(':');

                const validationResult = actionValidate[action]( data, key, params );

                if(validationResult) {
                    setError(key, validationResult);
                    result = false;
                    break;
                }
            }
        });

        return result;
    };

    return {
        data,
        processing,
        errors,
        post,
        put,
        onReset,
        onChangeData,
        onChangeDataExtra,
        validateData,
        updatedData,
    };
}
