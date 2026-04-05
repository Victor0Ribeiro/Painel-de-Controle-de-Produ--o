import { Clock, ArrowRight } from 'lucide-react';
import type { OP } from '../App';

interface WorkSequenceProps {
  ops: OP[];
}

export function WorkSequence({ ops }: WorkSequenceProps) {
  const pendingOps = ops
    .filter(op => op.status === 'pendente')
    .sort((a, b) => {
      const priorityOrder = { alta: 0, media: 1, baixa: 2 };
      if (a.prioridade !== b.prioridade) {
        return priorityOrder[a.prioridade] - priorityOrder[b.prioridade];
      }
      return new Date(a.dataEntrada).getTime() - new Date(b.dataEntrada).getTime();
    });

  const priorityColors = {
    alta: 'border-l-red-500',
    media: 'border-l-yellow-500',
    baixa: 'border-l-green-500'
  };

  const priorityBgColors = {
    alta: 'bg-red-50',
    media: 'bg-yellow-50',
    baixa: 'bg-green-50'
  };

  return (
    <div className="bg-white rounded-lg shadow sticky top-8">
      <div className="p-6 border-b border-gray-200">
        <div className="flex items-center gap-2">
          <Clock className="w-5 h-5 text-blue-600" />
          <h2 className="text-xl">Sequência de Trabalho</h2>
        </div>
        <p className="text-gray-500 text-sm mt-1">
          {pendingOps.length} {pendingOps.length === 1 ? 'OP pendente' : 'OPs pendentes'}
        </p>
      </div>

      <div className="p-6">
        {pendingOps.length === 0 ? (
          <div className="text-center py-8 text-gray-500">
            <Clock className="w-12 h-12 mx-auto mb-3 text-gray-300" />
            <p>Nenhuma OP pendente</p>
          </div>
        ) : (
          <div className="space-y-3">
            {pendingOps.map((op, index) => (
              <div key={op.id}>
                <div
                  className={`border-l-4 ${priorityColors[op.prioridade]} ${priorityBgColors[op.prioridade]} p-4 rounded-r`}
                >
                  <div className="flex items-start justify-between mb-2">
                    <div className="flex items-center gap-2">
                      <span className="flex items-center justify-center w-6 h-6 rounded-full bg-white text-sm">
                        {index + 1}
                      </span>
                      <span className="text-sm uppercase tracking-wide text-gray-500">
                        {op.prioridade}
                      </span>
                    </div>
                    <span className="text-xs text-gray-500">{op.numero}</span>
                  </div>

                  <p className="mb-2">{op.peca}</p>

                  <div className="flex items-center justify-between text-sm text-gray-600">
                    <span>{op.quantidadeInspecionar} peças</span>
                    {op.historico.taxaDefeito > 10 && (
                      <span className="text-red-600 text-xs">
                        ⚠️ {op.historico.taxaDefeito}% defeito
                      </span>
                    )}
                  </div>
                </div>

                {index < pendingOps.length - 1 && (
                  <div className="flex justify-center py-2">
                    <ArrowRight className="w-4 h-4 text-gray-400 rotate-90" />
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Legenda */}
      <div className="p-6 border-t border-gray-200 bg-gray-50">
        <p className="text-sm text-gray-600 mb-3">Prioridades:</p>
        <div className="space-y-2">
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 bg-red-500 rounded"></div>
            <span className="text-sm text-gray-600">Alta - Histórico crítico ou urgente</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 bg-yellow-500 rounded"></div>
            <span className="text-sm text-gray-600">Média - Inspeção padrão</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 bg-green-500 rounded"></div>
            <span className="text-sm text-gray-600">Baixa - Histórico favorável</span>
          </div>
        </div>
      </div>
    </div>
  );
}
