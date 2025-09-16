import React from 'react';
import { Target, Plus, Edit, Trash2, Play, Pause, Calendar } from 'lucide-react';

const CampaignsPage: React.FC = () => {
  // Mock data for campaigns
  const campaigns = [
    {
      id: '1',
      nome: 'Campanha de Verão 2024',
      descricao: 'Promoções e ofertas especiais para o verão',
      status: 'ativa',
      dispositivos: 3,
      inicio: new Date().toISOString(),
      fim: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString(),
      created_at: new Date().toISOString()
    },
    {
      id: '2',
      nome: 'Black Friday 2024',
      descricao: 'Campanha especial para Black Friday',
      status: 'agendada',
      dispositivos: 5,
      inicio: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString(),
      fim: new Date(Date.now() + 10 * 24 * 60 * 60 * 1000).toISOString(),
      created_at: new Date().toISOString()
    }
  ];

  const getStatusBadge = (status: string) => {
    const classes = {
      ativa: 'bg-green-100 text-green-800',
      pausada: 'bg-yellow-100 text-yellow-800',
      agendada: 'bg-blue-100 text-blue-800',
      finalizada: 'bg-gray-100 text-gray-800'
    };

    return (
      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${classes[status as keyof typeof classes]}`}>
        {status.charAt(0).toUpperCase() + status.slice(1)}
      </span>
    );
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Campanhas</h1>
          <p className="text-gray-600">Gerencie suas campanhas de sinalização</p>
        </div>
        <button className="bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-4 rounded-lg transition-colors flex items-center">
          <Plus className="h-4 w-4 mr-2" />
          Nova Campanha
        </button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="bg-white rounded-lg shadow-md border border-gray-200 p-6">
          <div className="flex items-center">
            <Target className="h-8 w-8 text-blue-600" />
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Total</p>
              <p className="text-2xl font-bold text-gray-900">{campaigns.length}</p>
            </div>
          </div>
        </div>
        <div className="bg-white rounded-lg shadow-md border border-gray-200 p-6">
          <div className="flex items-center">
            <Play className="h-8 w-8 text-green-600" />
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Ativas</p>
              <p className="text-2xl font-bold text-gray-900">
                {campaigns.filter(c => c.status === 'ativa').length}
              </p>
            </div>
          </div>
        </div>
        <div className="bg-white rounded-lg shadow-md border border-gray-200 p-6">
          <div className="flex items-center">
            <Calendar className="h-8 w-8 text-blue-600" />
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Agendadas</p>
              <p className="text-2xl font-bold text-gray-900">
                {campaigns.filter(c => c.status === 'agendada').length}
              </p>
            </div>
          </div>
        </div>
        <div className="bg-white rounded-lg shadow-md border border-gray-200 p-6">
          <div className="flex items-center">
            <Pause className="h-8 w-8 text-yellow-600" />
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Pausadas</p>
              <p className="text-2xl font-bold text-gray-900">
                {campaigns.filter(c => c.status === 'pausada').length}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Campaigns List */}
      <div className="bg-white rounded-lg shadow-md border border-gray-200">
        <div className="px-6 py-4 border-b border-gray-200">
          <h3 className="text-lg font-medium text-gray-900">Lista de Campanhas</h3>
        </div>
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Campanha
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Status
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Dispositivos
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Período
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Ações
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {campaigns.map((campaign) => (
                <tr key={campaign.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      <Target className="h-10 w-10 text-blue-600" />
                      <div className="ml-4">
                        <div className="text-sm font-medium text-gray-900">
                          {campaign.nome}
                        </div>
                        <div className="text-sm text-gray-500">
                          {campaign.descricao}
                        </div>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    {getStatusBadge(campaign.status)}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {campaign.dispositivos} dispositivos
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    <div>
                      <div>Início: {new Date(campaign.inicio).toLocaleDateString('pt-BR')}</div>
                      <div>Fim: {new Date(campaign.fim).toLocaleDateString('pt-BR')}</div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                    <div className="flex space-x-2">
                      <button className="text-blue-600 hover:text-blue-900">
                        <Edit className="h-4 w-4" />
                      </button>
                      <button className="text-green-600 hover:text-green-900">
                        <Play className="h-4 w-4" />
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
    </div>
  );
};

export default CampaignsPage;