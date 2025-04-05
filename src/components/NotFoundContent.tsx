export default function NotFoundContent() {
    return (
        <section className="container py-24 md:py-32">
            <div className="mx-auto max-w-[58rem] text-center">
                <h2 className="font-bold text-3xl leading-[1.1] sm:text-3xl md:text-5xl">
                    404: Page Not Found
                </h2>

                <p className="mt-4 sm:text-lg" style={{ margin: "30px 0" }}>
                    The requested page was not found.
                </p>
            </div>
        </section>
    );
};
