import Authpage from "@/components/Authpage";
import FooterSpotlight from "@/components/FooterSpotlight";
import NavBar from "@/components/NavBar";

export default function SigninPage() {
    return (
        <div className="relative flex flex-col justify-center items-center h-screen w-screen overflow-hidden">
            <NavBar />

            <div className="border border-gray-400 rounded-lg h-auto w-[20rem] p-6 flex flex-col justify-center items-center gap-3">
                <Authpage isSignin={true} />
            </div>
            <FooterSpotlight />
        </div>
    )
}
