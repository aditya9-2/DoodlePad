import Link from "next/link";
import Button from "./Button";
import PrimaryInput from "./primaryInput";

interface AuthProp {
    isSignin: boolean;
}

const Authpage = ({ isSignin }: AuthProp) => {
    return (
        <div className="flex flex-col gap-18 justify-center items-center">
            <h1 className="text-xl font-bold text-center mb-6">{`${isSignin ? "Signin" : "Signup"} here`}</h1>

            <div className="flex flex-col gap-8 rounded-xl w-[18rem]">
                {isSignin ? (
                    <>
                        <PrimaryInput type="text" placeholder="Create username" />
                        <PrimaryInput type="password" placeholder="Create password" />
                    </>
                ) : (
                    <>
                        <PrimaryInput type="text" placeholder="Add name" />
                        <PrimaryInput type="text" placeholder="Create username" />
                        <PrimaryInput type="password" placeholder="Create password" />
                    </>
                )}
            </div>

            <div className="mt-8">
                <Button label={isSignin ? "Signin" : "Signup"} />
            </div>
            <p className="text-sm mt-8 ">
                {isSignin ? "Don't have an account? " : "Already have an account? "}
                <Link href={isSignin ? "/signup" : "/signin"} className="text-blue-500 font-semibold">
                    {isSignin ? "Signup here" : "Signin here"}
                </Link>
            </p>
        </div>
    );
};

export default Authpage;
