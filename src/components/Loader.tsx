export default function Loader() {
    return (
        <section className="h-full w-full bg-transparent dark:bg-dark-0 flex justify-center items-center">
            <div className="w-full h-full max-h-16 max-w-16 rounded-full bg-none border-[3px] border-t-transparent border-r-transparent border-dark-3 animate-spin" style={{ animationDuration: '500ms' }} />
        </section>
    );
}
