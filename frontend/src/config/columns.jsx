import { Button } from "../components/ui/button";

// STUDENT COLUMNS (with actions)
export function studentColumns(onEdit, onDelete) {
  return [
    {
      accessorKey: 'firstname',
      header: 'First Name',
      cell: info => info.getValue() || "—",
    },
    {
      accessorKey: 'lastname',
      header: 'Last Name',
      cell: info => info.getValue() || "—",
    },
    {
      accessorKey: 'email',
      header: 'Email',
      cell: info => info.getValue() || "—",
    },
    {
      accessorKey: 'degree.name',
      header: 'Degree',
      cell: ({ row }) => row.original.degree?.name || "—",
    },
    {
      accessorKey: 'gender',
      header: 'Gender',
      cell: ({ row }) => row.original.gender === "m" ? "Male" : row.original.gender === "f" ? "Female" : "—",
    },
    {
      accessorKey: 'date_of_birth',
      header: 'Birth Date',
      cell: info => info.getValue() || "—",
    },
    {
      accessorKey: 'blood_type',
      header: 'Blood Type',
      cell: info => info.getValue() || "—",
    },
    {
      accessorKey: 'student_parent_id',
      header: 'Parent ID',
      cell: info => info.getValue() || "—",
    },
        {
      header: "Actions",
      id: "actions",
      cell: ({ row }) => (
        <div className="flex gap-2">
          <Button onClick={() => onEdit(row.original)}>Edit</Button>
          <Button onClick={() => onDelete(row.original.id)} variant="destructive">Delete</Button>
        </div>
      ),
      enableSorting: false,
      enableFiltering: false,
    }
  ];
}

// TEACHER COLUMNS (with actions)
export function teacherColumns(onEdit, onDelete) {
  return [
    { accessorKey: 'id', header: 'ID', cell: info => info.getValue() },
    { accessorKey: 'name', header: 'Name', cell: info => info.getValue() },
    { accessorKey: 'email', header: 'Email', cell: info => info.getValue() },
    {
      accessorKey: 'subject.name',
      header: 'Subject',
      cell: ({ row }) => row.original.subject?.name || "—",
    },
    {
      header: "Actions",
      id: "actions",
      cell: ({ row }) => (
        <div className="flex gap-2">
          <Button
            size="sm"
            variant="outline"
            onClick={() => onEdit(row.original)}
          >
            Edit
          </Button>
          <Button
            size="sm"
            variant="destructive"
            onClick={() => {
              if (window.confirm("Delete this teacher?")) onDelete(row.original.id)
            }}
          >
            Delete
          </Button>
        </div>
      ),
      enableSorting: false,
      enableFiltering: false,
    }
  ];
}

// PARENT COLUMNS (with actions)
export function parentColumns(onEdit, onDelete) {
  return [
    {
      accessorKey: "firstname",
      header: "Firstname",
      cell: info => info.getValue()
    },
    {
      accessorKey: "lastname",
      header: "Lastname",
      cell: info => info.getValue()
    },
    {
      accessorKey: "email",
      header: "Email",
      cell: info => info.getValue()
    },
    {
      header: "Actions",
      id: "actions",
      cell: ({ row }) => (
        <div className="flex gap-2">
          <Button
            size="sm"
            variant="outline"
            onClick={() => onEdit(row.original)}
          >
            Edit
          </Button>
          <Button
            size="sm"
            variant="destructive"
            onClick={() => {
              if (window.confirm("Delete this parent?")) onDelete(row.original.id)
            }}
          >
            Delete
          </Button>
        </div>
      ),
      enableSorting: false,
      enableFiltering: false,
    }
  ];
}
