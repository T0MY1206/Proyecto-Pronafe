import AppIcon from "@/components/Icons/AppIcon";
import { BreadcrumbItem } from "@/types";
import { Link } from "@inertiajs/react";

interface BreadcrumbProps {
    children?: React.ReactNode;
    className?: string;
    breadcrumb?: BreadcrumbItem[]
}

export function Breadcrumb({ children, breadcrumb, className }: BreadcrumbProps) {
    return <div className={`-intro-x breadcrumb mr-auto ${className}`}>
        {children}


        {breadcrumb?.map((x, index) => <div key={index}>
            <Link href={x.href} className={index === (breadcrumb.length - 1) ? 'breadcrumb--active' : ''}>
                {x.label}
            </Link>

            {index < (breadcrumb.length - 1) && <AppIcon name="chevron-right" className="breadcrumb__icon"></AppIcon>}
        </div>)}
    </div>;
}
