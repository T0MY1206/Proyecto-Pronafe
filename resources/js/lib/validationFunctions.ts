import moment from "moment";

export function required(data: Record<string, unknown>, key: string) {
    if(data[key] && data[key].toString().length > 0) {
        return null;
    }

    return `Este campo es obligatorio.`;
}

export function string (data: Record<string, unknown>, key: string) {
    if(!data[key] || data[key].toString().length === 0) {
        return null;
    }

    const regex = /^[a-zA-Z\sáéíóúÁÉÍÓÚñÑ']+$/;

    if(regex.test(data[key].toString())) {
        return null;
    }

    return 'Este campo posee caracteres inválidos';
}

export function number (data: Record<string, unknown>, key: string) {
    if(!data[key] || data[key].toString().length === 0) {
        return null;
    }

    const regex = /^[0-9\s']+$/;

    if(regex.test(data[key].toString())) {
        return null;
        }

    return 'Este campo posee caracteres inválidos';
}

export function date (data: Record<string, unknown>, key: string) {
    if(!data[key] || data[key].toString().length === 0) {
        return null;
    }

    const dataValue = moment(data[key]);

    if(dataValue.isValid()) {
        return null;
    }

    return 'Este campo posee una fecha inválida.';
}

export function minLength (data: Record<string, unknown>, key: string, params: unknown[]) {
    if(!data[key] || data[key].toString().length === 0) {
        return null;
    }

    const value = data[key].toString().length;
    const compare = parseFloat(params[0] as string);

    if(value >= compare) {
        return null;
    }

    return `Este campo debe tener al menos ${ compare } caracteres`;
}

export function maxLength (data: Record<string, unknown>, key: string, params: unknown[]) {
    if(!data[key] || data[key].toString().length === 0) {
        return null;
    }

    const value = data[key].toString().length;
    const compare = parseFloat(params[0] as string);

    if(value <= compare) {
        return null;
    }

    return `Este campo no debe ser mayor a ${ compare } caracteres`;
}

export function length (data: Record<string, unknown>, key: string, params: unknown[]) {
    if(!data[key] || data[key].toString().length === 0) {
        return null;
    }

    if(data[key]) {
        const length = data[key].toString().length;

        if(params.length > 1) {
            const start = parseInt(params[0] as string);
            const end = parseInt(params[1] as string);

            if(length >= start && length <= end) {
                return null;
            }

            return `Este campo debe tener de ${ start } a ${ end } caracteres`;
        } else if(params.length === 1) {
            const compare = parseInt(params[0] as string);

            if(length === compare) {
                return null;
            }

            return `Este campo debe tener ${ compare } caracteres`;
        }
    }

    return null;
}

export function email(data: Record<string, unknown>, key: string) {
    if(!data[key] || data[key].toString().length === 0) {
        return null;
    }

    const regex = /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|.(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;

    if(regex.test(String(data[key]).toLowerCase())) {
        return null;
    }

    return 'Este campo debe tener un emai válido';
}

export function atLeastOne (data: Record<string, unknown>, key: string, params: unknown[]) {
    let ok = true;

    params.forEach((otherKey: unknown) => {
        const value = data[otherKey as string];
        if (
            value === undefined ||
            value === null ||
            (typeof value === "string" && value.length === 0) ||
            (typeof value !== "string" && value && value.toString().length === 0)
        ) {
            ok = false;
        }
    });

    if (
        ok &&
        (
            data[key] ||
            (typeof data[key] === "string" && data[key].length > 0) ||
            (typeof data[key] !== "string" && data[key] !== undefined && data[key] !== null && data[key].toString().length > 0)
        )
    ) {
        return null;
    }

    return '';
}
