
import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { ColumnDef } from '@tanstack/react-table';
import { Plus, Pencil, Trash, Truck } from 'lucide-react';
import { toast } from 'react-hot-toast';
import { useForm } from 'react-hook-form';
import { DataTable } from '../components/DataTable';
import { Modal } from '../components/Modal';
import { Delivery, Vehicle } from '../types';

interface OperationsFormData {
  CustomerName: string;
  Address: string;
  ProductWeight: number;
  status: 'ASSIGNED' | 'COMPLETED' | 'PENDING';
}

const columns: ColumnDef<Delivery>[] = [
  {
    accessorKey: 'customerId',
    header: 'Customer Acc Number',
  },
  {
    accessorKey: 'CustomerAddress',
    header: 'Address',
  },
  {
    accessorKey: 'products',
    header: 'Load (kg)',
  },
  {
    accessorKey: 'status',
    header: 'Status',
    cell: ({ row }) => {
      const statusColors = {
        ASSIGNED: 'bg-green-100 text-green-800',
        COMPLETED: 'bg-blue-100 text-blue-800',
        PENDING: 'bg-yellow-100 text-yellow-800',
      };

      return (
        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${statusColors[row.original.status]}`}>
          {row.original.status.replace('_', ' ')}
        </span>
      );
    },
  },
  {
    accessorKey: 'currentDriver',
    header: 'Current Driver',
    cell: ({ row }) => row.original.currentDriver || 'Not assigned',
  },
  {
    id: 'actions',
    header: 'Actions',
    cell: ({ row }) => (
      <div className="flex gap-2">
        <button
          onClick={() => {/* TODO: Implement edit */}}
          className="p-1 rounded-md hover:bg-gray-100"
          title="Edit vehicle"
        >
          <Pencil className="h-4 w-4 text-blue-600" />
        </button>
        <button
          onClick={() => {/* TODO: Implement delete */}}
          className="p-1 rounded-md hover:bg-gray-100"
          title="Delete vehicle"
        >
          <Trash className="h-4 w-4 text-red-600" />
        </button>
      </div>
    ),
  },
];

export const FleetPage = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingVehicle, setEditingVehicle] = useState<Vehicle | null>(null);
  const queryClient = useQueryClient();

  const { register, handleSubmit, reset, formState: { errors } } = useForm<OperationsFormData>();

  const { data: vehicles = [], isLoading } = useQuery({
    queryKey: ['vehicles'],
    queryFn: async () => {
      // TODO: Replace with actual API call
      return [] as Vehicle[];
    },
  });

  const createMutation = useMutation({
    mutationFn: async (data: VehicleFormData) => {
      // TODO: Replace with actual API call
      // await axios.post('/api/vehicles', data);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['vehicles'] });
      setIsModalOpen(false);
      reset();
      toast.success('Vehicle added successfully');
    },
    onError: () => {
      toast.error('Failed to add vehicle');
    },
  });

  const updateMutation = useMutation({
    mutationFn: async (data: OperationsFormData) => {
      if (!editingVehicle) return;
      // TODO: Replace with actual API call
      // await axios.put(`/api/vehicles/${editingVehicle.id}`, data);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['vehicles'] });
      setIsModalOpen(false);
      setEditingVehicle(null);
      reset();
      toast.success('Vehicle updated successfully');
    },
    onError: () => {
      toast.error('Failed to update vehicle');
    },
  });

  const onSubmit = (data: OperationsFormData) => {
    if (editingVehicle) {
      updateMutation.mutate(data);
    } else {
      createMutation.mutate(data);
    }
  };

  const handleAddVehicle = () => {
    setEditingVehicle(null);
    reset({
      registrationNumber: '',
      model: '',
      capacity: 0,
      status: 'AVAILABLE',
    });
    setIsModalOpen(true);
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
          <h1 className="text-2xl font-bold text-gray-900">Fleet Management</h1>
          <p className="mt-1 text-sm text-gray-500">
            Manage your delivery vehicles
          </p>
        </div>
        <div className="mt-4 sm:mt-0">
          <button
            onClick={handleAddVehicle}
            className="inline-flex items-center justify-center rounded-md border border-transparent bg-blue-600 px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 sm:w-auto"
          >
            <Plus className="h-4 w-4 mr-2" />
            Add Vehicle
          </button>
        </div>
      </div>

      <DataTable
        data={vehicles}
        columns={columns}
        searchPlaceholder="Search vehicles..."
      />

      <Modal
        isOpen={isModalOpen}
        onClose={() => {
          setIsModalOpen(false);
          setEditingVehicle(null);
          reset();
        }}
        title={editingVehicle ? 'Edit Vehicle' : 'Add Vehicle'}
      >
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div>
            <label htmlFor="registrationNumber" className="block text-sm font-medium text-gray-700">
              Registration Number
            </label>
            <input
              type="text"
              {...register('registrationNumber', { required: 'Registration number is required' })}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
            />
            {errors.registrationNumber && (
              <p className="mt-1 text-sm text-red-600">{errors.registrationNumber.message}</p>
            )}
          </div>

          <div>
            <label htmlFor="model" className="block text-sm font-medium text-gray-700">
              Model
            </label>
            <input
              type="text"
              {...register('model', { required: 'Model is required' })}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
            />
            {errors.model && (
              <p className="mt-1 text-sm text-red-600">{errors.model.message}</p>
            )}
          </div>

          <div>
            <label htmlFor="capacity" className="block text-sm font-medium text-gray-700">
              Capacity (kg)
            </label>
            <input
              type="number"
              {...register('capacity', {
                required: 'Capacity is required',
                min: { value: 0, message: 'Capacity must be positive' },
              })}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
            />
            {errors.capacity && (
              <p className="mt-1 text-sm text-red-600">{errors.capacity.message}</p>
            )}
          </div>

          <div>
            <label htmlFor="status" className="block text-sm font-medium text-gray-700">
              Status
            </label>
            <select
              {...register('status', { required: 'Status is required' })}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
            >
              <option value="AVAILABLE">Available</option>
              <option value="IN_USE">In Use</option>
              <option value="MAINTENANCE">Maintenance</option>
            </select>
            {errors.status && (
              <p className="mt-1 text-sm text-red-600">{errors.status.message}</p>
            )}
          </div>

          <div className="flex justify-end gap-3">
            <button
              type="button"
              onClick={() => {
                setIsModalOpen(false);
                setEditingVehicle(null);
                reset();
              }}
              className="inline-flex justify-center rounded-md border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 shadow-sm hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="inline-flex justify-center rounded-md border border-transparent bg-blue-600 px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
            >
              {editingVehicle ? 'Update' : 'Create'}
            </button>
          </div>
        </form>
      </Modal>
    </div>
  );
};