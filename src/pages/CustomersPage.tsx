import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { ColumnDef } from '@tanstack/react-table';
import { Plus, Upload, Download, Pencil, Trash, Mail, Phone } from 'lucide-react';
import { toast } from 'react-hot-toast';
import { DataTable } from '../components/DataTable';
import { Modal } from '../components/Modal';
import { FileUpload } from '../components/FileUpload';
import { Customer } from '../types';
import { getCurrentUser } from '../lib/auth';

const columns: ColumnDef<Customer>[] = [
  {
    accessorKey: 'name',
    header: 'Name',
  },
  {
    accessorKey: 'address',
    header: 'Address',
  },
  {
    accessorKey: 'contactPerson',
    header: 'Contact Person',
  },
  {
    accessorKey: 'phone',
    header: 'Phone',
    cell: ({ row }) => (
      <a
        href={`tel:${row.original.phone}`}
        className="flex items-center text-blue-600 hover:text-blue-800"
      >
        <Phone className="h-4 w-4 mr-1" />
        {row.original.phone}
      </a>
    ),
  },
  {
    accessorKey: 'email',
    header: 'Email',
    cell: ({ row }) => (
      <a
        href={`mailto:${row.original.email}`}
        className="flex items-center text-blue-600 hover:text-blue-800"
      >
        <Mail className="h-4 w-4 mr-1" />
        {row.original.email}
      </a>
    ),
  },
  {
    id: 'actions',
    header: 'Actions',
    cell: ({ row }) => {
      const user = getCurrentUser();
      const canEdit = user?.role === 'MANAGER' || user?.role === 'OPERATIONS';

      if (!canEdit) return null;

      return (
        <div className="flex gap-2">
          <button
            onClick={() => {/* TODO: Implement edit */}}
            className="p-1 rounded-md hover:bg-gray-100"
            title="Edit customer"
          >
            <Pencil className="h-4 w-4 text-blue-600" />
          </button>
          <button
            onClick={() => {/* TODO: Implement delete */}}
            className="p-1 rounded-md hover:bg-gray-100"
            title="Delete customer"
          >
            <Trash className="h-4 w-4 text-red-600" />
          </button>
        </div>
      );
    },
  },
];

export const CustomersPage = () => {
  const [isImportModalOpen, setIsImportModalOpen] = useState(false);
  const user = getCurrentUser();
  const canEdit = user?.role === 'MANAGER' || user?.role === 'OPERATIONS';
  const queryClient = useQueryClient();

  const { data: customers = [], isLoading } = useQuery({
    queryKey: ['customers'],
    queryFn: async () => {
      // TODO: Replace with actual API call
      return [] as Customer[];
    },
  });

  const importMutation = useMutation({
    mutationFn: async (file: File) => {
      // TODO: Implement file upload and processing
      const formData = new FormData();
      formData.append('file', file);
      // await axios.post('/api/customers/import', formData);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['customers'] });
      setIsImportModalOpen(false);
      toast.success('Customers imported successfully');
    },
    onError: () => {
      toast.error('Failed to import customers');
    },
  });

  const handleFileSelect = (file: File) => {
    importMutation.mutate(file);
  };

  const handleExport = async () => {
    try {
      // TODO: Implement export functionality
      // const response = await axios.get('/api/customers/export', { responseType: 'blob' });
      // const url = window.URL.createObjectURL(new Blob([response.data]));
      // const link = document.createElement('a');
      // link.href = url;
      // link.setAttribute('download', 'customers.xlsx');
      // document.body.appendChild(link);
      // link.click();
      // link.remove();
      toast.success('Customers exported successfully');
    } catch (error) {
      toast.error('Failed to export customers');
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="sm:flex sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Customers</h1>
          <p className="mt-1 text-sm text-gray-500">
            Manage your customer database
          </p>
        </div>
        {canEdit && (
          <div className="mt-4 sm:mt-0 sm:flex sm:gap-3">
            <button
              onClick={() => setIsImportModalOpen(true)}
              className="inline-flex items-center justify-center rounded-md border border-transparent bg-blue-600 px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 sm:w-auto"
            >
              <Upload className="h-4 w-4 mr-2" />
              Import
            </button>
            <button
              onClick={handleExport}
              className="mt-3 sm:mt-0 inline-flex items-center justify-center rounded-md border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 shadow-sm hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 sm:w-auto"
            >
              <Download className="h-4 w-4 mr-2" />
              Export
            </button>
            <button className="mt-3 sm:mt-0 inline-flex items-center justify-center rounded-md border border-transparent bg-blue-600 px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 sm:w-auto">
              <Plus className="h-4 w-4 mr-2" />
              Add Customer
            </button>
          </div>
        )}
      </div>

      <DataTable
        data={customers}
        columns={columns}
        searchPlaceholder="Search customers..."
      />

      <Modal
        isOpen={isImportModalOpen}
        onClose={() => setIsImportModalOpen(false)}
        title="Import Customers"
      >
        <div className="space-y-4">
          <p className="text-sm text-gray-500">
            Upload an Excel file containing your customers data. The file should
            include columns for Name, Address, Contact Person, Phone, and Email.
          </p>
          <FileUpload
            onFileSelect={handleFileSelect}
            accept={{
              'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet': ['.xlsx'],
              'application/vnd.ms-excel': ['.xls'],
            }}
          />
        </div>
      </Modal>
    </div>
  );
};