"use client";

import { useAuthActions } from "@convex-dev/auth/react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useConvexAuth } from "convex/react";
import { Eye, EyeOff, Loader2 } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { useForm } from "react-hook-form";
import * as z from "zod";

import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";

const formSchema = z
  .object({
    email: z.string().email("Invalid email address"),
    password: z.string().min(6, "Password must be at least 6 characters"),
    confirmPassword: z.string().optional(),
  })
  .refine(
    (data) => {
      // Only validate confirm password if it has a value (signup mode)
      if (data.confirmPassword !== undefined && data.confirmPassword !== "") {
        return data.password === data.confirmPassword;
      }
      return true;
    },
    {
      message: "Passwords do not match",
      path: ["confirmPassword"],
    },
  );

type FormData = z.infer<typeof formSchema>;

export function LoginForm({
  className,
  ...props
}: React.ComponentProps<"div">) {
  const { isAuthenticated, isLoading: isAuthLoading } = useConvexAuth();
  const router = useRouter();
  const { signIn } = useAuthActions();
  const [isSignUp, setIsSignUp] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [error, setError] = useState("");

  const form = useForm<FormData>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      email: "",
      password: "",
      confirmPassword: "",
    },
  });

  if (isAuthenticated) {
    router.push("/");
    return null;
  }

  const onSubmit = async (data: FormData) => {
    setError("");

    console.log({ data });
    // Additional validation for signup
    if (
      isSignUp &&
      (!data.confirmPassword || data.password !== data.confirmPassword)
    ) {
      setError("Passwords do not match");
      return;
    }

    setIsLoading(true);

    try {
      void signIn("password", {
        email: data.email,
        password: data.password,
        flow: isSignUp ? "signUp" : "signIn",
      });
      router.push("/");
    } catch (err) {
      console.error("Auth error:", err);
      const errorMessage = err instanceof Error ? err.message : `Failed to ${isSignUp ? "sign up" : "sign in"}. Please try again.`;
      setError(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  const toggleMode = () => {
    setIsSignUp(!isSignUp);
    setError("");
    form.clearErrors();
    form.setValue("confirmPassword", "");
  };

  return (
    <div className={cn("flex flex-col gap-6", className)} {...props}>
      <div className="flex flex-col items-center gap-2 text-center">
        <h1 className="text-2xl font-bold">
          {isSignUp ? "Create an account" : "Login to your account"}
        </h1>
        <p className="text-muted-foreground text-sm text-balance">
          {isSignUp
            ? "Enter your email below to create your account"
            : "Enter your email below to login to your account"}
        </p>
      </div>

      {error && (
        <div className="rounded-lg border border-destructive/50 bg-destructive/10 p-3 text-sm text-destructive">
          {error}
        </div>
      )}

      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
          <FormField
            control={form.control}
            name="email"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Email</FormLabel>
                <FormControl>
                  <Input
                    type="email"
                    placeholder="m@example.com"
                    disabled={isLoading || isAuthLoading}
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="password"
            render={({ field }) => (
              <FormItem>
                <div className="flex items-center">
                  <FormLabel>Password</FormLabel>
                  {!isSignUp && (
                    <a
                      href="#"
                      className="ml-auto text-sm underline-offset-4 hover:underline"
                      onClick={(e) => e.preventDefault()}
                    >
                      Forgot your password?
                    </a>
                  )}
                </div>
                <FormControl>
                  <div className="relative">
                    <Input
                      type={showPassword ? "text" : "password"}
                      disabled={isLoading || isAuthLoading}
                      {...field}
                    />
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
                      onClick={() => setShowPassword(!showPassword)}
                      disabled={isLoading || isAuthLoading}
                    >
                      {showPassword ? (
                        <EyeOff className="h-4 w-4" />
                      ) : (
                        <Eye className="h-4 w-4" />
                      )}
                      <span className="sr-only">
                        {showPassword ? "Hide password" : "Show password"}
                      </span>
                    </Button>
                  </div>
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          {isSignUp && (
            <FormField
              control={form.control}
              name="confirmPassword"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Confirm Password</FormLabel>
                  <FormControl>
                    <div className="relative">
                      <Input
                        type={showConfirmPassword ? "text" : "password"}
                        disabled={isLoading || isAuthLoading}
                        {...field}
                      />
                      <Button
                        type="button"
                        variant="ghost"
                        size="sm"
                        className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
                        onClick={() =>
                          setShowConfirmPassword(!showConfirmPassword)
                        }
                        disabled={isLoading || isAuthLoading}
                      >
                        {showConfirmPassword ? (
                          <EyeOff className="h-4 w-4" />
                        ) : (
                          <Eye className="h-4 w-4" />
                        )}
                        <span className="sr-only">
                          {showConfirmPassword
                            ? "Hide password"
                            : "Show password"}
                        </span>
                      </Button>
                    </div>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          )}

          <Button
            type="submit"
            className="w-full"
            disabled={isLoading || isAuthLoading}
          >
            {isLoading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                {isSignUp ? "Creating account..." : "Signing in..."}
              </>
            ) : (
              <>{isSignUp ? "Sign up" : "Sign in"}</>
            )}
          </Button>
        </form>
      </Form>

      <div className="text-center text-sm">
        {isSignUp ? (
          <>
            Already have an account?{" "}
            <button
              type="button"
              className="underline underline-offset-4 hover:text-primary"
              onClick={toggleMode}
              disabled={isLoading || isAuthLoading}
            >
              Sign in
            </button>
          </>
        ) : (
          <>
            Don&apos;t have an account?{" "}
            <button
              type="button"
              className="underline underline-offset-4 hover:text-primary"
              onClick={toggleMode}
              disabled={isLoading || isAuthLoading}
            >
              Sign up
            </button>
          </>
        )}
      </div>
    </div>
  );
}
