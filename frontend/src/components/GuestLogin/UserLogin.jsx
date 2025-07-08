import * as z from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Form, FormField, FormItem, FormLabel, FormControl, FormMessage } from "../ui/form";
import { Input } from "../ui/input";
import { Button } from "../ui/button";
import { Loader } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import { redirectToDashboard } from "../../router";

const schema = z.object({
  email:    z.string().email(),
  password: z.string().min(8),
});

export default function UserLogin() {
  const { login } = useAuth();
  const navigate  = useNavigate();
  const form = useForm({ resolver: zodResolver(schema) });
  const onSubmit = async ({email,password}) => {
    try {
      const res = await login(email,password);
      navigate(redirectToDashboard(res.data.user.role));
    } catch (err) {
      form.setError("email",{message:err.response?.data?.message||"Login failed"});
    }
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="max-w-sm mx-auto space-y-4">
        <FormField name="email" control={form.control} render={({field})=>(
          <FormItem>
            <FormLabel>Email</FormLabel>
            <FormControl><Input {...field} /></FormControl>
            <FormMessage/>
          </FormItem>
        )}/>
        <FormField name="password" control={form.control} render={({field})=>(
          <FormItem>
            <FormLabel>Password</FormLabel>
            <FormControl><Input type="password" {...field} /></FormControl>
            <FormMessage/>
          </FormItem>
        )}/>
        <Button type="submit" disabled={form.formState.isSubmitting} className="w-full">
          {form.formState.isSubmitting && <Loader className="mr-2 animate-spin"/>}
          Log In
        </Button>
      </form>
    </Form>
  );
}
