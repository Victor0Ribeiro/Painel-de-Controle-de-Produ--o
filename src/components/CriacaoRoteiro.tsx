import { useState } from 'react';
import { ArrowLeft, Plus, Save, Route, Package, ArrowRight, CheckCircle } from 'lucide-react';
import type { Item, Roteiro, EtapaRoteiro } from '../App';

interface CriacaoRoteiroProps {
  itens: Item[];
  roteiros: Roteiro[];
  onAddRoteiro: (roteiro: Roteiro) => void;
  onBack: () => void;
}

export function CriacaoRoteiro({ itens, roteiros, onAddRoteiro, onBack }: CriacaoRoteiroProps) {
  const [showForm, setShowForm] = useState(false);
  const [selectedItemId, setSelectedItemId] = useState('');
  const [etapas, setEtapas] = useState<EtapaRoteiro[]>([]);
  const [observacoes, setObservacoes] = useState('');

  const etapasDisponiveis: { value: EtapaRoteiro; label: string; color: string }[] = [
    { value: 'corte', label: 'Corte', color: 'bg-blue-500' },
    { value: 'servico-externo', label: 'Serviço Externo', color: 'bg-indigo-500' },
    { value: 'solda', label: 'Solda', color: 'bg-orange-500' },
    { value: 'acabamento', label: 'Acabamento', color: 'bg-yellow-500' },
    { value: 'jato', label: 'Jato', color: 'bg-gray-500' },
    { value: 'pintura', label: 'Pintura', color: 'bg-green-500' },
    { value: 'montagem', label: 'Montagem', color: 'bg-purple-500' },
    { value: 'embalagem', label: 'Embalagem', color: 'bg-pink-500' },
  ];

  const handleToggleEtapa = (etapa: EtapaRoteiro) => {
    if (etapas.includes(etapa)) {
      setEtapas(etapas.filter(e => e !== etapa));
    } else {
      setEtapas([...etapas, etapa]);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const newRoteiro: Roteiro = {
      id: Date.now().toString(),
      itemId: selectedItemId,
      etapas,
      observacoes,
    };
    onAddRoteiro(newRoteiro);
    setSelectedItemId('');
    setEtapas([]);
    setObservacoes('');
    setShowForm(false);
  };

  const getItemById = (id: string) => {
    return itens.find(item => item.id === id);
  };

  const getEtapaInfo = (etapa: EtapaRoteiro) => {
    return etapasDisponiveis.find(e => e.value === etapa);
  };

  const moveEtapaUp = (index: number) => {
    if (index > 0) {
      const newEtapas = [...etapas];
      [newEtapas[index - 1], newEtapas[index]] = [newEtapas[index], newEtapas[index - 1]];
      setEtapas(newEtapas);
    }
  };

  const moveEtapaDown = (index: number) => {
    if (index < etapas.length - 1) {
      const newEtapas = [...etapas];
      [newEtapas[index], newEtapas[index + 1]] = [newEtapas[index + 1], newEtapas[index]];
      setEtapas(newEtapas);
    }
  };

  return (
    <div>
      <header className="bg-orange-900 text-white shadow-lg">
        <div className="container mx-auto px-6 py-4">
          <button
            onClick={onBack}
            className="flex items-center gap-2 text-orange-200 hover:text-white mb-3 transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            Voltar
          </button>
          <h1 className="text-2xl">Criação de Roteiros</h1>
          <p className="text-orange-200 text-sm mt-1">Defina o fluxo de produção de cada peça</p>
        </div>
      </header>

      <main className="container mx-auto px-6 py-8">
        {itens.length === 0 ? (
          <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-6 text-center max-w-2xl mx-auto">
            <Package className="w-12 h-12 text-yellow-500 mx-auto mb-3" />
            <p className="text-yellow-800">
              Você precisa cadastrar itens primeiro antes de criar roteiros.
            </p>
            <p className="text-sm text-yellow-600 mt-2">
              Volte à tela inicial e acesse "Criação de Itens"
            </p>
          </div>
        ) : (
          <div className="max-w-6xl mx-auto">
            <div className="bg-white rounded-lg shadow">
              <div className="p-6 border-b border-gray-200 flex items-center justify-between">
                <div>
                  <h2 className="text-xl flex items-center gap-2">
                    <Route className="w-5 h-5" />
                    Roteiros de Produção
                  </h2>
                  <p className="text-gray-500 text-sm mt-1">{roteiros.length} roteiros cadastrados</p>
                </div>
                <button
                  onClick={() => setShowForm(!showForm)}
                  className="px-4 py-2 bg-orange-600 text-white rounded hover:bg-orange-700 flex items-center gap-2"
                >
                  <Plus className="w-4 h-4" />
                  Novo Roteiro
                </button>
              </div>

              {showForm && (
                <form onSubmit={handleSubmit} className="p-6 bg-orange-50 border-b border-orange-200">
                  <h3 className="mb-4">Novo Roteiro</h3>
                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm mb-1">Selecione o Item</label>
                      <select
                        value={selectedItemId}
                        onChange={(e) => setSelectedItemId(e.target.value)}
                        className="w-full px-3 py-2 border rounded focus:ring-2 focus:ring-orange-500"
                        required
                      >
                        <option value="">Escolha um item</option>
                        {itens.map((item) => (
                          <option key={item.id} value={item.id}>
                            {item.codigo} - {item.descricao}
                          </option>
                        ))}
                      </select>
                    </div>

                    <div className="border-t pt-4">
                      <label className="block text-sm mb-3">Etapas do Roteiro</label>
                      <p className="text-xs text-gray-600 mb-3">
                        Selecione as etapas que esta peça passará durante a produção (a ordem pode ser ajustada depois)
                      </p>
                      <div className="grid grid-cols-2 md:grid-cols-4 gap-2 mb-4">
                        {etapasDisponiveis.map((etapa) => (
                          <button
                            key={etapa.value}
                            type="button"
                            onClick={() => handleToggleEtapa(etapa.value)}
                            className={`p-3 rounded border-2 transition-all ${
                              etapas.includes(etapa.value)
                                ? `${etapa.color} text-white border-transparent`
                                : 'bg-white text-gray-700 border-gray-300 hover:border-gray-400'
                            }`}
                          >
                            <div className="flex items-center justify-between">
                              <span className="text-sm">{etapa.label}</span>
                              {etapas.includes(etapa.value) && <CheckCircle className="w-4 h-4" />}
                            </div>
                          </button>
                        ))}
                      </div>

                      {etapas.length > 0 && (
                        <div className="bg-white border rounded p-4">
                          <p className="text-sm mb-3">Sequência de produção:</p>
                          <div className="space-y-2">
                            {etapas.map((etapa, index) => {
                              const info = getEtapaInfo(etapa);
                              return (
                                <div key={index}>
                                  <div className="flex items-center gap-3">
                                    <span className="flex items-center justify-center w-8 h-8 rounded-full bg-gray-200 text-sm">
                                      {index + 1}
                                    </span>
                                    <div className={`flex-1 p-3 ${info?.color} text-white rounded flex items-center justify-between`}>
                                      <span>{info?.label}</span>
                                      <div className="flex gap-1">
                                        <button
                                          type="button"
                                          onClick={() => moveEtapaUp(index)}
                                          disabled={index === 0}
                                          className="px-2 py-1 bg-white bg-opacity-20 rounded hover:bg-opacity-30 disabled:opacity-50 disabled:cursor-not-allowed text-xs"
                                        >
                                          ↑
                                        </button>
                                        <button
                                          type="button"
                                          onClick={() => moveEtapaDown(index)}
                                          disabled={index === etapas.length - 1}
                                          className="px-2 py-1 bg-white bg-opacity-20 rounded hover:bg-opacity-30 disabled:opacity-50 disabled:cursor-not-allowed text-xs"
                                        >
                                          ↓
                                        </button>
                                      </div>
                                    </div>
                                  </div>
                                  {index < etapas.length - 1 && (
                                    <div className="flex justify-center py-1">
                                      <ArrowRight className="w-4 h-4 text-gray-400 rotate-90" />
                                    </div>
                                  )}
                                </div>
                              );
                            })}
                          </div>
                        </div>
                      )}
                    </div>

                    <div>
                      <label className="block text-sm mb-1">Observações</label>
                      <textarea
                        value={observacoes}
                        onChange={(e) => setObservacoes(e.target.value)}
                        placeholder="Adicione observações ou instruções especiais para este roteiro..."
                        rows={3}
                        className="w-full px-3 py-2 border rounded focus:ring-2 focus:ring-orange-500 resize-none"
                      />
                    </div>

                    <button
                      type="submit"
                      disabled={!selectedItemId || etapas.length === 0}
                      className="w-full px-4 py-2 bg-orange-600 text-white rounded hover:bg-orange-700 disabled:bg-gray-300 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                    >
                      <Save className="w-4 h-4" />
                      Salvar Roteiro
                    </button>
                  </div>
                </form>
              )}

              <div className="p-6">
                {roteiros.length === 0 ? (
                  <div className="text-center py-8">
                    <Route className="w-12 h-12 text-gray-300 mx-auto mb-3" />
                    <p className="text-gray-500">Nenhum roteiro cadastrado</p>
                    <p className="text-sm text-gray-400 mt-1">
                      Crie roteiros para definir o fluxo de produção
                    </p>
                  </div>
                ) : (
                  <div className="space-y-6">
                    {roteiros.map((roteiro) => {
                      const item = getItemById(roteiro.itemId);
                      return (
                        <div key={roteiro.id} className="border rounded-lg p-5 hover:bg-gray-50 transition-colors">
                          <div className="mb-4">
                            <p className="font-mono text-sm text-orange-600 mb-1">{item?.codigo}</p>
                            <p className="text-lg">{item?.descricao}</p>
                            <p className="text-sm text-gray-500 mt-2">
                              {roteiro.etapas.length} {roteiro.etapas.length === 1 ? 'etapa' : 'etapas'} de produção
                            </p>
                          </div>

                          <div className="border-t pt-4">
                            <p className="text-sm text-gray-600 mb-3">Fluxo de produção:</p>
                            <div className="flex flex-wrap items-center gap-2">
                              {roteiro.etapas.map((etapa, idx) => {
                                const info = getEtapaInfo(etapa);
                                return (
                                  <div key={idx} className="flex items-center gap-2">
                                    <div className={`px-4 py-2 ${info?.color} text-white rounded-lg text-sm`}>
                                      {idx + 1}. {info?.label}
                                    </div>
                                    {idx < roteiro.etapas.length - 1 && (
                                      <ArrowRight className="w-4 h-4 text-gray-400" />
                                    )}
                                  </div>
                                );
                              })}
                            </div>
                          </div>

                          {roteiro.observacoes && (
                            <div className="mt-4 p-3 bg-gray-50 rounded border-l-4 border-orange-500">
                              <p className="text-xs text-gray-500 mb-1">Observações:</p>
                              <p className="text-sm text-gray-700">{roteiro.observacoes}</p>
                            </div>
                          )}
                        </div>
                      );
                    })}
                  </div>
                )}
              </div>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}
