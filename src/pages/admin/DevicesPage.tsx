import React, { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Plus, Monitor, Wifi, WifiOff, AlertTriangle, Edit, Trash2, Power } from 'lucide-react';
// Device management will use backend API
import LoadingSpinner from '../../components/LoadingSpinner';
import toast from 'react-hot-toast';

interface Device {
  id: string;
  nome: string;
  localizacao: string;
  status: 'online' | 'offline' | 'erro';
  ultima_atividade: string;
  created_at: string;
}

const DevicesPage: React.FC = () => {
  // Device data will be fetched from backend API
  const queryClient = useQueryClient();
  const [showAddModal, setShowAddModal] = useState(false);
  const [newDevice, setNewDevice] = useState({
    nome: '',
    localizacao: '',
    descricao: ''
  });

  // Fetch devices (simulated for now since we don't have devices table)
  const { data: devices, isLoading } = useQuery({
    queryKey: ['devices'],
    queryFn: async () => {
      // Simulated devices data
      return [
        {
          id: '1',
          nome: 'TV Recepção',
          localizacao: 'Recepção Principal',
          status: 'online' as const,
          ultima_atividade: new Date().toISOString(),
          created_at: new Date().toISOString()
        },
        {
          id: '2',
          nome: 'TV Sala de Espera',
          localizacao: 'Sala de Espera',
          status: 'offline' as const,
          ultima_atividade: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(),
          created_at: new Date().toISOString()
        }
      ] as Device[];
    }
  });

  const addDeviceMutation = useMutation({
    mutationFn: async (deviceData: typeof newDevice) => {
      // Simulate adding device
      return { id: Date.now().toString(), ...deviceData, status: 'offline', ultima_atividade: new Date().toISOString(), created_at: new Date().toISOString() };
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['devices'] });
      setShowAddModal(false);
      setNewDevice({ nome: '', localizacao: '', descricao: '' });
      toast.success('Dispositivo adicionado com sucesso!');
    },
    onError: () => {
      toast.error('Erro ao adicionar dispositivo');
    }
  });

  const handleAddDevice = (e: React.FormEvent) => {
    e.preventDefault();
    addDeviceMutation.mutate(newDevice);
  };

  if (isLoading) {
    return <LoadingSpinner className="h-64" />;
  }

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'online':
        return <Wifi className="h-4 w-4 text-green-600" />;
      case 'offline':
        return <WifiOff className="h-4 w-4 text-gray-600" />;
      case 'erro':
        return <AlertTriangle className="h-4 w-4 text-red-600" />;
      default:
        return <Monitor className="h-4 w-4 text-gray-600" />;
    }
  };

  const getStatusBadge = (status: string) => {
    const classes = {
      online: 'bg-green-100 text-green-800',
      offline: 'bg-gray-100 text-gray-800',
      erro: 'bg-red-100 text-red-800'
    };

    return (
      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${classes[status as keyof typeof classes]}`}>
        {getStatusIcon(status)}
        <span className="ml-1 capitalize">{status}</span>
      </span>
    );
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Dispositivos</h1>
          <p className="text-gray-600">Gerencie seus dispositivos de sinalização digital</p>
        </div>
        <button
          onClick={() => setShowAddModal(true)}
          className="bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-4 rounded-lg transition-colors flex items-center"
        >
          <Plus className="h-4 w-4 mr-2" />
          Adicionar Dispositivo
        </button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="bg-white rounded-lg shadow-md border border-gray-200 p-6">
          <div className="flex items-center">
            <Monitor className="h-8 w-8 text-blue-600" />
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Total</p>
              <p className="text-2xl font-bold text-gray-900">{devices?.length || 0}</p>
            </div>
          </div>
        </div>
        <div className="bg-white rounded-lg shadow-md border border-gray-200 p-6">
          <div className="flex items-center">
            <Wifi className="h-8 w-8 text-green-600" />
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Online</p>
              <p className="text-2xl font-bold text-gray-900">
                {devices?.filter(d => d.status === 'online').length || 0}
              </p>
            </div>
          </div>
        </div>
        <div className="bg-white rounded-lg shadow-md border border-gray-200 p-6">
          <div className="flex items-center">
            <WifiOff className="h-8 w-8 text-gray-600" />
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Offline</p>
              <p className="text-2xl font-bold text-gray-900">
                {devices?.filter(d => d.status === 'offline').length || 0}
              </p>
            </div>
          </div>
        </div>
        <div className="bg-white rounded-lg shadow-md border border-gray-200 p-6">
          <div className="flex items-center">
            <AlertTriangle className="h-8 w-8 text-red-600" />
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Com Erro</p>
              <p className="text-2xl font-bold text-gray-900">
                {devices?.filter(d => d.status === 'erro').length || 0}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Devices List */}
      <div className="bg-white rounded-lg shadow-md border border-gray-200">
        <div className="px-6 py-4 border-b border-gray-200">
          <h3 className="text-lg font-medium text-gray-900">Lista de Dispositivos</h3>
        </div>
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Dispositivo
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Status
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Última Atividade
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Ações
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {devices?.map((device) => (
                <tr key={device.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      <Monitor className="h-10 w-10 text-gray-400" />
                      <div className="ml-4">
                        <div className="text-sm font-medium text-gray-900">
                          {device.nome}
                        </div>
                        <div className="text-sm text-gray-500">
                          {device.localizacao}
                        </div>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    {getStatusBadge(device.status)}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {new Date(device.ultima_atividade).toLocaleString('pt-BR')}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                    <div className="flex space-x-2">
                      <button className="text-blue-600 hover:text-blue-900">
                        <Edit className="h-4 w-4" />
                      </button>
                      <button className="text-green-600 hover:text-green-900">
                        <Power className="h-4 w-4" />
                      </button>
                      <button className="text-red-600 hover:text-red-900">
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Add Device Modal */}
      {showAddModal && (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50">
          <div className="relative top-20 mx-auto p-5 border w-96 shadow-lg rounded-md bg-white">
            <div className="mt-3">
              <h3 className="text-lg font-medium text-gray-900 mb-4">
                Adicionar Novo Dispositivo
              </h3>
              <form onSubmit={handleAddDevice} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700">
                    Nome do Dispositivo
                  </label>
                  <input
                    type="text"
                    required
                    value={newDevice.nome}
                    onChange={(e) => setNewDevice({ ...newDevice, nome: e.target.value })}
                    className="mt-1 w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="Ex: TV Recepção"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">
                    Localização
                  </label>
                  <input
                    type="text"
                    required
                    value={newDevice.localizacao}
                    onChange={(e) => setNewDevice({ ...newDevice, localizacao: e.target.value })}
                    className="mt-1 w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="Ex: Recepção Principal"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">
                    Descrição (opcional)
                  </label>
                  <textarea
                    value={newDevice.descricao}
                    onChange={(e) => setNewDevice({ ...newDevice, descricao: e.target.value })}
                    className="mt-1 w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    rows={3}
                    placeholder="Descrição adicional..."
                  />
                </div>
                <div className="flex justify-end space-x-3 pt-4">
                  <button
                    type="button"
                    onClick={() => setShowAddModal(false)}
                    className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-lg transition-colors"
                  >
                    Cancelar
                  </button>
                  <button
                    type="submit"
                    disabled={addDeviceMutation.isPending}
                    className="px-4 py-2 text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 rounded-lg transition-colors disabled:opacity-50"
                  >
                    {addDeviceMutation.isPending ? 'Adicionando...' : 'Adicionar'}
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default DevicesPage;