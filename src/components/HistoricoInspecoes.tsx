import { Clock, User, CheckCircle, XCircle, FileText } from 'lucide-react';
import type { OP, Inspecao } from '../App';

interface HistoricoInspecoesProps {
  ops: OP[];
  inspections: Inspecao[];
}

export function HistoricoInspecoes({ ops, inspections }: HistoricoInspecoesProps) {
  // Ordenar inspeções da mais recente para a mais antiga
  const sortedInspections = [...inspections].sort((a, b) => 
    new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime()
  );

  const getOPById = (opId: string) => {
    return ops.find(op => op.id === opId);
  };

  const formatDate = (timestamp: string) => {
    const date = new Date(timestamp);
    return date.toLocaleDateString('pt-BR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const getStatusColor = (inspecao: Inspecao) => {
    if (inspecao.pecasReprovadas === 0) return 'text-green-600 bg-green-50 border-green-200';
    if (inspecao.pecasReprovadas >= inspecao.pecasAprovadas) return 'text-red-600 bg-red-50 border-red-200';
    return 'text-yellow-600 bg-yellow-50 border-yellow-200';
  };

  const getStatusLabel = (inspecao: Inspecao) => {
    if (inspecao.pecasReprovadas === 0) return 'Aprovada';
    if (inspecao.pecasReprovadas >= inspecao.pecasAprovadas) return 'Reprovada';
    return 'Parcial';
  };

  return (
    <div className="bg-white rounded-lg shadow">
      <div className="p-6 border-b border-gray-200">
        <h2 className="text-xl flex items-center gap-2">
          <FileText className="w-5 h-5" />
          Histórico de Inspeções
        </h2>
        <p className="text-gray-500 text-sm mt-1">
          {inspections.length} {inspections.length === 1 ? 'inspeção realizada' : 'inspeções realizadas'}
        </p>
      </div>

      <div className="p-6">
        {sortedInspections.length === 0 ? (
          <div className="text-center py-12">
            <FileText className="w-16 h-16 text-gray-300 mx-auto mb-4" />
            <p className="text-gray-500">Nenhuma inspeção realizada ainda</p>
            <p className="text-gray-400 text-sm mt-1">
              As inspeções concluídas aparecerão aqui
            </p>
          </div>
        ) : (
          <div className="space-y-4">
            {sortedInspections.map((inspecao) => {
              const op = getOPById(inspecao.opId);
              if (!op) return null;

              return (
                <div
                  key={`${inspecao.opId}-${inspecao.timestamp}`}
                  className={`border-2 rounded-lg p-5 ${getStatusColor(inspecao)}`}
                >
                  {/* Cabeçalho */}
                  <div className="flex items-start justify-between mb-4">
                    <div>
                      <div className="flex items-center gap-3">
                        <h3 className="font-mono">{op.numero}</h3>
                        <span className={`px-3 py-1 text-sm rounded-full border ${getStatusColor(inspecao)}`}>
                          {getStatusLabel(inspecao)}
                        </span>
                      </div>
                      <p className="text-gray-700 mt-1">{op.pecaNome || op.peca}</p>
                    </div>
                    <div className="text-right">
                      <div className="flex items-center gap-2 text-sm text-gray-600">
                        <Clock className="w-4 h-4" />
                        {formatDate(inspecao.timestamp)}
                      </div>
                      {op.operador && (
                        <div className="flex items-center gap-2 text-sm text-gray-600 mt-1">
                          <User className="w-4 h-4" />
                          {op.operador}
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Estatísticas da Inspeção */}
                  <div className="grid grid-cols-3 gap-4 mb-4">
                    <div className="bg-white bg-opacity-50 rounded p-3 text-center">
                      <p className="text-sm text-gray-600 mb-1">Peças Inspecionadas</p>
                      <p className="text-2xl">{inspecao.pecasInspecionadas}</p>
                    </div>
                    <div className="bg-white bg-opacity-50 rounded p-3 text-center">
                      <div className="flex items-center justify-center gap-2 mb-1">
                        <CheckCircle className="w-4 h-4 text-green-600" />
                        <p className="text-sm text-gray-600">Aprovadas</p>
                      </div>
                      <p className="text-2xl text-green-600">{inspecao.pecasAprovadas}</p>
                      <p className="text-xs text-gray-500 mt-1">
                        {((inspecao.pecasAprovadas / inspecao.pecasInspecionadas) * 100).toFixed(1)}%
                      </p>
                    </div>
                    <div className="bg-white bg-opacity-50 rounded p-3 text-center">
                      <div className="flex items-center justify-center gap-2 mb-1">
                        <XCircle className="w-4 h-4 text-red-600" />
                        <p className="text-sm text-gray-600">Reprovadas</p>
                      </div>
                      <p className="text-2xl text-red-600">{inspecao.pecasReprovadas}</p>
                      <p className="text-xs text-gray-500 mt-1">
                        {((inspecao.pecasReprovadas / inspecao.pecasInspecionadas) * 100).toFixed(1)}%
                      </p>
                    </div>
                  </div>

                  {/* Cotas Defeituosas */}
                  {inspecao.cotasDefeituosas && inspecao.cotasDefeituosas.length > 0 && (
                    <div className="bg-white bg-opacity-50 rounded p-3 mb-3">
                      <p className="text-sm text-gray-700 mb-2">Cotas/Problemas Identificados:</p>
                      <div className="flex flex-wrap gap-2">
                        {inspecao.cotasDefeituosas.map((cota, idx) => (
                          <span
                            key={idx}
                            className="px-2 py-1 bg-red-100 text-red-700 text-xs rounded border border-red-200"
                          >
                            {cota}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Observações */}
                  {inspecao.observacoes && (
                    <div className="bg-white bg-opacity-50 rounded p-3">
                      <p className="text-sm text-gray-700 mb-1">Observações:</p>
                      <p className="text-sm text-gray-800">{inspecao.observacoes}</p>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
