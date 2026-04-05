import { useState } from 'react';
import { ArrowLeft, Save, AlertTriangle, CheckCircle, XCircle, Plus, X } from 'lucide-react';
import type { OP, Inspecao } from '../App';

interface InspectionPanelProps {
  op: OP;
  onSubmit: (inspecao: Inspecao) => void;
  onCancel: () => void;
}

export function InspectionPanel({ op, onSubmit, onCancel }: InspectionPanelProps) {
  const [pecasInspecionadas, setPecasInspecionadas] = useState(0);
  const [pecasAprovadas, setPecasAprovadas] = useState(0);
  const [pecasReprovadas, setPecasReprovadas] = useState(0);
  const [cotasDefeituosas, setCotasDefeituosas] = useState<string[]>([]);
  const [novaCota, setNovaCota] = useState('');
  const [observacoes, setObservacoes] = useState('');

  const handleAddCota = () => {
    if (novaCota.trim()) {
      setCotasDefeituosas([...cotasDefeituosas, novaCota.trim()]);
      setNovaCota('');
    }
  };

  const handleRemoveCota = (index: number) => {
    setCotasDefeituosas(cotasDefeituosas.filter((_, i) => i !== index));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    const inspecao: Inspecao = {
      opId: op.id,
      cotasDefeituosas,
      observacoes,
      pecasInspecionadas,
      pecasAprovadas,
      pecasReprovadas,
      timestamp: new Date().toISOString()
    };

    onSubmit(inspecao);
  };

  const totalContabilizado = pecasAprovadas + pecasReprovadas;
  const progressoPercentual = (pecasInspecionadas / op.quantidadeInspecionar) * 100;

  return (
    <div className="bg-white rounded-lg shadow-lg">
      {/* Header */}
      <div className="p-6 border-b border-gray-200 bg-blue-50">
        <button
          onClick={onCancel}
          className="flex items-center gap-2 text-blue-600 hover:text-blue-800 mb-4"
        >
          <ArrowLeft className="w-4 h-4" />
          Voltar ao painel
        </button>

        <div className="flex items-start justify-between">
          <div>
            <h2 className="text-2xl mb-2">Inspeção em Andamento</h2>
            <p className="text-gray-600">{op.numero} - {op.peca}</p>
          </div>
          <div className="text-right">
            <p className="text-sm text-gray-500">Lote total</p>
            <p className="text-2xl">{op.lote} peças</p>
          </div>
        </div>
      </div>

      {/* Alertas do Histórico */}
      <div className="p-6 bg-yellow-50 border-b border-yellow-200">
        <div className="flex items-start gap-3">
          <AlertTriangle className="w-5 h-5 text-yellow-600 mt-0.5" />
          <div className="flex-1">
            <p className="mb-2">
              <strong>Atenção:</strong> Esta peça possui taxa de defeito de {op.historico.taxaDefeito}%
            </p>
            {op.problemas.length > 0 && (
              <div>
                <p className="text-sm mb-1">Problemas recorrentes:</p>
                <ul className="list-disc list-inside text-sm space-y-1">
                  {op.problemas.map((problema, index) => (
                    <li key={index}>{problema}</li>
                  ))}
                </ul>
              </div>
            )}
          </div>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="p-6 space-y-6">
        {/* Progresso da Inspeção */}
        <div>
          <div className="flex items-center justify-between mb-2">
            <label className="block">Progresso da Inspeção</label>
            <span className="text-sm text-gray-500">
              {pecasInspecionadas} de {op.quantidadeInspecionar} peças
            </span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-3">
            <div
              className="bg-blue-600 h-3 rounded-full transition-all duration-300"
              style={{ width: `${Math.min(progressoPercentual, 100)}%` }}
            ></div>
          </div>
        </div>

        {/* Contadores */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="border rounded-lg p-4">
            <label className="block text-sm text-gray-500 mb-2">
              Peças Inspecionadas
            </label>
            <input
              type="number"
              min="0"
              max={op.quantidadeInspecionar}
              value={pecasInspecionadas}
              onChange={(e) => setPecasInspecionadas(Number(e.target.value))}
              className="w-full text-2xl border-0 p-0 focus:ring-0"
              required
            />
          </div>

          <div className="border border-green-200 bg-green-50 rounded-lg p-4">
            <label className="block text-sm text-green-700 mb-2 flex items-center gap-2">
              <CheckCircle className="w-4 h-4" />
              Peças Aprovadas
            </label>
            <input
              type="number"
              min="0"
              value={pecasAprovadas}
              onChange={(e) => setPecasAprovadas(Number(e.target.value))}
              className="w-full text-2xl bg-transparent border-0 p-0 focus:ring-0 text-green-700"
              required
            />
          </div>

          <div className="border border-red-200 bg-red-50 rounded-lg p-4">
            <label className="block text-sm text-red-700 mb-2 flex items-center gap-2">
              <XCircle className="w-4 h-4" />
              Peças Reprovadas
            </label>
            <input
              type="number"
              min="0"
              value={pecasReprovadas}
              onChange={(e) => setPecasReprovadas(Number(e.target.value))}
              className="w-full text-2xl bg-transparent border-0 p-0 focus:ring-0 text-red-700"
              required
            />
          </div>
        </div>

        {totalContabilizado !== pecasInspecionadas && pecasInspecionadas > 0 && (
          <div className="p-3 bg-yellow-50 border border-yellow-200 rounded text-sm text-yellow-800">
            ⚠️ Atenção: Total de aprovadas + reprovadas ({totalContabilizado}) não corresponde às peças inspecionadas ({pecasInspecionadas})
          </div>
        )}

        {/* Cotas Defeituosas */}
        <div>
          <label className="block mb-2">Cotas Encontradas com Defeito</label>
          <div className="flex gap-2 mb-3">
            <input
              type="text"
              value={novaCota}
              onChange={(e) => setNovaCota(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), handleAddCota())}
              placeholder="Ex: Ø50±0.1, Comprimento 200±0.5"
              className="flex-1 px-4 py-2 border border-gray-300 rounded focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
            <button
              type="button"
              onClick={handleAddCota}
              className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 flex items-center gap-2"
            >
              <Plus className="w-4 h-4" />
              Adicionar
            </button>
          </div>

          {cotasDefeituosas.length > 0 && (
            <div className="space-y-2">
              {cotasDefeituosas.map((cota, index) => (
                <div
                  key={index}
                  className="flex items-center justify-between p-3 bg-red-50 border border-red-200 rounded"
                >
                  <span>{cota}</span>
                  <button
                    type="button"
                    onClick={() => handleRemoveCota(index)}
                    className="text-red-600 hover:text-red-800"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Observações */}
        <div>
          <label className="block mb-2">Observações Gerais da Inspeção</label>
          <textarea
            value={observacoes}
            onChange={(e) => setObservacoes(e.target.value)}
            rows={6}
            placeholder="Descreva detalhes da inspeção, problemas encontrados, condições especiais, etc."
            className="w-full px-4 py-2 border border-gray-300 rounded focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
          />
        </div>

        {/* Botões de Ação */}
        <div className="flex gap-3 pt-4 border-t">
          <button
            type="button"
            onClick={onCancel}
            className="px-6 py-3 border border-gray-300 rounded hover:bg-gray-50 transition-colors"
          >
            Cancelar
          </button>
          <button
            type="submit"
            disabled={pecasInspecionadas === 0 || totalContabilizado !== pecasInspecionadas}
            className="flex-1 px-6 py-3 bg-green-600 text-white rounded hover:bg-green-700 disabled:bg-gray-300 disabled:cursor-not-allowed transition-colors flex items-center justify-center gap-2"
          >
            <Save className="w-5 h-5" />
            Finalizar Inspeção
          </button>
        </div>
      </form>
    </div>
  );
}
