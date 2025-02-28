import Authpage from "@/components/Authpage";


export default function SignupPage() {
    return (
        <div className=" flex flex-col justify-center items-center h-screen w-screen">
            <div className="border border-gray-400 rounded-lg h-auto w-[20rem] p-6 flex flex-col justify-center items-center gap-3">
                <Authpage isSignin={false} />
            </div>
        </div>
    );
}
