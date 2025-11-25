import AppIcon from "@/components/Icons/AppIcon";
import {Link} from "@inertiajs/react";
import { MouseEventHandler, ReactNode } from "react";

interface FormProps {
    children: ReactNode,
    procesing: boolean,
    validateData?: () => boolean,
    onSubmit: (event: React.FormEvent<HTMLFormElement>) => void,
    onReset: () => void,
    backHref?: string,
    showButtons?: boolean,
    disabled?: boolean
}

export default function Form( { children, procesing, validateData, onSubmit, onReset, backHref, showButtons = true, disabled = false }: FormProps ) {
    const onInnerSubmit = (event: any) => {
        event.preventDefault();

        if(typeof validateData === 'function') {
            if(validateData()) {
                onSubmit(event);
            }
        } else {
            onSubmit(event);
        }
    };

    return <form className={`intro-y box p-5`} onSubmit={onInnerSubmit} >
        <fieldset disabled={disabled} className="w-full">
            {children}

            { showButtons === true && <div className="text-right mt-5">
                {backHref && <Link href={ backHref } className="btn btn-secondary w-25 mr-1 p-3 focus:outline-none focus:ring-0">
                    <AppIcon name="corner-down-left" className="w-5 h-5 mr-2"></AppIcon>
                    Volver
                </Link>}

                <button type="button" className="btn btn-outline-secondary w-25 mr-1 p-3 focus:outline-none focus:ring-0" onClick={onReset as MouseEventHandler<HTMLButtonElement>}>
                    <AppIcon name="refresh-cw" className="w-5 h-5 mr-2"></AppIcon>
                    Limpiar
                </button>
                <button type="submit" className="btn btn-primary p-3 w-25 focus:outline-none focus:ring-0" disabled={procesing}>
                    {procesing && <AppIcon name="tail-spin" size={38} className="w-5 h-5 mr-2"></AppIcon>}
                    {!procesing && <AppIcon name="save" className="w-5 h-5 mr-2"></AppIcon>}
                    Guardar
                </button>
            </div> }
        </fieldset>
    </form>;
}
