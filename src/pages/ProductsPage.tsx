import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { ColumnDef } from '@tanstack/react-table';
import { Plus, Upload, Download, Pencil, Trash } from 'lucide-react';
import { toast } from 'react-hot-toast';
import { DataTable } from '../components/DataTable';
import { Modal } from '../components/Modal';
import { FileUpload } from '../components/FileUpload';
import { Product } from '../types';
import { getCurrentUser } from '../lib/auth';

const columns: ColumnDef<Product>[] = [
  {
    accessorKey: 'sku',
    header: 'SKU',
  },
  {
    accessorKey: 'name',
    header: 'Name',
  },
  {
    accessorKey: 'description',
    header: 'Description',
  },
  {
    accessorKey: 'quantity',
    header: 'Quantity',
  },
  {
    accessorKey: 'unit',
    header: 'Unit',
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
          >
            <Pencil className="h-4 w-4 text-blue-600" />
          </button>
          <button
            onClick={() => {/* TODO: Implement delete */}}
            className="p-1 rounded-md hover:bg-gray-100"
          >
            <Trash className="h-4 w-4 text-red-600" />
          </button>
        </div>
      );
    },
  },
];

export const ProductsPage = () => {
  const [isImportModalOpen, setIsImportModalOpen] = useState(false);
  const user = getCurrentUser();
  const canEdit = user?.role === 'MANAGER' || user?.role === 'OPERATIONS';
  const queryClient = useQueryClient();

  const { data: products = [], isLoading } = useQuery({
    queryKey: ['products'],
    queryFn: async () => {
      // TODO: Replace with actual API call
      return [] as Product[];
    },
  });

  const importMutation = useMutation({
    mutationFn: async (file: File) => {
      // TODO: Implement file upload and processing
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['products'] });
      setIsImportModalOpen(false);
      toast.success('Products imported successfully');
    },
    onError: () => {
      toast.error('Failed to import products');
    },
  });

  const handleFileSelect = (file: File) => {
    importMutation.mutate(file);
  };

  const handleExport = () => {
    // TODO: Implement export functionality
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
          <h1 className="text-2xl font-bold text-gray-900">Products</h1>
          <p className="mt-1 text-sm text-gray-500">
            Manage your product inventory
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
              Add Product
            </button>
          </div>
        )}
      </div>

      <DataTable
        data={products}
        columns={columns}
        searchPlaceholder="Search products..."
      />

      <Modal
        isOpen={isImportModalOpen}
        onClose={() => setIsImportModalOpen(false)}
        title="Import Products"
      >
        <div className="space-y-4">
          <p className="text-sm text-gray-500">
            Upload an Excel file containing your products data. The file should
            include columns for SKU, Name, Description, Quantity, and Unit.
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