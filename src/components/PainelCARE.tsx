import { useState } from 'react';
import { ArrowLeft, Clipboard, History } from 'lucide-react';
import { Dashboard } from './Dashboard';
import { InspectionPanel } from './InspectionPanel';
import { WorkSequence } from './WorkSequence';
import { HistoricoInspecoes } from './HistoricoInspecoes';
import type { OP, Inspecao, Priority, Status, Item, Material } from '../App';

interface PainelCAREProps {
  materiais: Material[];
  itens: Item[];
  onBack: () => void;
}

type TabType = 'dashboard' | 'historico';

export function PainelCARE({ materiais, itens, onBack }: PainelCAREProps) {
  const [currentTab, setCurrentTab] = useState<TabType>('dashboard');
  const [ops, setOps] = useState<OP[]>([
    {
      id: '1',
      numero: 'OP-000001',
      peca: 'Suporte Base A-320',
      lote: 50,
      quantidadeInspecionar: 10,
      prioridade: 'alta',
      status: 'aprovada',
      dataEntrada: '2024-12-31T08:00:00',
      operador: 'Carlos Mendes',
      historico: {
        totalInspecoes: 15,
        taxaDefeito: 12.5
      },
      problemas: ['Porosidade na solda', 'Dimensão fora de tolerância']
    },
    {
      id: '2',
      numero: 'OP-000002',
      peca: 'Flange Conexão B-150',
      lote: 30,
      quantidadeInspecionar: 5,
      prioridade: 'media',
      status: 'aprovada',
      dataEntrada: '2024-12-31T09:30:00',
      operador: 'João Silva',
      historico: {
        totalInspecoes: 8,
        taxaDefeito: 5.2
      },
      problemas: ['Respingo de solda']
    },
    {
      id: '3',
      numero: 'OP-000003',
      peca: 'Chapa Reforço C-200',
      lote: 100,
      quantidadeInspecionar: 15,
      prioridade: 'baixa',
      status: 'aprovada',
      dataEntrada: '2024-12-31T10:15:00',
      operador: 'Ana Paula',
      historico: {
        totalInspecoes: 25,
        taxaDefeito: 3.8
      },
      problemas: ['Acabamento superficial']
    },
    {
      id: '4',
      numero: 'OP-000004',
      peca: 'Suporte Lateral D-450',
      lote: 20,
      quantidadeInspecionar: 8,
      prioridade: 'alta',
      status: 'pendente',
      dataEntrada: '2024-12-31T11:00:00',
      historico: {
        totalInspecoes: 5,
        taxaDefeito: 18.3
      },
      problemas: ['Trinca em solda', 'Falta de penetração', 'Desalinhamento']
    }
  ]);

  const [selectedOp, setSelectedOp] = useState<OP | null>(null);
  const [inspections, setInspections] = useState<Inspecao[]>([
    {
      opId: '1',
      cotasDefeituosas: ['Porosidade na solda', 'Dimensão A-12 fora de tolerância'],
      observacoes: 'Necessário retrabalho em 2 peças. Verificar temperatura de soldagem.',
      pecasInspecionadas: 10,
      pecasAprovadas: 8,
      pecasReprovadas: 2,
      timestamp: '2024-12-30T14:30:00'
    },
    {
      opId: '2',
      cotasDefeituosas: ['Respingo de solda'],
      observacoes: 'Lote aprovado com pequenos respingos que não comprometem a qualidade.',
      pecasInspecionadas: 5,
      pecasAprovadas: 5,
      pecasReprovadas: 0,
      timestamp: '2024-12-30T16:45:00'
    },
    {
      opId: '3',
      cotasDefeituosas: [],
      observacoes: 'Lote aprovado sem defeitos. Excelente qualidade.',
      pecasInspecionadas: 15,
      pecasAprovadas: 15,
      pecasReprovadas: 0,
      timestamp: '2024-12-31T09:20:00'
    }
  ]);
  const [nextOpNumber, setNextOpNumber] = useState(5);

  const handlePriorityChange = (opId: string, newPriority: Priority) => {
    setOps(ops.map(op => 
      op.id === opId ? { ...op, prioridade: newPriority } : op
    ));
  };

  const handleStartInspection = (op: OP) => {
    setOps(ops.map(o => 
      o.id === op.id ? { ...o, status: 'em-inspecao' } : o
    ));
    setSelectedOp(op);
  };

  const handleSubmitInspection = (inspecao: Inspecao) => {
    setInspections([...inspections, inspecao]);
    
    const status: Status = inspecao.pecasReprovadas > 0 ? 'reprovada' : 'aprovada';
    setOps(ops.map(op => 
      op.id === inspecao.opId ? { ...op, status } : op
    ));
    
    setSelectedOp(null);
  };

  const handleCancelInspection = () => {
    if (selectedOp) {
      setOps(ops.map(op => 
        op.id === selectedOp.id ? { ...op, status: 'pendente' } : op
      ));
    }
    setSelectedOp(null);
  };

  const handleAddOP = (op: OP) => {
    setOps([...ops, op]);
    setNextOpNumber(nextOpNumber + 1);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-red-900 text-white shadow-lg">
        <div className="container mx-auto px-6 py-4">
          <button
            onClick={onBack}
            className="flex items-center gap-2 text-red-200 hover:text-white mb-3 transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            Voltar ao Menu
          </button>
          <h1 className="text-2xl">Painel de Controle - Estação CARE Solda</h1>
          <p className="text-red-200 text-sm mt-1">Sistema de Inspeção e Controle de Qualidade</p>
          
          {/* Abas */}
          {!selectedOp && (
            <div className="flex gap-4 mt-4 border-t border-red-800 pt-3">
              <button
                onClick={() => setCurrentTab('dashboard')}
                className={`px-4 py-2 rounded-t transition-colors ${
                  currentTab === 'dashboard'
                    ? 'bg-white text-red-900'
                    : 'bg-red-800 text-red-200 hover:bg-red-700'
                }`}
              >
                <div className="flex items-center gap-2">
                  <Clipboard className="w-4 h-4" />
                  Dashboard
                </div>
              </button>
              <button
                onClick={() => setCurrentTab('historico')}
                className={`px-4 py-2 rounded-t transition-colors ${
                  currentTab === 'historico'
                    ? 'bg-white text-red-900'
                    : 'bg-red-800 text-red-200 hover:bg-red-700'
                }`}
              >
                <div className="flex items-center gap-2">
                  <History className="w-4 h-4" />
                  Histórico de Inspeções
                  {inspections.length > 0 && (
                    <span className="bg-red-500 text-white text-xs px-2 py-0.5 rounded-full">
                      {inspections.length}
                    </span>
                  )}
                </div>
              </button>
            </div>
          )}
        </div>
      </header>

      <main className="container mx-auto px-6 py-8">
        {selectedOp ? (
          <InspectionPanel 
            op={selectedOp} 
            onSubmit={handleSubmitInspection}
            onCancel={handleCancelInspection}
          />
        ) : currentTab === 'dashboard' ? (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="lg:col-span-2">
              <Dashboard 
                ops={ops}
                materiais={materiais}
                itens={itens}
                onPriorityChange={handlePriorityChange}
                onStartInspection={handleStartInspection}
                onAddOP={handleAddOP}
                nextOpNumber={nextOpNumber}
              />
            </div>
            <div>
              <WorkSequence ops={ops} />
            </div>
          </div>
        ) : (
          <HistoricoInspecoes ops={ops} inspections={inspections} />
        )}
      </main>
    </div>
  );
}