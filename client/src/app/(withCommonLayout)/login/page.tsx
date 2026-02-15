"use client";
import { loginUser } from "@/services/auth";
import { TResponse } from "@/types";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { toast } from "react-toastify";


const SignIn = () => {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<FormData>();
  const router = useRouter();


  interface FormData {
    email: string;
    phone: string;
    password: string;
    rememberMe?: boolean;
  }

  const onSubmit = async (data: FormData) => {
    const response = (await loginUser(data)) as TResponse;
    if (response?.statusCode === 201) {
      toast.success(response.message || "Login successful");
      router.back();
    }
    toast.success(response.message || "Login successful");
    router.back();
  };

  return (
    <div>
      <div className="flex flex-col justify-center items-center py-20 mt-6">
        <div className="w-[350px] lg:w-[600px]">
          <div className="border-b border-black/20 text-center pb-3 mb-5">
            <h2 className="text-3xl font-bold">Sign In</h2>
          </div>
          <form
            className="flex flex-col gap-4"
            onSubmit={handleSubmit(onSubmit)}
          >
            <input
              type="text"
              placeholder="Email/Number"
              className="border border-black/20 p-1.5 rounded"
              {...register("email", {
                required: "Email/Phone is required",
                validate: (value) => {
                  const isEmail = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);
                  const isPhone = /^\d{10,15}$/.test(value);
                  if (!isEmail && !isPhone) {
                    return "Enter a valid email or phone number";
                  }
                  return true;
                },
              })}
            />

            {/* Password Field */}
            <div className="flex flex-col">
              <label htmlFor="password" className="pb-2">
                Password
              </label>
              <input
                type="password"
                placeholder="Password"
                className="border border-black/20 p-1.5 rounded focus:border-black focus:outline-none "
                {...register("password", { required: "Password is required" })}
              />
              {errors.password && (
                <span className="text-red-500">
                  {String(errors.password.message)}
                </span>
              )}
            </div>
            <div className="flex items-center gap-2">
              <input
                type="checkbox"
                className="border-2"
                {...register("rememberMe")}
              />
              <label htmlFor="rememberMe" className="text-sm">
                Remember Me
              </label>
            </div>

            {/* Submit Button */}
            <button type="submit" className=" button-primary bg-primary py-2 px-4 rounded-md cursor-pointer hover:bg-primary/90 transition-colors text-white" >
              Login
            </button>
          </form>
          <div className="flex justify-center  gap-2 mt-4 text-md">
            <div className="mt-2 text-center  ">
              <Link
                href="/forgotpassword"
                className="text-primary pr-1 hover:underline"
              >
                Forgot Your Password?
              </Link>{" "}
              |
            </div>
            <div className="mt-2 text-center">
              <Link href="/register" className="text-primary  hover:underline">
                Registration
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SignIn;
