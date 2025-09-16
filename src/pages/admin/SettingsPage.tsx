import React, { useState } from 'react';
import { Save, User, Bell, Shield, Palette, Monitor } from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';
import toast from 'react-hot-toast';

const SettingsPage: React.FC = () => {
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState('profile');
  const [profileData, setProfileData] = useState({
    nome: user?.nome || '',
    email: user?.email || ''
  });

  const tabs = [
    { id: 'profile', name: 'Perfil', icon: User },
    { id: 'notifications', name: 'Notificações', icon: Bell },
    { id: 'security', name: 'Segurança', icon: Shield },
    { id: 'display', name: 'Exibição', icon: Monitor },
    { id: 'theme', name: 'Tema', icon: Palette }
  ];

  const handleSaveProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    // Profile update functionality will be implemented later
    toast.success('Configurações salvas!');
  };

  const renderTabContent = () => {
    switch (activeTab) {
      case 'profile':
        return (
          <div className="space-y-6">
            <div>
              <h3 className="text-lg font-medium text-gray-900">Informações do Perfil</h3>
              <p className="text-sm text-gray-600">Atualize suas informações pessoais</p>
            </div>
            
            <form onSubmit={handleSaveProfile} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Nome Completo
                </label>
                <input
                  type="text"
                  value={profileData.nome_completo}
                  onChange={(e) => setProfileData({ ...profileData, nome_completo: e.target.value })}
                  className="mt-1 w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Email
                </label>
                <input
                  type="email"
                  value={profileData.email}
                  onChange={(e) => setProfileData({ ...profileData, email: e.target.value })}
                  className="mt-1 w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  disabled
                />
                <p className="text-xs text-gray-500 mt-1">O email não pode ser alterado</p>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Telefone
                </label>
                <input
                  type="tel"
                  value={profileData.telefone}
                  onChange={(e) => setProfileData({ ...profileData, telefone: e.target.value })}
                  className="mt-1 w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              
              <button
                type="submit"
                className="bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-4 rounded-lg transition-colors flex items-center"
              >
                <Save className="h-4 w-4 mr-2" />
                Salvar Alterações
              </button>
            </form>
          </div>
        );

      case 'notifications':
        return (
          <div className="space-y-6">
            <div>
              <h3 className="text-lg font-medium text-gray-900">Configurações de Notificação</h3>
              <p className="text-sm text-gray-600">Escolha como você quer receber notificações</p>
            </div>
            
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <h4 className="text-sm font-medium text-gray-900">Dispositivos offline</h4>
                  <p className="text-sm text-gray-500">Receber notificação quando dispositivos ficarem offline</p>
                </div>
                <input type="checkbox" defaultChecked className="rounded" />
              </div>
              
              <div className="flex items-center justify-between">
                <div>
                  <h4 className="text-sm font-medium text-gray-900">Novas vendas</h4>
                  <p className="text-sm text-gray-500">Notificação para cada nova venda realizada</p>
                </div>
                <input type="checkbox" defaultChecked className="rounded" />
              </div>
              
              <div className="flex items-center justify-between">
                <div>
                  <h4 className="text-sm font-medium text-gray-900">Relatórios semanais</h4>
                  <p className="text-sm text-gray-500">Receber resumo semanal por email</p>
                </div>
                <input type="checkbox" className="rounded" />
              </div>
            </div>
          </div>
        );

      case 'security':
        return (
          <div className="space-y-6">
            <div>
              <h3 className="text-lg font-medium text-gray-900">Segurança</h3>
              <p className="text-sm text-gray-600">Gerencie suas configurações de segurança</p>
            </div>
            
            <div className="space-y-4">
              <div>
                <h4 className="text-sm font-medium text-gray-900">Alterar Senha</h4>
                <div className="mt-2 space-y-3">
                  <input
                    type="password"
                    placeholder="Senha atual"
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                  <input
                    type="password"
                    placeholder="Nova senha"
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                  <input
                    type="password"
                    placeholder="Confirmar nova senha"
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                  <button className="bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-4 rounded-lg transition-colors">
                    Alterar Senha
                  </button>
                </div>
              </div>
            </div>
          </div>
        );

      case 'display':
        return (
          <div className="space-y-6">
            <div>
              <h3 className="text-lg font-medium text-gray-900">Configurações de Exibição</h3>
              <p className="text-sm text-gray-600">Personalize como o conteúdo é exibido</p>
            </div>
            
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Resolução Padrão
                </label>
                <select className="mt-1 w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500">
                  <option>1920x1080 (Full HD)</option>
                  <option>1366x768 (HD)</option>
                  <option>3840x2160 (4K)</option>
                </select>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Orientação
                </label>
                <select className="mt-1 w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500">
                  <option>Paisagem</option>
                  <option>Retrato</option>
                </select>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Tempo de Transição (segundos)
                </label>
                <input
                  type="number"
                  defaultValue={5}
                  min={1}
                  max={60}
                  className="mt-1 w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
            </div>
          </div>
        );

      case 'theme':
        return (
          <div className="space-y-6">
            <div>
              <h3 className="text-lg font-medium text-gray-900">Tema</h3>
              <p className="text-sm text-gray-600">Personalize a aparência do sistema</p>
            </div>
            
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Modo de Cor
                </label>
                <div className="mt-2 space-y-2">
                  <label className="flex items-center">
                    <input type="radio" name="theme" value="light" defaultChecked className="mr-2" />
                    Claro
                  </label>
                  <label className="flex items-center">
                    <input type="radio" name="theme" value="dark" className="mr-2" />
                    Escuro
                  </label>
                  <label className="flex items-center">
                    <input type="radio" name="theme" value="auto" className="mr-2" />
                    Automático
                  </label>
                </div>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Cor Principal
                </label>
                <div className="mt-2 flex space-x-2">
                  <div className="w-8 h-8 bg-blue-600 rounded cursor-pointer border-2 border-blue-600"></div>
                  <div className="w-8 h-8 bg-green-600 rounded cursor-pointer border-2 border-transparent hover:border-gray-300"></div>
                  <div className="w-8 h-8 bg-purple-600 rounded cursor-pointer border-2 border-transparent hover:border-gray-300"></div>
                  <div className="w-8 h-8 bg-red-600 rounded cursor-pointer border-2 border-transparent hover:border-gray-300"></div>
                  <div className="w-8 h-8 bg-yellow-600 rounded cursor-pointer border-2 border-transparent hover:border-gray-300"></div>
                </div>
              </div>
            </div>
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Configurações</h1>
        <p className="text-gray-600">Gerencie suas preferências e configurações do sistema</p>
      </div>

      <div className="bg-white rounded-lg shadow-md border border-gray-200">
        <div className="flex border-b border-gray-200">
          {tabs.map((tab) => {
            const Icon = tab.icon;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center px-6 py-4 text-sm font-medium border-b-2 transition-colors ${
                  activeTab === tab.id
                    ? 'border-blue-600 text-blue-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                <Icon className="h-4 w-4 mr-2" />
                {tab.name}
              </button>
            );
          })}
        </div>
        
        <div className="p-6">
          {renderTabContent()}
        </div>
      </div>
    </div>
  );
};

export default SettingsPage;