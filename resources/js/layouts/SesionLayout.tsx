import ApplicationLogo from "@/components/ApplicationLogo";
import { ReactNode, useEffect } from "react";
import { Head } from "@inertiajs/react";

interface LayoutSesionProps {
    children: ReactNode
}

export default function ({ children }: LayoutSesionProps) {
    useEffect(() => {
        document.body.classList.add('login');
        document.body.classList.remove('main');

        return () => {
            document.body.classList.remove('login');
        }
    }, []);

    return <>
    <Head>
        <link rel="stylesheet" href="/assets/css/tinker.css" />
    </Head>
        <div className="container sm:px-10">
            <div className="block xl:grid grid-cols-2 gap-4">
                <div className="hidden xl:flex flex-col min-h-screen">
                    <a href="" className="-intro-x flex items-center pt-5">
                        <ApplicationLogo width={30} height={30}></ApplicationLogo>
                    </a>
                    <div className="my-auto">                       
                        {/* <img alt="Tinker Tailwind HTML Admin Template" className="-intro-x w-1/2 -mt-16" src="/assets/svg/illustration.svg" /> */}
                        <img src="/assets/images/Enfermeria.png" style={{ width: "450px", height: "auto" }} className="-intro-x rounded-xl -mt-16" />
                        <div className="-intro-x text-white font-medium text-4xl leading-tight mt-10">
                            
                           Bienvenido al Sistema 
                            <br />
                            PRONAFE
                        </div>
                          <div className="-intro-x mt-5 text-lg text-white text-opacity-70">
                            Gestiona la creación y actualización de institutos
                            de la rama de Enfermería.
                        </div>

                        
                    </div>
                </div>
                <div className="h-screen xl:h-auto flex py-5 xl:py-0 my-10 xl:my-0">
                    <div className="my-auto mx-auto xl:ml-20 bg-white dark:bg-dark-1 xl:bg-transparent px-5 sm:px-8 py-8 xl:p-0 rounded-md shadow-md xl:shadow-none w-full sm:w-3/4 lg:w-2/4 xl:w-auto">
                        {children}
                    </div>
                </div>
            </div>
        </div>
    </>;
}
