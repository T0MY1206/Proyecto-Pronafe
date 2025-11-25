import { Head } from "@inertiajs/react";

export default function PublicLayout({ children }: { children: React.ReactNode }) {
    return (
        <>
            <Head>
                <link rel="stylesheet" href="/assets/css/tinker.css" />
            </Head>

            <div className="container">
                <div className="error-page flex h-screen flex-col items-center justify-center text-center lg:flex-row lg:text-left">
                    <div className="-intro-x lg:mr-20">
                        <img alt="Tinker Tailwind HTML Admin Template" className="h-48 lg:h-auto" src="/assets/images/error-illustration.svg" />
                    </div>
                    <div className="mt-10 text-white lg:mt-0">{children}</div>
                </div>
            </div>
        </>
    );
}
