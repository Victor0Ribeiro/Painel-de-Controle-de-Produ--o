import { Calendar, Package, TrendingUp, AlertCircle, Play, CheckCircle, XCircle, User } from 'lucide-react';
import type { OP, Priority } from '../App';

interface OPCardProps {
  op: OP;
  onPriorityChange: (opId: string, priority: Priority) => void;
  onStartInspection: (op: OP) => void;
}

export function OPCard({ op, onPriorityChange, onStartInspection }: OPCardProps) {
  const priorityColors = {
    alta: 'bg-red-100 text-red-800 border-red-300',
    media: 'bg-yellow-100 text-yellow-800 border-yellow-300',
    baixa: 'bg-green-100 text-green-800 border-green-300'
  };

  const statusColors = {
    pendente: 'bg-gray-100 text-gray-800',
    'em-inspecao': 'bg-blue-100 text-blue-800',
    concluida: 'bg-green-100 text-green-800',
    aprovada: 'bg-green-100 text-green-800',
    reprovada: 'bg-red-100 text-red-800'
  };

  const statusLabels = {
    pendente: 'Pendente',
    'em-inspecao': 'Em Inspeção',
    concluida: 'Concluída',
    aprovada: 'Aprovada',
    reprovada: 'Reprovada'
  };

  const formatDate = (dateStr: string) => {
    const date = new Date(dateStr);
    return date.toLocaleString('pt-BR', { 
      day: '2-digit', 
      month: '2-digit', 
      hour: '2-digit', 
      minute: '2-digit' 
    });
  };

  return (
    <div className="p-6 hover:bg-gray-50 transition-colors">
      <div className="flex items-start justify-between mb-4">
        <div className="flex-1">
          <div className="flex items-center gap-3 mb-2">
            <h3 className="text-lg">{op.numero}</h3>
            <span className={`px-2 py-1 rounded text-xs ${statusColors[op.status]}`}>
              {statusLabels[op.status]}
            </span>
          </div>
          <p className="text-gray-600">{op.peca}</p>
        </div>

        <div className="flex items-center gap-2">
          <select
            value={op.prioridade}
            onChange={(e) => onPriorityChange(op.id, e.target.value as Priority)}
            className={`px-3 py-1 rounded border text-sm ${priorityColors[op.prioridade]}`}
            disabled={op.status !== 'pendente'}
          >
            <option value="alta">Alta</option>
            <option value="media">Média</option>
            <option value="baixa">Baixa</option>
          </select>

          {op.status === 'pendente' && (
            <button
              onClick={() => onStartInspection(op)}
              className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition-colors flex items-center gap-2"
            >
              <Play className="w-4 h-4" />
              Iniciar Inspeção
            </button>
          )}

          {op.status === 'aprovada' && (
            <CheckCircle className="w-6 h-6 text-green-600" />
          )}

          {op.status === 'reprovada' && (
            <XCircle className="w-6 h-6 text-red-600" />
          )}
        </div>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4">
        <div className="flex items-center gap-2 text-sm text-gray-600">
          <Calendar className="w-4 h-4" />
          <span>{formatDate(op.dataEntrada)}</span>
        </div>

        <div className="flex items-center gap-2 text-sm text-gray-600">
          <Package className="w-4 h-4" />
          <span>Lote: {op.lote} peças</span>
        </div>

        <div className="flex items-center gap-2 text-sm text-gray-600">
          <TrendingUp className="w-4 h-4" />
          <span>Inspecionar: {op.quantidadeInspecionar}</span>
        </div>

        {op.operador && (
          <div className="flex items-center gap-2 text-sm text-gray-600">
            <User className="w-4 h-4" />
            <span>{op.operador}</span>
          </div>
        )}
      </div>

      {/* Histórico e Problemas */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 p-4 bg-gray-50 rounded-lg">
        <div>
          <p className="text-sm text-gray-500 mb-2">Histórico</p>
          <div className="space-y-1">
            <p className="text-sm">
              <span className="text-gray-600">Total de inspeções:</span>{' '}
              <span>{op.historico.totalInspecoes}</span>
            </p>
            <p className="text-sm">
              <span className="text-gray-600">Taxa de defeito:</span>{' '}
              <span className={op.historico.taxaDefeito > 10 ? 'text-red-600' : 'text-green-600'}>
                {op.historico.taxaDefeito}%
              </span>
            </p>
          </div>
        </div>

        <div>
          <p className="text-sm text-gray-500 mb-2">Principais Problemas</p>
          <div className="space-y-1">
            {op.problemas.length === 0 ? (
              <p className="text-sm text-gray-400">Nenhum problema recorrente</p>
            ) : (
              op.problemas.map((problema, index) => (
                <div key={index} className="flex items-start gap-2">
                  <AlertCircle className="w-4 h-4 text-orange-500 mt-0.5 flex-shrink-0" />
                  <p className="text-sm">{problema}</p>
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
