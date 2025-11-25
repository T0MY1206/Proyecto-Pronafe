import { createContext, ReactNode, useContext } from "react";

const FormGroupContext = createContext(false);

interface FormGroupProps {
    children: ReactNode,
    col: number,
    className: string,
    center: boolean
}

export default function FormGroup({children, col, className, center = false}: FormGroupProps) {
    const isInsideFormGroup = useContext(FormGroupContext);

    return (
        <FormGroupContext.Provider value={true}>
            <div className={`sm:grid grid-cols-${col} gap-2 ${className} ${!isInsideFormGroup  ? 'mt-3' : ''}`}>
                { center ? <div className="block mx-auto"> {children} </div> : children }
            </div>
        </FormGroupContext.Provider>
    );
}