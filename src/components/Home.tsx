import { Package, FileText, Boxes, Route, ClipboardCheck, Factory } from 'lucide-react';

interface HomeProps {
  onNavigate: (page: 'criacao-item' | 'criacao-bom' | 'criacao-item-final' | 'criacao-roteiro' | 'painel-care') => void;
}

export function Home({ onNavigate }: HomeProps) {
  const menuItems = [
    {
      id: 'criacao-item' as const,
      title: 'Criação de Itens',
      description: 'Cadastre itens e componentes com consumo de materiais',
      icon: Package,
      color: 'bg-blue-500',
      hoverColor: 'hover:bg-blue-600',
    },
    {
      id: 'criacao-bom' as const,
      title: 'Criação de BOM',
      description: 'Crie listas de materiais (Bill of Materials)',
      icon: FileText,
      color: 'bg-green-500',
      hoverColor: 'hover:bg-green-600',
    },
    {
      id: 'criacao-item-final' as const,
      title: 'Criação de Itens Finais',
      description: 'Monte produtos finais a partir de sub-itens',
      icon: Boxes,
      color: 'bg-purple-500',
      hoverColor: 'hover:bg-purple-600',
    },
    {
      id: 'criacao-roteiro' as const,
      title: 'Criação de Roteiros',
      description: 'Defina o fluxo de produção de cada peça',
      icon: Route,
      color: 'bg-orange-500',
      hoverColor: 'hover:bg-orange-600',
    },
    {
      id: 'painel-care' as const,
      title: 'Painel CARE Solda',
      description: 'Controle de inspeção e qualidade da estação CARE',
      icon: ClipboardCheck,
      color: 'bg-red-500',
      hoverColor: 'hover:bg-red-600',
    },
  ];

  return (
    <div className="min-h-screen">
      {/* Header */}
      <header className="bg-gradient-to-r from-blue-900 to-blue-800 text-white shadow-lg">
        <div className="container mx-auto px-6 py-8">
          <div className="flex items-center gap-4 mb-4">
            <Factory className="w-12 h-12" />
            <div>
              <h1 className="text-3xl">Sistema de Controle de Produção</h1>
              <p className="text-blue-200 mt-1">Gestão Completa de Metalúrgica</p>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-6 py-12">
        <div className="mb-8">
          <h2 className="text-2xl mb-2">Bem-vindo ao Sistema</h2>
          <p className="text-gray-600">
            Selecione uma das opções abaixo para gerenciar a produção
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {menuItems.map((item) => {
            const Icon = item.icon;
            return (
              <button
                key={item.id}
                onClick={() => onNavigate(item.id)}
                className="group bg-white rounded-xl shadow-md hover:shadow-xl transition-all duration-300 overflow-hidden text-left"
              >
                <div className={`${item.color} p-6 ${item.hoverColor} transition-colors`}>
                  <Icon className="w-12 h-12 text-white" />
                </div>
                <div className="p-6">
                  <h3 className="text-xl mb-2 group-hover:text-blue-600 transition-colors">
                    {item.title}
                  </h3>
                  <p className="text-gray-600 text-sm leading-relaxed">
                    {item.description}
                  </p>
                </div>
              </button>
            );
          })}
        </div>

        {/* Info Cards */}
        <div className="mt-12 grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-6">
            <h3 className="mb-2 text-blue-900">Gestão de Materiais</h3>
            <p className="text-sm text-blue-700">
              Controle completo de materiais, itens e BOMs para otimizar sua produção
            </p>
          </div>
          <div className="bg-green-50 border border-green-200 rounded-lg p-6">
            <h3 className="mb-2 text-green-900">Roteiros de Produção</h3>
            <p className="text-sm text-green-700">
              Defina e visualize o fluxo de cada peça através das estações de trabalho
            </p>
          </div>
          <div className="bg-purple-50 border border-purple-200 rounded-lg p-6">
            <h3 className="mb-2 text-purple-900">Controle de Qualidade</h3>
            <p className="text-sm text-purple-700">
              Sistema CARE para inspeção e controle de qualidade em tempo real
            </p>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="bg-gray-800 text-gray-300 mt-16">
        <div className="container mx-auto px-6 py-6">
          <p className="text-center text-sm">
            Sistema de Controle de Produção - Metalúrgica © 2024
          </p>
        </div>
      </footer>
    </div>
  );
}
