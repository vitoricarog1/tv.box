import React from 'react';
import { Play, Plus, Edit, Trash2, Clock } from 'lucide-react';

const PlaylistsPage: React.FC = () => {
  // Mock data for playlists
  const playlists = [
    {
      id: '1',
      nome: 'Promoções de Verão',
      descricao: 'Playlist com conteúdo promocional para o verão',
      itens: 5,
      duracao: 120,
      ativo: true,
      created_at: new Date().toISOString()
    },
    {
      id: '2',
      nome: 'Institucional',
      descricao: 'Conteúdo institucional da empresa',
      itens: 3,
      duracao: 90,
      ativo: true,
      created_at: new Date().toISOString()
    }
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Playlists</h1>
          <p className="text-gray-600">Organize seu conteúdo em playlists</p>
        </div>
        <button className="bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-4 rounded-lg transition-colors flex items-center">
          <Plus className="h-4 w-4 mr-2" />
          Nova Playlist
        </button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white rounded-lg shadow-md border border-gray-200 p-6">
          <div className="flex items-center">
            <Play className="h-8 w-8 text-blue-600" />
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Total</p>
              <p className="text-2xl font-bold text-gray-900">{playlists.length}</p>
            </div>
          </div>
        </div>
        <div className="bg-white rounded-lg shadow-md border border-gray-200 p-6">
          <div className="flex items-center">
            <Play className="h-8 w-8 text-green-600" />
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Ativas</p>
              <p className="text-2xl font-bold text-gray-900">
                {playlists.filter(p => p.ativo).length}
              </p>
            </div>
          </div>
        </div>
        <div className="bg-white rounded-lg shadow-md border border-gray-200 p-6">
          <div className="flex items-center">
            <Clock className="h-8 w-8 text-purple-600" />
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Duração Total</p>
              <p className="text-2xl font-bold text-gray-900">
                {playlists.reduce((sum, p) => sum + p.duracao, 0)}min
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Playlists Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {playlists.map((playlist) => (
          <div key={playlist.id} className="bg-white rounded-lg shadow-md border border-gray-200 p-6">
            <div className="flex items-start justify-between">
              <div className="flex items-center">
                <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                  <Play className="h-6 w-6 text-blue-600" />
                </div>
                <div className="ml-4">
                  <h3 className="text-lg font-medium text-gray-900">{playlist.nome}</h3>
                  <p className="text-sm text-gray-500">{playlist.descricao}</p>
                </div>
              </div>
              <div className="flex space-x-2">
                <button className="text-gray-600 hover:text-gray-900">
                  <Edit className="h-4 w-4" />
                </button>
                <button className="text-red-600 hover:text-red-900">
                  <Trash2 className="h-4 w-4" />
                </button>
              </div>
            </div>
            
            <div className="mt-4 flex items-center justify-between text-sm text-gray-500">
              <span>{playlist.itens} itens</span>
              <span>{playlist.duracao} min</span>
              <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                playlist.ativo 
                  ? 'bg-green-100 text-green-800' 
                  : 'bg-gray-100 text-gray-800'
              }`}>
                {playlist.ativo ? 'Ativa' : 'Inativa'}
              </span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default PlaylistsPage;