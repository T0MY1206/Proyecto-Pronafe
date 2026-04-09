export default function PublicLayout({ children }: { children: React.ReactNode }) {
    return (
        <div className="mx-auto min-h-screen max-w-7xl bg-slate-50 px-6">
            <div className="flex h-screen flex-col items-center justify-center text-center lg:flex-row lg:text-left">
                <div className="lg:mr-20">
                    <img alt="" className="h-48 lg:h-auto" src="/assets/images/error-illustration.svg" />
                </div>
                <div className="mt-10 text-slate-900 lg:mt-0">{children}</div>
            </div>
        </div>
    );
}
