import { Button } from "@/components/ui/button";
import {
  Card,
  CardAction,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "@/components/ui/toast"
import { Link } from "react-router";
import { useForm, type SubmitHandler } from "react-hook-form";
import axios from "axios";

interface LoginInputs {
  email: string;
  password: string;
}

const apiUrl = import.meta.env.VITE_API_URL;

export const Login = () => {
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<LoginInputs>();
  const onSubmit: SubmitHandler<LoginInputs> = async (data) => {
    const result = await axios.post(apiUrl + "api/auth/sign-in/email", {
      ...data,
    });

    if (result.status !== 200) {
      toast.
    }
  };

  return (
    <Card className="w-full max-w-sm">
      <CardHeader>
        <CardTitle>Login to your account</CardTitle>
        <CardAction>
          <Button variant="link">Login</Button>
        </CardAction>
      </CardHeader>
      <CardContent>
        <form id="login-form" onSubmit={handleSubmit(onSubmit)}>
          <div className="flex flex-col gap-6">
            <div className="grid gap-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                placeholder="m@example.com"
                required
                {...register("email")}
              />
              {errors.email && (
                <span className="text-red-400">errors.name.message</span>
              )}
            </div>
            <div className="grid gap-2">
              <div className="flex items-center">
                <Label htmlFor="password">Password</Label>
                <a
                  href="#"
                  className="ml-auto inline-block text-sm underline-offset-4 hover:underline"
                >
                  Forgot your password?
                </a>
              </div>
              <Input
                id="password"
                type="password"
                required
                {...register("password")}
              />
              {errors.password && (
                <span className="text-red-400">errors.password.message</span>
              )}
            </div>
          </div>
        </form>
      </CardContent>
      <CardFooter className="flex-col gap-2">
        <Button
          type="submit"
          form="login-form"
          className="w-full cursor-pointer"
          disabled={isSubmitting}
        >
          {isSubmitting ? "Logging in..." : "Login"}
        </Button>
        <h3 className="w-full text-center">
          Don't have an account?{" "}
          <Link to="/sign-up" className="underline">
            Sign Up{" "}
          </Link>
        </h3>
      </CardFooter>
    </Card>
  );
};
