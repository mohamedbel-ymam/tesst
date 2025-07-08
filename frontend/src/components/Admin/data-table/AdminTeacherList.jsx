import { useState, useEffect } from "react";
import { toast } from "sonner";
import { Trash2Icon } from "lucide-react";
import { DataTable } from "./DataTable.jsx";
import { DataTableColumnHeader } from "./DataTableColumnsHeader.jsx";
import TeacherApi from "../../../services/Api/Admin/TeacherApi.js";
import TeacherUpsertForm from "../Forms/TeacherUpsertForm.jsx";
import {
  AlertDialog,
  AlertDialogTrigger,
  AlertDialogContent,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogCancel,
  AlertDialogAction
} from "../../ui/alert-dialog.jsx";
import {
  Sheet,
  SheetTrigger,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetDescription
} from "../../ui/sheet.jsx";
import { Button } from "../../ui/button.js";

export default function AdminTeacherList({ data = [], refreshList }) {
  const [localData, setLocalData] = useState([]);
  const usingProps = typeof refreshList === 'function';
  const tableData = usingProps ? data : localData;

  const fetchData = async () => {
    try {
      const resp = await TeacherApi.all();
      const list = Array.isArray(resp.data)
        ? resp.data
        : Array.isArray(resp.data.data)
        ? resp.data.data
        : [];
      setLocalData(list);
    } catch (e) {
      console.error("Failed to load teachers:", e);
    }
  };

  useEffect(() => {
    if (!usingProps) fetchData();
  }, []);

  const handleRefresh = async () => {
    if (usingProps) await refreshList();
    else await fetchData();
  };

  const columns = [
    {
      accessorKey: 'id',
      header: ({ column }) => <DataTableColumnHeader column={column} title="#ID" />
    },
    {
      accessorKey: 'firstname',
      header: ({ column }) => <DataTableColumnHeader column={column} title="First Name" />
    },
    {
      accessorKey: 'lastname',
      header: ({ column }) => <DataTableColumnHeader column={column} title="Last Name" />
    },
    {
      accessorKey: 'subject.name',
      header: ({ column }) => <DataTableColumnHeader column={column} title="Subject" />
    },
    {
      accessorKey: 'email',
      header: ({ column }) => <DataTableColumnHeader column={column} title="Email" />
    },
    {
      id: 'actions',
      cell: ({ row }) => {
        const teacher = row.original;
        const [open, setOpen] = useState(false);

        const onUpdate = async (vals) => {
          const res = await TeacherApi.update(teacher.id, vals);
          await handleRefresh();
          setOpen(false);
          return res;
        };

        const onDelete = async () => {
          const id = toast.loading('Deleting...');
          await TeacherApi.delete(teacher.id);
          toast.dismiss(id);
          toast.success('Teacher deleted', { icon: <Trash2Icon /> });
          await handleRefresh();
        };

        return (
          <div className="flex gap-2">
            <Sheet open={open} onOpenChange={setOpen}>
              <SheetTrigger asChild>
                <Button size="sm" variant="outline">Update</Button>
              </SheetTrigger>
              <SheetContent>
                <SheetHeader>
                  <SheetTitle>Update {teacher.firstname} {teacher.lastname}</SheetTitle>
                  <SheetDescription>Modify and save.</SheetDescription>
                </SheetHeader>
                <div className="p-4">
                  <TeacherUpsertForm values={teacher} handleSubmit={onUpdate} />
                </div>
              </SheetContent>
            </Sheet>

            <AlertDialog>
              <AlertDialogTrigger asChild>
                <Button size="sm" variant="destructive">Delete</Button>
              </AlertDialogTrigger>
              <AlertDialogContent>
                <AlertDialogHeader>
                  <AlertDialogTitle>Delete {teacher.firstname}?</AlertDialogTitle>
                  <AlertDialogDescription>Cannot undo.</AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                  <AlertDialogCancel>Cancel</AlertDialogCancel>
                  <AlertDialogAction onClick={onDelete}>Delete</AlertDialogAction>
                </AlertDialogFooter>
              </AlertDialogContent>
            </AlertDialog>
          </div>
        );
      }
    }
  ];

  return <DataTable columns={columns} data={tableData} />;
}
