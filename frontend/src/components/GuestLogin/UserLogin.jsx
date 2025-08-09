import * as z from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  Form,
  FormField,
  FormItem,
  FormLabel,
  FormControl,
  FormMessage,
} from "../ui/form";
import { Input } from "../ui/input";
import { Button } from "../ui/button";
import { Loader } from "lucide-react";
import { useNavigate, Navigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import { redirectToDashboard } from "../../router"; // must return route string

const schema = z.object({
  email:    z.string().email(),
  password: z.string().min(8),
});

export default function UserLogin() {
  const { login, user, loading } = useAuth();
  const navigate  = useNavigate();

  const form = useForm({
    resolver: zodResolver(schema),
    defaultValues: {
      email: "mohamed@belymam.com",
      password: "123456789",
    }
  });

  // 1. Loader while auth in progress
  if (loading) return <div>Chargement…</div>;

  // 2. If already logged in, redirect according to role/degree
  if (user) {
    if (user.role === "student") {
      if (user.degree_id) {
        return <Navigate to={`/student/dashboard/${user.degree_id}`} replace />;
      } else {
        // Option: show info or block, or fallback
        return <div>No degree assigned. Please contact admin.</div>;
      }
    }
    // For other roles
    return <Navigate to={redirectToDashboard(user.role)} replace />;
  }

  // 3. Handle login submit
  const onSubmit = async ({ email, password }) => {
    try {
      const user = await login({ email, password });
      // If login successful, redirect according to role/degree
      if (user.role === "student") {
        if (user.degree_id) {
          navigate(`/student/dashboard/${user.degree_id}`, { replace: true });
        } else {
          // Optional: Handle case where student has no degree
          navigate("/no-degree", { replace: true });
        }
      } else {
        navigate(redirectToDashboard(user.role), { replace: true });
      }
    } catch (err) {
      form.setError("email", {
        type: "manual",
        message: err.response?.data?.message || "Login failed",
      });
    }
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="max-w-sm mx-auto space-y-4">
        <FormField
          name="email"
          control={form.control}
          render={({ field }) => (
            <FormItem>
              <FormLabel>Email</FormLabel>
              <FormControl>
                <Input type="email" {...field} autoComplete="username" />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          name="password"
          control={form.control}
          render={({ field }) => (
            <FormItem>
              <FormLabel>Password</FormLabel>
              <FormControl>
                <Input type="password" {...field} autoComplete="current-password" />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <Button
          type="submit"
          disabled={form.formState.isSubmitting}
          className="w-full"
        >
          {form.formState.isSubmitting && (
            <Loader className="mr-2 animate-spin" />
          )}
          Log In
        </Button>
      </form>
    </Form>
  );
}
