import Authpage from "@/components/Authpage";
import FooterSpotlight from "@/components/FooterSpotlight";
import NavBar from "@/components/NavBar";
import { Progress } from "@/components/ui/progress";
import { useAuthStore } from "@/store/atoms/authStore";

export default function SignupPage() {
    const { loading } = useAuthStore();

    return (
        <div className="relative flex flex-col justify-center items-center h-screen w-screen overflow-hidden">
            {loading && (
                <div className="fixed top-0 left-0 w-full">
                    <Progress value={100} className="h-[0.5px] bg-primary" />
                </div>
            )}

            <NavBar />

            <div className="border border-gray-400 rounded-lg h-auto w-[20rem] p-6 flex flex-col justify-center items-center gap-3">
                <Authpage isSignin={false} />
            </div>
            <FooterSpotlight />
        </div>
    );
}
