import * as z from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useEffect, useState } from "react";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "../../ui/form.js";
import { Input } from "../../ui/input.js";
import { Button } from "../../ui/button.js";
import { Loader } from "lucide-react";
import { RadioGroup, RadioGroupItem } from "../../ui/radio-group.js";
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from "../../ui/select.js";
import { toast } from "sonner";
import SubjectApi from "../../../services/Api/Admin/SubjectApi.js";

const formSchema = z.object({
  firstname: z.string().max(50),
  lastname: z.string().max(50),
  date_of_birth: z.string(),
  gender: z.enum(["m","f"]),
  subject_id: z.string().nonempty(),
});

export default function TeacherUpsertForm({ handleSubmit, values }) 
 {
  const isUpdate = Boolean(values);
  const [subjects, setSubjects] = useState([]);

  useEffect(() => {
    SubjectApi.all()
      .then(r => setSubjects(Array.isArray(r.data) ? r.data : r.data.data || []))
      .catch(() => setSubjects([]));
  }, []);

  const form = useForm({
    resolver: zodResolver(formSchema),
    defaultValues: {
      firstname: values?.firstname || "",
      lastname:  values?.lastname  || "",
      date_of_birth: values?.date_of_birth || "",
      gender:    values?.gender    || "m",
      subject_id: values?.subject?.id?.toString() || "",
    }
  });

  const { setError, formState:{ isSubmitting }, reset } = form;

  const onSubmit = async data => {
    const toastId = toast.loading(isUpdate ? "Updating teacher…" : "Creating teacher…");
    try {
      const res = await handleSubmit(data);
      toast.success(res.data.message);
      if (!isUpdate) reset();
      return res;
    } catch (err) {
      const errs = err?.response?.data?.errors;
      if (errs) Object.entries(errs).forEach(([f,m]) => setError(f,{message:m.join(", ")}));
      else toast.error("Error saving teacher");
      throw err;
    } finally { toast.dismiss(toastId); }
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
        <FormField control={form.control} name="firstname" render={({ field }) => (
          <FormItem>
            <FormLabel>First Name</FormLabel>
            <FormControl><Input {...field} /></FormControl>
            <FormMessage />
          </FormItem>
        )} />
        <FormField control={form.control} name="lastname" render={({ field }) => (
          <FormItem>
            <FormLabel>Last Name</FormLabel>
            <FormControl><Input {...field} /></FormControl>
            <FormMessage />
          </FormItem>
        )} />
        <FormField control={form.control} name="date_of_birth" render={({ field }) => (
          <FormItem>
            <FormLabel>Date of Birth</FormLabel>
            <FormControl><Input type="date" {...field} /></FormControl>
            <FormMessage />
          </FormItem>
        )} />
        <FormField control={form.control} name="gender" render={({ field }) => (
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
        )} />
        <FormField control={form.control} name="subject_id" render={({ field }) => (
          <FormItem>
            <FormLabel>Subject</FormLabel>
            <Select onValueChange={field.onChange} value={field.value}>
              <FormControl>
                <SelectTrigger><SelectValue placeholder="Select subject" /></SelectTrigger>
              </FormControl>
              <SelectContent>
                {subjects.map(s => (
                  <SelectItem key={s.id} value={s.id.toString()}>{s.name}</SelectItem>
                ))}
              </SelectContent>
            </Select>
            <FormMessage />
          </FormItem>
        )} />
        <Button type="submit" disabled={isSubmitting}>
          {isSubmitting ? "Saving…" : isUpdate ? "Update" : "Create"}
        </Button>
      </form>
    </Form>
  );
}