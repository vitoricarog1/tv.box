import React from 'react';
import { BarChart3, TrendingUp, Eye, Clock } from 'lucide-react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar } from 'recharts';

const AnalyticsPage: React.FC = () => {
  // Mock analytics data
  const viewsData = [
    { name: 'Seg', views: 120, duration: 480 },
    { name: 'Ter', views: 145, duration: 520 },
    { name: 'Qua', views: 110, duration: 430 },
    { name: 'Qui', views: 135, duration: 490 },
    { name: 'Sex', views: 160, duration: 580 },
    { name: 'Sáb', views: 95, duration: 320 },
    { name: 'Dom', views: 85, duration: 290 }
  ];

  const deviceData = [
    { name: 'TV Recepção', views: 450 },
    { name: 'TV Sala Espera', views: 320 },
    { name: 'TV Corredor', views: 280 },
    { name: 'TV Entrada', views: 190 }
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Analytics</h1>
        <p className="text-gray-600">Acompanhe o desempenho do seu conteúdo</p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="bg-white rounded-lg shadow-md border border-gray-200 p-6">
          <div className="flex items-center">
            <Eye className="h-8 w-8 text-blue-600" />
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Visualizações</p>
              <p className="text-2xl font-bold text-gray-900">1,245</p>
            </div>
          </div>
          <div className="mt-4">
            <span className="text-sm font-medium text-green-600">+12%</span>
            <span className="text-sm text-gray-500 ml-2">vs semana anterior</span>
          </div>
        </div>
        <div className="bg-white rounded-lg shadow-md border border-gray-200 p-6">
          <div className="flex items-center">
            <Clock className="h-8 w-8 text-green-600" />
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Tempo Total</p>
              <p className="text-2xl font-bold text-gray-900">3,120min</p>
            </div>
          </div>
          <div className="mt-4">
            <span className="text-sm font-medium text-green-600">+8%</span>
            <span className="text-sm text-gray-500 ml-2">vs semana anterior</span>
          </div>
        </div>
        <div className="bg-white rounded-lg shadow-md border border-gray-200 p-6">
          <div className="flex items-center">
            <TrendingUp className="h-8 w-8 text-purple-600" />
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Engajamento</p>
              <p className="text-2xl font-bold text-gray-900">87%</p>
            </div>
          </div>
          <div className="mt-4">
            <span className="text-sm font-medium text-green-600">+5%</span>
            <span className="text-sm text-gray-500 ml-2">vs semana anterior</span>
          </div>
        </div>
        <div className="bg-white rounded-lg shadow-md border border-gray-200 p-6">
          <div className="flex items-center">
            <BarChart3 className="h-8 w-8 text-yellow-600" />
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Dispositivos Ativos</p>
              <p className="text-2xl font-bold text-gray-900">4</p>
            </div>
          </div>
          <div className="mt-4">
            <span className="text-sm font-medium text-green-600">100%</span>
            <span className="text-sm text-gray-500 ml-2">online</span>
          </div>
        </div>
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Views Over Time */}
        <div className="bg-white rounded-lg shadow-md border border-gray-200 p-6">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-lg font-semibold text-gray-900">Visualizações por Dia</h3>
            <div className="flex items-center space-x-2 text-sm text-gray-600">
              <TrendingUp className="h-4 w-4" />
              <span>Últimos 7 dias</span>
            </div>
          </div>
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={viewsData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
              <XAxis 
                dataKey="name" 
                axisLine={false}
                tickLine={false}
                style={{ fontSize: '12px', fill: '#6b7280' }}
              />
              <YAxis 
                axisLine={false}
                tickLine={false}
                style={{ fontSize: '12px', fill: '#6b7280' }}
              />
              <Tooltip 
                contentStyle={{
                  backgroundColor: '#fff',
                  border: '1px solid #e5e7eb',
                  borderRadius: '6px',
                  fontSize: '12px'
                }}
              />
              <Line 
                type="monotone" 
                dataKey="views" 
                stroke="#3b82f6" 
                strokeWidth={2}
                dot={{ fill: '#3b82f6', strokeWidth: 2, r: 4 }}
                activeDot={{ r: 6, fill: '#3b82f6' }}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>

        {/* Views by Device */}
        <div className="bg-white rounded-lg shadow-md border border-gray-200 p-6">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-lg font-semibold text-gray-900">Visualizações por Dispositivo</h3>
            <BarChart3 className="h-5 w-5 text-gray-400" />
          </div>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={deviceData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
              <XAxis 
                dataKey="name" 
                axisLine={false}
                tickLine={false}
                style={{ fontSize: '12px', fill: '#6b7280' }}
                angle={-45}
                textAnchor="end"
                height={60}
              />
              <YAxis 
                axisLine={false}
                tickLine={false}
                style={{ fontSize: '12px', fill: '#6b7280' }}
              />
              <Tooltip 
                contentStyle={{
                  backgroundColor: '#fff',
                  border: '1px solid #e5e7eb',
                  borderRadius: '6px',
                  fontSize: '12px'
                }}
              />
              <Bar 
                dataKey="views" 
                fill="#3b82f6"
                radius={[4, 4, 0, 0]}
              />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Top Content */}
      <div className="bg-white rounded-lg shadow-md border border-gray-200 p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-6">Conteúdo Mais Visualizado</h3>
        <div className="space-y-4">
          {[
            { name: 'Promoção Verão 2024', views: 450, duration: '2:30', category: 'Promoção' },
            { name: 'Institucional Empresa', views: 320, duration: '1:45', category: 'Institucional' },
            { name: 'Novos Produtos', views: 280, duration: '3:15', category: 'Produto' },
            { name: 'Horário de Funcionamento', views: 190, duration: '0:45', category: 'Informativo' }
          ].map((content, index) => (
            <div key={index} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
              <div className="flex items-center space-x-4">
                <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                  <span className="text-blue-600 font-bold">{index + 1}</span>
                </div>
                <div>
                  <h4 className="font-medium text-gray-900">{content.name}</h4>
                  <p className="text-sm text-gray-500">{content.category}</p>
                </div>
              </div>
              <div className="text-right">
                <p className="font-medium text-gray-900">{content.views} views</p>
                <p className="text-sm text-gray-500">{content.duration} duração</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default AnalyticsPage;