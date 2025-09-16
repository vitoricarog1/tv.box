import React from 'react';
import { useQuery } from '@tanstack/react-query';
import { 
  Monitor, 
  FileText, 
  Target, 
  Play,
  TrendingUp,
  AlertTriangle,
  Activity,
  DollarSign
} from 'lucide-react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar, PieChart, Pie, Cell } from 'recharts';
// Dashboard data will be static for now
import LoadingSpinner from '../../components/LoadingSpinner';

const AdminDashboard: React.FC = () => {
  // Dashboard data will be static for now

  // Fetch real data from Supabase
  const { data: produtos, isLoading: produtosLoading } = useQuery({
    queryKey: ['produtos'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('produtos')
        .select('*')
        .eq('ativo', true);
      
      if (error) throw error;
      return data;
    }
  });

  const { data: vendas, isLoading: vendasLoading } = useQuery({
    queryKey: ['vendas'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('vendas')
        .select(`
          *,
          produto:produtos(nome, categoria)
        `)
        .order('created_at', { ascending: false })
        .limit(100);
      
      if (error) throw error;
      return data;
    }
  });

  const { data: profiles, isLoading: profilesLoading } = useQuery({
    queryKey: ['profiles'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('profiles')
        .select('*');
      
      if (error) throw error;
      return data;
    }
  });

  const isLoading = produtosLoading || vendasLoading || profilesLoading;

  if (isLoading) {
    return <LoadingSpinner className="h-64" />;
  }

  // Calculate statistics
  const totalVendas = vendas?.length || 0;
  const totalReceita = vendas?.reduce((sum, venda) => sum + Number(venda.valor_total), 0) || 0;
  const totalLucro = vendas?.reduce((sum, venda) => sum + Number(venda.lucro), 0) || 0;
  const totalProdutos = produtos?.length || 0;
  const totalClientes = profiles?.filter(p => p.tipo_usuario === 'cliente').length || 0;

  // Prepare chart data
  const vendasPorDia = vendas?.reduce((acc: any, venda) => {
    const data = new Date(venda.created_at).toLocaleDateString('pt-BR');
    acc[data] = (acc[data] || 0) + 1;
    return acc;
  }, {}) || {};

  const chartData = Object.entries(vendasPorDia)
    .slice(-7)
    .map(([data, vendas]) => ({ data, vendas }));

  const vendasPorCategoria = produtos?.map(produto => {
    const vendasProduto = vendas?.filter(v => v.produto_id === produto.id).length || 0;
    return {
      name: produto.categoria,
      value: vendasProduto,
      receita: vendas?.filter(v => v.produto_id === produto.id)
        .reduce((sum, v) => sum + Number(v.valor_total), 0) || 0
    };
  }) || [];

  const COLORS = ['#3B82F6', '#10B981', '#F59E0B', '#EF4444', '#8B5CF6'];

  const stats = [
    {
      name: 'Total de Vendas',
      value: totalVendas,
      icon: Target,
      change: '+12%',
      changeType: 'positive' as const,
      color: 'blue'
    },
    {
      name: 'Receita Total',
      value: `R$ ${totalReceita.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}`,
      icon: DollarSign,
      change: '+8%',
      changeType: 'positive' as const,
      color: 'green'
    },
    {
      name: 'Produtos Ativos',
      value: totalProdutos,
      icon: FileText,
      change: '+3%',
      changeType: 'positive' as const,
      color: 'yellow'
    },
    {
      name: 'Clientes',
      value: totalClientes,
      icon: Monitor,
      change: '+5%',
      changeType: 'positive' as const,
      color: 'purple'
    }
  ];

  return (
    <div className="space-y-6">
      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat) => {
          const Icon = stat.icon;
          const colorClasses = {
            blue: 'text-blue-600 bg-blue-100',
            green: 'text-green-600 bg-green-100',
            yellow: 'text-yellow-600 bg-yellow-100',
            purple: 'text-purple-600 bg-purple-100'
          };
          
          return (
            <div key={stat.name} className="bg-white rounded-lg shadow-md border border-gray-200 p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">{stat.name}</p>
                  <p className="text-3xl font-bold text-gray-900">{stat.value}</p>
                </div>
                <div className={`w-12 h-12 rounded-full flex items-center justify-center ${colorClasses[stat.color]}`}>
                  <Icon className="h-6 w-6" />
                </div>
              </div>
              <div className="mt-4 flex items-center">
                <span className={`text-sm font-medium ${
                  stat.changeType === 'positive' ? 'text-green-600' : 'text-red-600'
                }`}>
                  {stat.change}
                </span>
                <span className="text-sm text-gray-500 ml-2">vs mês anterior</span>
              </div>
            </div>
          );
        })}
      </div>

      {/* Charts Row */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Vendas por Dia */}
        <div className="bg-white rounded-lg shadow-md border border-gray-200 p-6">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-lg font-semibold text-gray-900">Vendas por Dia</h3>
            <div className="flex items-center space-x-2 text-sm text-gray-600">
              <TrendingUp className="h-4 w-4" />
              <span>Últimos 7 dias</span>
            </div>
          </div>
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={chartData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
              <XAxis 
                dataKey="data" 
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
                dataKey="vendas" 
                stroke="#3b82f6" 
                strokeWidth={2}
                dot={{ fill: '#3b82f6', strokeWidth: 2, r: 4 }}
                activeDot={{ r: 6, fill: '#3b82f6' }}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>

        {/* Vendas por Categoria */}
        <div className="bg-white rounded-lg shadow-md border border-gray-200 p-6">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-lg font-semibold text-gray-900">Vendas por Categoria</h3>
            <Activity className="h-5 w-5 text-gray-400" />
          </div>
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie
                data={vendasPorCategoria}
                cx="50%"
                cy="50%"
                labelLine={false}
                label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                outerRadius={80}
                fill="#8884d8"
                dataKey="value"
              >
                {vendasPorCategoria.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Recent Sales */}
      <div className="bg-white rounded-lg shadow-md border border-gray-200 p-6">
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-lg font-semibold text-gray-900">Vendas Recentes</h3>
          <span className="text-sm text-gray-500">{totalVendas} vendas no total</span>
        </div>
        
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Cliente
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Produto
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Valor
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Status
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Data
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {vendas?.slice(0, 10).map((venda) => (
                <tr key={venda.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div>
                      <div className="text-sm font-medium text-gray-900">
                        {venda.cliente_nome}
                      </div>
                      <div className="text-sm text-gray-500">
                        {venda.cliente_email}
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-900">
                      {venda.produto?.nome || 'Produto não encontrado'}
                    </div>
                    <div className="text-sm text-gray-500">
                      {venda.produto?.categoria}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm font-medium text-gray-900">
                      R$ {Number(venda.valor_total).toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                    </div>
                    <div className="text-sm text-gray-500">
                      Qtd: {venda.quantidade}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                      venda.status === 'confirmada' 
                        ? 'bg-green-100 text-green-800'
                        : venda.status === 'pendente'
                        ? 'bg-yellow-100 text-yellow-800'
                        : 'bg-red-100 text-red-800'
                    }`}>
                      {venda.status}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {new Date(venda.created_at).toLocaleDateString('pt-BR')}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="bg-white rounded-lg shadow-md border border-gray-200 p-6">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-lg font-semibold text-gray-900">Lucro Total</h3>
              <p className="text-3xl font-bold text-green-600 mt-2">
                R$ {totalLucro.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
              </p>
            </div>
            <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center">
              <DollarSign className="h-6 w-6 text-green-600" />
            </div>
          </div>
          <div className="mt-4">
            <div className="flex items-center justify-between text-sm">
              <span className="text-gray-600">Margem média</span>
              <span className="text-green-600 font-medium">
                {totalReceita > 0 ? ((totalLucro / totalReceita) * 100).toFixed(1) : 0}%
              </span>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-md border border-gray-200 p-6">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-lg font-semibold text-gray-900">Ticket Médio</h3>
              <p className="text-3xl font-bold text-blue-600 mt-2">
                R$ {totalVendas > 0 ? (totalReceita / totalVendas).toLocaleString('pt-BR', { minimumFractionDigits: 2 }) : '0,00'}
              </p>
            </div>
            <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center">
              <Target className="h-6 w-6 text-blue-600" />
            </div>
          </div>
          <div className="mt-4">
            <div className="flex items-center justify-between text-sm">
              <span className="text-gray-600">Por venda</span>
              <span className="text-blue-600 font-medium">
                Média geral
              </span>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-md border border-gray-200 p-6">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-lg font-semibold text-gray-900">Conversão</h3>
              <p className="text-3xl font-bold text-purple-600 mt-2">
                {totalClientes > 0 ? ((totalVendas / totalClientes) * 100).toFixed(1) : 0}%
              </p>
            </div>
            <div className="w-12 h-12 bg-purple-100 rounded-full flex items-center justify-center">
              <TrendingUp className="h-6 w-6 text-purple-600" />
            </div>
          </div>
          <div className="mt-4">
            <div className="flex items-center justify-between text-sm">
              <span className="text-gray-600">Clientes que compraram</span>
              <span className="text-purple-600 font-medium">
                Taxa de conversão
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;