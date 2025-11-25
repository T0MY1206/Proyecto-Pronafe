import { ReactNode, useState } from "react";
import AppIcon, { type IconName, type IconType } from "../Icons/AppIcon";
import { Link } from "@inertiajs/react";

interface AppMenuItemProps {
    title: string;
    url?: string;
    icon: IconName;
    iconType?: IconType;
    active?: boolean;
    children?: ReactNode;
}

export default function ({title, url, icon, iconType, active, children}: AppMenuItemProps) {
    const [open, setOpen] = useState(active ?? false);

    const onClick = function (event: any) {
        if(children) {
            event.preventDefault();
            setOpen(!open);
        }
    }

    const content = <>
        <div className="side-menu__icon"><AppIcon name={icon} type={iconType}></AppIcon></div>
        <div className="side-menu__title">
            {title}
            {children && (
                <div className={`side-menu__sub-icon ${open ? 'transform rotate-180' : ''}`}>
                    <AppIcon name="chevron-down"></AppIcon>
                </div>
            )}
        </div>
    </>;

    return <li>
        {!children && (url && (
            <Link href={route(url)} className={`side-menu ${(route().current(url) || active) ? 'side-menu--active' : ''}`}
                onClick={onClick}>
                { content }
            </Link>
        ))}

        {children && (<>
            <button className={`side-menu ${open ? 'side-menu--active' : ''}`} onClick={onClick}>
                { content }
            </button>
            <ul className={open ? 'side-menu__sub-open' : ''}>
                {children}
            </ul>
        </>)}
    </li>;
}
