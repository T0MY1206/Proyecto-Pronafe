import ApplicationLogo from "@/components/ApplicationLogo";
import AppIcon from "@/components/Icons/AppIcon";
import AppMobileMenuItem from "@/components/layouts/AppMobileMenuItem";

export default function () {
    return <div className="mobile-menu md:hidden">
        <div className="mobile-menu-bar">
            <a href="" className="flex mr-auto">
                <ApplicationLogo height={30} width={30}></ApplicationLogo>
            </a>
            <a href="#" id="mobile-menu-toggler">
                <AppIcon name="bar-chart-2" className="w-8 h-8 text-gray-600 dark:text-white transform -rotate-90"></AppIcon>
            </a>
        </div>
        <ul className="mobile-menu-box py-5 hidden">
            <AppMobileMenuItem icon="home" title="Dashboard" url="admin.dashboard"></AppMobileMenuItem>

            <li className="menu__devider my-6"></li>
        </ul>
    </div>;
}
