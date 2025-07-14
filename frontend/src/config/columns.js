// src/config/columns.js

export const studentColumns = [
  { header: 'ID',        accessorKey: 'id' },
  { header: 'Name',      accessorKey: 'name' },
  { header: 'Email',     accessorKey: 'email' },
  // …any other student fields
];

export const teacherColumns = [
  { header: 'ID',        accessorKey: 'id' },
  { header: 'Name',      accessorKey: 'name' },
  { header: 'Subject',   accessorKey: 'subject' },
  // …any other teacher fields
];

export const parentColumns = [
  { header: 'ID',           accessorKey: 'id' },
  { header: 'Name',         accessorKey: 'name' },
  { header: 'Child Count',  accessorKey: 'children_count' }, 
  { header: 'Email',        accessorKey: 'email' },
  // …any other parent fields
];
