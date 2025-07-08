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
import {
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue
} from "../../ui/select.js";
import { toast } from "sonner";
import { useEffect, useState } from "react";
import parentApi from "../../../services/Api/Admin/ParentApi.js";

// 🧠 Define student form schema
const formSchema = z.object({
  firstname: z.string().max(50),
  lastname: z.string().max(50),
  date_of_birth: z.string(),
  gender: z.enum(["m", "f"]),
  blood_type: z.string(),
  student_parent_id: z.string().min(1, "Please select a parent."),
  email: z.string().email().min(2).max(30),
  password: z.string().min(8).max(30)
});

export default function StudentUpsertForm({ handleSubmit, values }) {
  const isUpdate = Boolean(values);
  const [parents, setParents] = useState([]);

  const form = useForm({
    resolver: zodResolver(formSchema),
    defaultValues: values || {}
  });

  const { setError, formState: { isSubmitting }, reset } = form;

  useEffect(() => {
    parentApi.all(['id', 'firstname', 'lastname'])
      .then(({ data }) => setParents(data.data || []));
  }, []);

  const onSubmit = async (formData) => {
    const loader = toast.loading(isUpdate ? "Updating student..." : "Adding student...");

    try {
      const { status, data } = await handleSubmit(formData);
      if (status === 200) {
        toast.success(data.message);
        if (!isUpdate) reset(); // Reset only if it's a create
      }
    } catch (error) {
      const responseErrors = error?.response?.data?.errors;
      if (responseErrors) {
        Object.entries(responseErrors).forEach(([field, messages]) => {
          setError(field, { message: messages.join(", ") });
        });
      } else {
        toast.error("Unexpected error occurred.");
      }
    } finally {
      toast.dismiss(loader);
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
                <RadioGroup
                  onValueChange={field.onChange}
                  defaultValue={field.value}
                  className="flex gap-4"
                >
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
                  <SelectTrigger><SelectValue placeholder="Select Blood Type" /></SelectTrigger>
                </FormControl>
                <SelectContent>
                  {["O-", "O+", "A+", "A-", "B+", "B-", "AB+", "AB-"].map((bt, i) => (
                    <SelectItem key={i} value={bt}>{bt}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="student_parent_id"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Parent</FormLabel>
              <Select onValueChange={field.onChange} defaultValue={field.value}>
                <FormControl>
                  <SelectTrigger><SelectValue placeholder="Select Parent" /></SelectTrigger>
                </FormControl>
                <SelectContent>
                  {parents.length ? (
                    parents.map((parent) => (
                      <SelectItem
                        key={parent.id}
                        value={parent.id.toString()}
                      >
                        {parent.firstname} {parent.lastname}
                      </SelectItem>
                    ))
                  ) : (
                    <SelectItem value="" disabled>No parents found</SelectItem>
                  )}
                </SelectContent>
              </Select>
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

        <Button type="submit" disabled={isSubmitting} className="mt-2">
          {isSubmitting && <Loader className="mr-2 animate-spin" />}
          {isUpdate ? "Update" : "Create"}
        </Button>

      </form>
    </Form>
  );
}
