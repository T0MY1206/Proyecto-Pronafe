import icons from './icons.json';
import {createRef, useEffect} from "react";

export type IconName = keyof typeof icons;
export type IconType = 'fas' | 'far' | 'fab' | 'fa-solid' | 'fa-regular' | 'fa-brand' | null;

interface AppIconProps {
    name?: IconName;
    className?: string;
    type?:  IconType;
    size?: number;
}

export default function AppIcon({name, className, type = null, size = 24}: AppIconProps) {
    const svgRef = createRef<SVGSVGElement>();
    const faClases = ['fas', 'far', 'fab', 'fa-solid', 'fa-regular', 'fa-brand'];

    useEffect(() => {
        if (svgRef.current && name) {
            svgRef.current.innerHTML = icons[name];
        }
    }, [name, svgRef]);

    if(type && faClases.find((x) => x === type)) {
        return <i className={`${ type } ${name} ${className}`}></i>
    }

    return <svg ref={svgRef} xmlns="http://www.w3.org/2000/svg" width={size} height={size} viewBox={`0 0 ${size} ${size}`} fill="none"
                stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"
                className={`feather feather-${name} ${className}`}>
    </svg>;
}
