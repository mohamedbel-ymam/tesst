import { useState, useEffect } from "react";
import { toast } from "sonner";
import { Trash2Icon } from "lucide-react";
import { DataTable } from "./DataTable.jsx";
import { DataTableColumnHeader } from "./DataTableColumnsHeader.jsx";
import ParentApi from "../../../services/Api/Admin/ParentApi.js";
import ParentUpsertForm from "../Forms/ParentUpsertForm.jsx";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "../../ui/alert-dialog.jsx";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetDescription,
  SheetTrigger,
} from "../../ui/sheet.jsx";
import { Button } from "../../ui/button.js";

// Controlled list and refresh callback
export default function AdminParentList({ data = [], refreshList }) {
  const usingProps = typeof refreshList === "function";
  const [localData, setLocalData] = useState([]);
  const parentsData = usingProps ? data : localData;

  // Internal fetch if no refreshList provided
  const fetchData = async () => {
    try {
      const resp = await ParentApi.all();
      const list = Array.isArray(resp.data)
        ? resp.data
        : Array.isArray(resp.data.data)
        ? resp.data.data
        : [];
      setLocalData(list);
    } catch (e) {
      console.error("Failed to load parents:", e);
    }
  };

  useEffect(() => {
    if (!usingProps) fetchData();
  }, []);

  const handleRefresh = async () => {
    if (usingProps) await refreshList();
    else await fetchData();
  };

  // Columns definition
  const AdminParentColumns = [
    {
      accessorKey: "id",
      header: ({ column }) => <DataTableColumnHeader column={column} title="#ID" />,
    },
    {
      accessorKey: "firstname",
      header: ({ column }) => <DataTableColumnHeader column={column} title="Firstname" />,
    },
    {
      accessorKey: "lastname",
      header: ({ column }) => <DataTableColumnHeader column={column} title="Lastname" />,
    },
    {
      accessorKey: "date_of_birth",
      header: ({ column }) => <DataTableColumnHeader column={column} title="Date of Birth" />,
    },
    {
      accessorKey: "gender",
      header: ({ column }) => <DataTableColumnHeader column={column} title="Gender" />,
      cell: ({ row }) => (row.getValue("gender") === "m" ? "Male" : "Female"),
    },
    {
      accessorKey: "blood_type",
      header: ({ column }) => <DataTableColumnHeader column={column} title="Blood Type" />,
    },
    {
      accessorKey: "address",
      header: ({ column }) => <DataTableColumnHeader column={column} title="Address" />,
    },
    {
      accessorKey: "phone",
      header: ({ column }) => <DataTableColumnHeader column={column} title="Phone" />,
      cell: ({ row }) => <div className="text-right font-medium">{row.getValue("phone")}</div>,
    },
    {
      accessorKey: "email",
      header: ({ column }) => <DataTableColumnHeader column={column} title="Email" />,
    },
    {
      accessorKey: "formatted_updated_at",
      header: ({ column }) => <DataTableColumnHeader column={column} title="Updated At" />,
      cell: ({ row }) => <div className="text-right font-medium">{row.getValue("formatted_updated_at")}</div>,
    },
    {
      id: "actions",
      cell: ({ row }) => {
        const parent = row.original;
        const [openUpdate, setOpenUpdate] = useState(false);

        // Update handler
        const onUpdate = async (vals) => {
          const res = await ParentApi.update(parent.id, vals);
          await handleRefresh();
          setOpenUpdate(false);
          return res;
        };

        // Delete handler
        const onDelete = async () => {
          const toastId = toast.loading("Deleting...");
          await ParentApi.delete(parent.id);
          toast.dismiss(toastId);
          toast.success("Parent deleted", { icon: <Trash2Icon /> });
          await handleRefresh();
        };

        return (
          <div className="flex gap-x-2">
            {/* Update sheet */}
            <Sheet open={openUpdate} onOpenChange={setOpenUpdate}>
              <SheetTrigger asChild>
                <Button size="sm" variant="outline">Update</Button>
              </SheetTrigger>
              <SheetContent>
                <SheetHeader>
                  <SheetTitle>Update {parent.firstname} {parent.lastname}</SheetTitle>
                  <SheetDescription>Modify the information and click save.</SheetDescription>
                </SheetHeader>
                <div className="p-4">
                  <ParentUpsertForm values={parent} handleSubmit={onUpdate} />
                </div>
              </SheetContent>
            </Sheet>

            {/* Delete dialog */}
            <AlertDialog>
              <AlertDialogTrigger asChild>
                <Button size="sm" variant="destructive">Delete</Button>
              </AlertDialogTrigger>
              <AlertDialogContent>
                <AlertDialogHeader>
                  <AlertDialogTitle>Delete {parent.firstname}?</AlertDialogTitle>
                  <AlertDialogDescription>This action cannot be undone.</AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                  <AlertDialogCancel>Cancel</AlertDialogCancel>
                  <AlertDialogAction onClick={onDelete}>Delete</AlertDialogAction>
                </AlertDialogFooter>
              </AlertDialogContent>
            </AlertDialog>
          </div>
        );
      },
    },
  ];

  return <DataTable columns={AdminParentColumns} data={parentsData} />;
}
