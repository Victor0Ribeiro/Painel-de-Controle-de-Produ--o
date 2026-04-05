import { AlertTriangle, Clock, CheckCircle, XCircle, Plus, Save, X } from 'lucide-react';
import type { OP, Priority, Material, Item } from '../App';
import { OPCard } from './OPCard';
import { useState } from 'react';

interface DashboardProps {
  ops: OP[];
  materiais: Material[];
  itens: Item[];
  onPriorityChange: (opId: string, priority: Priority) => void;
  onStartInspection: (op: OP) => void;
  onAddOP?: (op: OP) => void;
  nextOpNumber: number;
}

export function Dashboard({ ops, materiais, itens, onPriorityChange, onStartInspection, onAddOP, nextOpNumber }: DashboardProps) {
  const [showNewOPForm, setShowNewOPForm] = useState(false);
  const [opNumero, setOpNumero] = useState('');
  const [opItemCodigo, setOpItemCodigo] = useState('');
  const [opDescricao, setOpDescricao] = useState('');
  const [opLote, setOpLote] = useState(10);
  const [opQuantInspecionar, setOpQuantInspecionar] = useState(5);
  const [opPrioridade, setOpPrioridade] = useState<Priority>('media');
  const [opProblemas, setOpProblemas] = useState('');
  const [opDataEntrega, setOpDataEntrega] = useState('');
  const [isManualOP, setIsManualOP] = useState(false);

  const pendingOps = ops.filter(op => op.status === 'pendente');
  const inProgressOps = ops.filter(op => op.status === 'em-inspecao');
  const completedOps = ops.filter(op => op.status === 'aprovada' || op.status === 'reprovada');
  const highPriorityCount = ops.filter(op => op.prioridade === 'alta' && op.status === 'pendente').length;

  const getNextOPNumber = () => {
    if (ops.length === 0) return 'OP-000001';
    const numbers = ops.map(op => {
      const match = op.numero.match(/OP-(\d+)/);
      return match ? parseInt(match[1]) : 0;
    });
    const maxNumber = Math.max(...numbers);
    return `OP-${String(maxNumber + 1).padStart(6, '0')}`;
  };

  // Buscar item pelo código (sem zeros à esquerda)
  const getItemByCodigo = (codigo: string) => {
    // Criar lista combinada de todos os itens (materiais + itens)
    const todosItens = [...materiais, ...itens];
    return todosItens.find(item => item.codigo === codigo.padStart(6, '0'));
  };

  const handleItemCodigoChange = (codigo: string) => {
    // Aceitar apenas números
    const numericCodigo = codigo.replace(/\D/g, '');
    setOpItemCodigo(numericCodigo);
  };

  // Item encontrado baseado no código digitado
  const itemEncontrado = opItemCodigo ? getItemByCodigo(opItemCodigo) : null;

  const handleSubmitNewOP = (e: React.FormEvent) => {
    e.preventDefault();
    if (!onAddOP) return;

    const opNumber = isManualOP && opNumero ? opNumero : getNextOPNumber();

    const newOP: OP = {
      id: Date.now().toString(),
      numero: opNumber,
      peca: opItemCodigo,
      descricao: opDescricao,
      lote: opLote,
      quantidadeInspecionar: opQuantInspecionar,
      prioridade: opPrioridade,
      status: 'pendente',
      dataEntrada: new Date().toISOString(),
      dataEntrega: opDataEntrega ? new Date(opDataEntrega).toISOString() : '',
      historico: {
        totalInspecoes: 0,
        taxaDefeito: 0
      },
      problemas: opProblemas ? opProblemas.split(',').map(p => p.trim()) : []
    };

    onAddOP(newOP);
    setOpNumero('');
    setOpItemCodigo('');
    setOpDescricao('');
    setOpLote(10);
    setOpQuantInspecionar(5);
    setOpPrioridade('media');
    setOpProblemas('');
    setOpDataEntrega('');
    setIsManualOP(false);
    setShowNewOPForm(false);
  };

  return (
    <div className="space-y-6">
      {/* Estatísticas */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-white rounded-lg shadow p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-500 text-sm">Pendentes</p>
              <p className="text-2xl mt-1">{pendingOps.length}</p>
            </div>
            <Clock className="w-8 h-8 text-orange-500" />
          </div>
        </div>

        <div className="bg-white rounded-lg shadow p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-500 text-sm">Em Inspeção</p>
              <p className="text-2xl mt-1">{inProgressOps.length}</p>
            </div>
            <AlertTriangle className="w-8 h-8 text-blue-500" />
          </div>
        </div>

        <div className="bg-white rounded-lg shadow p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-500 text-sm">Concluídas</p>
              <p className="text-2xl mt-1">{completedOps.length}</p>
            </div>
            <CheckCircle className="w-8 h-8 text-green-500" />
          </div>
        </div>

        <div className="bg-white rounded-lg shadow p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-500 text-sm">Prioridade Alta</p>
              <p className="text-2xl mt-1">{highPriorityCount}</p>
            </div>
            <XCircle className="w-8 h-8 text-red-500" />
          </div>
        </div>
      </div>

      {/* Lista de OPs */}
      <div className="bg-white rounded-lg shadow">
        <div className="p-6 border-b border-gray-200 flex items-center justify-between">
          <div>
            <h2 className="text-xl">Ordens de Produção</h2>
            <p className="text-gray-500 text-sm mt-1">
              Gerencie as inspeções e prioridades das OPs
            </p>
          </div>
          {onAddOP && (
            <button
              onClick={() => setShowNewOPForm(!showNewOPForm)}
              className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 flex items-center gap-2"
            >
              {showNewOPForm ? <X className="w-4 h-4" /> : <Plus className="w-4 h-4" />}
              {showNewOPForm ? 'Cancelar' : 'Nova OP'}
            </button>
          )}
        </div>

        {showNewOPForm && onAddOP && (
          <form onSubmit={handleSubmitNewOP} className="p-6 bg-blue-50 border-b border-blue-200">
            <h3 className="mb-4">Nova Ordem de Produção</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="md:col-span-2">
                <div className="flex items-center gap-3 mb-3">
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={isManualOP}
                      onChange={(e) => setIsManualOP(e.target.checked)}
                      className="w-4 h-4 rounded"
                    />
                    <span className="text-sm">Inserir número da OP manualmente</span>
                  </label>
                </div>
                {isManualOP ? (
                  <div>
                    <label className="block text-sm mb-1">Número da OP</label>
                    <input
                      type="text"
                      value={opNumero}
                      onChange={(e) => setOpNumero(e.target.value)}
                      placeholder="Ex: OP-000005"
                      className="w-full px-3 py-2 border rounded focus:ring-2 focus:ring-blue-500"
                      required
                    />
                  </div>
                ) : (
                  <div className="p-3 bg-blue-100 border border-blue-300 rounded">
                    <p className="text-sm text-blue-700 mb-1">Número será gerado automaticamente</p>
                    <p className="font-mono text-blue-900 text-lg">{getNextOPNumber()}</p>
                  </div>
                )}
              </div>

              <div className="md:col-span-2">
                <label className="block text-sm mb-1">Código do Item (apenas números)</label>
                <input
                  type="text"
                  value={opItemCodigo}
                  onChange={(e) => handleItemCodigoChange(e.target.value)}
                  placeholder="Digite o código do item (ex: 5 para 000005)"
                  className="w-full px-3 py-2 border rounded focus:ring-2 focus:ring-blue-500"
                  required
                />
              </div>

              <div className="md:col-span-2">
                <label className="block text-sm mb-1 text-gray-500">Nome da Peça (automático)</label>
                <div className="px-3 py-2 border rounded bg-gray-100 text-gray-700 min-h-[42px] flex items-center">
                  {itemEncontrado ? (
                    <span>{itemEncontrado.descricao}</span>
                  ) : opItemCodigo ? (
                    <span className="text-red-500 text-sm">Item não encontrado</span>
                  ) : (
                    <span className="text-gray-400 text-sm">Insira um código de item válido</span>
                  )}
                </div>
              </div>

              <div className="md:col-span-2">
                <label className="block text-sm mb-1">Descrição</label>
                <input
                  type="text"
                  value={opDescricao}
                  onChange={(e) => setOpDescricao(e.target.value)}
                  placeholder="Descrição da peça a ser inspecionada"
                  className="w-full px-3 py-2 border rounded focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div>
                <label className="block text-sm mb-1">Quantidade (Lote)</label>
                <input
                  type="number"
                  min="1"
                  value={opLote}
                  onChange={(e) => setOpLote(Number(e.target.value))}
                  className="w-full px-3 py-2 border rounded focus:ring-2 focus:ring-blue-500"
                  required
                />
              </div>

              <div>
                <label className="block text-sm mb-1">Quantidade a Inspecionar</label>
                <input
                  type="number"
                  min="1"
                  value={opQuantInspecionar}
                  onChange={(e) => setOpQuantInspecionar(Number(e.target.value))}
                  className="w-full px-3 py-2 border rounded focus:ring-2 focus:ring-blue-500"
                  required
                />
              </div>

              <div>
                <label className="block text-sm mb-1">Prioridade</label>
                <select
                  value={opPrioridade}
                  onChange={(e) => setOpPrioridade(e.target.value as Priority)}
                  className="w-full px-3 py-2 border rounded focus:ring-2 focus:ring-blue-500"
                >
                  <option value="baixa">Baixa</option>
                  <option value="media">Média</option>
                  <option value="alta">Alta</option>
                </select>
              </div>

              <div className="md:col-span-2">
                <label className="block text-sm mb-1">Problemas</label>
                <input
                  type="text"
                  value={opProblemas}
                  onChange={(e) => setOpProblemas(e.target.value)}
                  placeholder="Problemas conhecidos (separados por vírgula)"
                  className="w-full px-3 py-2 border rounded focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div className="md:col-span-2">
                <label className="block text-sm mb-1">Data de Entrega</label>
                <input
                  type="date"
                  value={opDataEntrega}
                  onChange={(e) => setOpDataEntrega(e.target.value)}
                  className="w-full px-3 py-2 border rounded focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div className="md:col-span-2">
                <button
                  type="submit"
                  className="w-full px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700 flex items-center justify-center gap-2"
                >
                  <Save className="w-4 h-4" />
                  Criar Ordem de Produção
                </button>
              </div>
            </div>
          </form>
        )}

        <div className="divide-y divide-gray-200">
          {ops.length === 0 ? (
            <div className="p-8 text-center text-gray-500">
              Nenhuma ordem de produção cadastrada
            </div>
          ) : (
            ops
              .sort((a, b) => {
                const priorityOrder = { alta: 0, media: 1, baixa: 2 };
                if (a.prioridade !== b.prioridade) {
                  return priorityOrder[a.prioridade] - priorityOrder[b.prioridade];
                }
                return new Date(a.dataEntrada).getTime() - new Date(b.dataEntrada).getTime();
              })
              .map(op => (
                <OPCard
                  key={op.id}
                  op={op}
                  onPriorityChange={onPriorityChange}
                  onStartInspection={onStartInspection}
                />
              ))
          )}
        </div>
      </div>
    </div>
  );
}