import * as z from "zod";
import { axiosClient } from "../../../api/axios.js";
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
import { toast } from "sonner";
import { useEffect, useState } from "react";
import UserApi from "../../../services/Api/UserApi.js";

const BLOOD_TYPES = ['O-', 'O+', 'A+', 'A-', 'B+', 'B-', 'AB+', 'AB-'];

const formSchema = z.object({
  firstname: z.string().min(2).max(50),
  lastname: z.string().min(2).max(50),
  date_of_birth: z.string(),
  gender: z.enum(["m", "f"]),
  blood_type: z.string(),
  student_parent_id: z.string().min(1, "Please select a parent."),
  degree_id: z.string().min(1, "Please select a degree."),
  address: z.string().min(3, "Address is required"),
  phone: z.string().min(3, "Phone is required"),
  email: z.string().email().min(2).max(50),
  password: z.string().min(8).max(30).optional(),
});

export default function StudentUpsertForm({ handleSubmit, values, onCancel }) {
  const isUpdate = Boolean(values?.id);

  const [parents, setParents] = useState([]);
  const [degrees, setDegrees] = useState([]);
  const [parentsLoading, setParentsLoading] = useState(true);
  const [degreesLoading, setDegreesLoading] = useState(true);

  // Parents
  useEffect(() => {
    setParentsLoading(true);
    UserApi.parents()
      .then((resp) => setParents(resp?.data?.data || []))
      .catch(() => setParents([]))
      .finally(() => setParentsLoading(false));
  }, []);

  // Degrees
  useEffect(() => {
    setDegreesLoading(true);
    axiosClient
      .get("/admin/degrees", { params: { per_page: 1000 } })
      .then((res) => {
        const payload = res.data?.data || res.data?.degrees || res.data || [];
        setDegrees(Array.isArray(payload) ? payload : []);
      })
      .catch(() => setDegrees([]))
      .finally(() => setDegreesLoading(false));
  }, []);

  const form = useForm({
    resolver: zodResolver(formSchema),
    defaultValues: {
      firstname: values?.firstname || "",
      lastname: values?.lastname || "",
      date_of_birth: values?.date_of_birth || "",
      gender: values?.gender || "m",
      blood_type: values?.blood_type || BLOOD_TYPES[0],
      student_parent_id: values?.student_parent_id?.toString() || "",
      degree_id: values?.degree_id?.toString() || "",
      address: values?.address || "",
      phone: values?.phone || "",
      email: values?.email || "",
      password: "",
      id: values?.id || undefined,
    },
  });

  // Keep form in sync when switching between add/edit
  useEffect(() => {
    form.reset({
      firstname: values?.firstname || "",
      lastname: values?.lastname || "",
      date_of_birth: values?.date_of_birth || "",
      gender: values?.gender || "m",
      blood_type: values?.blood_type || BLOOD_TYPES[0],
      student_parent_id: values?.student_parent_id?.toString() || "",
      degree_id: values?.degree_id?.toString() || "",
      address: values?.address || "",
      phone: values?.phone || "",
      email: values?.email || "",
      password: "",
      id: values?.id || undefined,
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [values?.id]); // reset only when switching record

  const { setError, formState: { isSubmitting } } = form;

  const onSubmit = async (formData) => {
    const loader = toast.loading(isUpdate ? "Updating student..." : "Creating student...");
    try {
      if (isUpdate && !formData.password) delete formData.password;
      if (isUpdate) formData.id = values.id;

      // Coerce IDs (Select returns strings)
      formData.degree_id = parseInt(formData.degree_id, 10);
      formData.student_parent_id = parseInt(formData.student_parent_id, 10);

      const { status, data } = await handleSubmit(formData);
      if (status === 200 || status === 201) {
        toast.success(data?.message || "Saved!");
        form.reset();
        onCancel?.();
      }
    } catch (error) {
      const responseErrors = error?.response?.data?.errors;
      if (responseErrors) {
        Object.entries(responseErrors).forEach(([field, messages]) => {
          setError(field, { message: (messages || []).join(", ") });
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
                <RadioGroup onValueChange={field.onChange} value={field.value} className="flex gap-4">
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
              <Select onValueChange={field.onChange} value={field.value}>
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder="Select Blood Type" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  {BLOOD_TYPES.map((bt) => (
                    <SelectItem key={bt} value={bt}>{bt}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="degree_id"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Degree</FormLabel>
              <Select onValueChange={field.onChange} value={field.value}>
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder={degreesLoading ? "Loading degrees..." : "Select Degree"} />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  {degreesLoading && (
                    <SelectItem value="loading" disabled>Loading…</SelectItem>
                  )}
                  {!degreesLoading && degrees.length === 0 && (
                    <SelectItem value="none" disabled>No degrees found</SelectItem>
                  )}
                  {!degreesLoading && degrees.length > 0 && degrees.map((degree) => {
                    const id = (degree.id ?? degree.value)?.toString();
                    const label = degree.name ?? degree.title ?? `Degree #${degree.id}`;
                    return (
                      <SelectItem key={id} value={id}>
                        {label}
                      </SelectItem>
                    );
                  })}
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
              <Select onValueChange={field.onChange} value={field.value}>
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder={parentsLoading ? "Loading parents..." : "Select Parent"} />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  {parentsLoading && (
                    <SelectItem value="loading" disabled>Loading…</SelectItem>
                  )}
                  {!parentsLoading && parents.length === 0 && (
                    <SelectItem value="none" disabled>No parents found</SelectItem>
                  )}
                  {!parentsLoading && parents.length > 0 && parents.map((p) => (
                    <SelectItem key={p.id} value={p.id.toString()}>
                      {p.firstname} {p.lastname}
                    </SelectItem>
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
              <FormControl><Input {...field} /></FormControl>
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
              <FormControl><Input {...field} /></FormControl>
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

        {!isUpdate && (
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
        )}

        {isUpdate && (
          <FormField
            control={form.control}
            name="password"
            render={({ field }) => (
              <FormItem>
                <FormLabel>New Password (optional)</FormLabel>
                <FormControl>
                  <Input type="password" {...field} placeholder="Leave blank to keep current password" />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        )}

        <div className="flex gap-2">
          <Button type="submit" disabled={isSubmitting}>
            {isSubmitting && <Loader className="mr-2 animate-spin" />}
            {isUpdate ? "Update" : "Create"}
          </Button>
          {isUpdate && onCancel && (
            <Button type="button" variant="outline" onClick={onCancel}>
              Cancel
            </Button>
          )}
        </div>
      </form>
    </Form>
  );
}
