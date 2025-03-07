import Authpage from "@/components/Authpage";

export default function SigninPage() {
    return (
        <div className="relative flex flex-col justify-center items-center h-screen w-screen overflow-hidden">
            <div className="pointer-events-none absolute inset-x-0 bottom-0 z-0 h-[50vh] bg-gradient-to-t from-gray-500/20 to-transparent" />
            <div className="pointer-events-none absolute bottom-0 left-1/2 z-0 aspect-square w-[50vh] -translate-x-1/2 translate-y-1/2 rounded-full bg-gray-500 opacity-20 blur-[100px]" />
            <div className="border border-gray-400 rounded-lg h-auto w-[20rem] p-6 flex flex-col justify-center items-center gap-3">
                <Authpage isSignin={true} />
            </div>
        </div>
    )
}
