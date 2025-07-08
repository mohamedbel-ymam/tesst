import * as z from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  Form, FormControl, FormField, FormItem, FormLabel, FormMessage
} from "../../ui/form.js";
import { Input } from "../../ui/input.js";
import { Button } from "../../ui/button.js";
import { Loader } from "lucide-react";
import { RadioGroup, RadioGroupItem } from "../../ui/radio-group.js";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../../ui/select.js";
import { Textarea } from "../../ui/textarea.js";
import { toast } from "sonner";

// 🧠 You may want to fetch this from the backend
const BLOOD_TYPES = ['O-', 'O+', 'A+', 'A-', 'B+', 'B-', 'AB+', 'AB-'];

const formSchema = z.object({
  firstname: z.string().max(50),
  lastname: z.string().max(50),
  date_of_birth: z.string(),
  gender: z.enum(["m", "f"]),
  blood_type: z.string(),
  address: z.string().max(255),
  phone: z.string().max(10),
  email: z.string().email().min(2).max(30),
  password: z.string().min(8).max(30)
});

export default function ParentUpsertForm({ handleSubmit, values }) {
  const isUpdate = Boolean(values);

  const form = useForm({
    resolver: zodResolver(formSchema),
    defaultValues: {
  firstname: values?.firstname ?? "",
  lastname: values?.lastname ?? "",
  date_of_birth: values?.date_of_birth ?? "",
  gender: values?.gender ?? "m",
  blood_type: values?.blood_type ?? BLOOD_TYPES[0],
  address: values?.address ?? "",
  phone: values?.phone ?? "",
  email: values?.email ?? "",
  password: ""
}
  });

  const { setError, formState: { isSubmitting }, reset } = form;

  const onSubmit = async (formData) => {
    const loaderMsg = isUpdate ? "Updating parent..." : "Creating parent...";
    const toastId = toast.loading(loaderMsg);

    try {
      const { status, data } = await handleSubmit(formData);
      if (status === 200) {
        toast.success(data.message);
        if (!isUpdate) reset(); // reset only if adding
      }
    } catch (error) {
      const responseErrors = error?.response?.data?.errors;
      if (responseErrors) {
        Object.entries(responseErrors).forEach(([field, messages]) => {
          setError(field, { message: messages.join(", ") });
        });
      } else {
        toast.error("Something went wrong.");
      }
    } finally {
      toast.dismiss(toastId);
    }
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">

        <FormField
          control={form.control}
          name="firstname"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Firstname</FormLabel>
              <FormControl><Input {...field} /></FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="lastname"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Lastname</FormLabel>
              <FormControl><Input {...field} /></FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="date_of_birth"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Date of Birth</FormLabel>
              <FormControl><Input type="date" {...field} /></FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="gender"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Gender</FormLabel>
              <FormControl>
                <RadioGroup onValueChange={field.onChange} defaultValue={field.value} className="flex space-x-4">
                  <RadioGroupItem value="m" /> Male
                  <RadioGroupItem value="f" /> Female
                </RadioGroup>
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="blood_type"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Blood Type</FormLabel>
              <Select onValueChange={field.onChange} defaultValue={field.value}>
                <FormControl>
                  <SelectTrigger><SelectValue placeholder="Choose" /></SelectTrigger>
                </FormControl>
                <SelectContent>
                  {BLOOD_TYPES.map((bt, idx) => (
                    <SelectItem key={idx} value={bt}>{bt}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="address"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Address</FormLabel>
              <FormControl><Textarea rows={3} {...field} /></FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="phone"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Phone</FormLabel>
              <FormControl><Input type="tel" {...field} /></FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="email"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Email</FormLabel>
              <FormControl><Input {...field} /></FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="password"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Password</FormLabel>
              <FormControl><Input type="password" {...field} /></FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <Button type="submit" className="mt-2" disabled={isSubmitting}>
          {isSubmitting && <Loader className="mr-2 animate-spin" />} 
          {isUpdate ? "Update" : "Create"}
        </Button>

      </form>
    </Form>
  );
}
