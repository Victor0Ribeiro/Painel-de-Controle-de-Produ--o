import { useState } from 'react';
import { ArrowLeft, Plus, Trash2, Save, Boxes, Package } from 'lucide-react';
import type { Item, ItemFinal, BOMItem } from '../App';

interface CriacaoItemFinalProps {
  itens: Item[];
  itensFinal: ItemFinal[];
  generateNextCode: () => string;
  onAddItemFinal: (itemFinal: ItemFinal) => void;
  onBack: () => void;
}

export function CriacaoItemFinal({ itens, itensFinal, generateNextCode, onAddItemFinal, onBack }: CriacaoItemFinalProps) {
  const [showForm, setShowForm] = useState(false);
  const [descricao, setDescricao] = useState('');
  const [subItens, setSubItens] = useState<BOMItem[]>([]);
  const [selectedItem, setSelectedItem] = useState('');
  const [quantidade, setQuantidade] = useState(1);

  const handleAddSubItem = () => {
    if (selectedItem && quantidade > 0) {
      setSubItens([...subItens, { itemId: selectedItem, quantidade }]);
      setSelectedItem('');
      setQuantidade(1);
    }
  };

  const handleRemoveSubItem = (index: number) => {
    setSubItens(subItens.filter((_, i) => i !== index));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const newItemFinal: ItemFinal = {
      id: Date.now().toString(),
      codigo: generateNextCode(),
      descricao,
      subItens,
    };
    onAddItemFinal(newItemFinal);
    setDescricao('');
    setSubItens([]);
    setShowForm(false);
  };

  const getItemById = (id: string) => {
    return itens.find(item => item.id === id);
  };

  return (
    <div>
      <header className="bg-purple-900 text-white shadow-lg">
        <div className="container mx-auto px-6 py-4">
          <button
            onClick={onBack}
            className="flex items-center gap-2 text-purple-200 hover:text-white mb-3 transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            Voltar
          </button>
          <h1 className="text-2xl">Criação de Itens Finais</h1>
          <p className="text-purple-200 text-sm mt-1">Monte produtos finais a partir de sub-itens</p>
        </div>
      </header>

      <main className="container mx-auto px-6 py-8">
        {itens.length === 0 ? (
          <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-6 text-center max-w-2xl mx-auto">
            <Package className="w-12 h-12 text-yellow-500 mx-auto mb-3" />
            <p className="text-yellow-800">
              Você precisa cadastrar itens primeiro antes de criar itens finais.
            </p>
            <p className="text-sm text-yellow-600 mt-2">
              Volte à tela inicial e acesse "Criação de Itens"
            </p>
          </div>
        ) : (
          <div className="max-w-4xl mx-auto">
            <div className="bg-white rounded-lg shadow">
              <div className="p-6 border-b border-gray-200 flex items-center justify-between">
                <div>
                  <h2 className="text-xl flex items-center gap-2">
                    <Boxes className="w-5 h-5" />
                    Itens Finais
                  </h2>
                  <p className="text-gray-500 text-sm mt-1">{itensFinal.length} itens finais cadastrados</p>
                </div>
                <button
                  onClick={() => setShowForm(!showForm)}
                  className="px-4 py-2 bg-purple-600 text-white rounded hover:bg-purple-700 flex items-center gap-2"
                >
                  <Plus className="w-4 h-4" />
                  Novo Item Final
                </button>
              </div>

              {showForm && (
                <form onSubmit={handleSubmit} className="p-6 bg-purple-50 border-b border-purple-200">
                  <h3 className="mb-4">Novo Item Final</h3>
                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm mb-1">Descrição</label>
                      <input
                        type="text"
                        value={descricao}
                        onChange={(e) => setDescricao(e.target.value)}
                        placeholder="Ex: Mesa Executiva Completa"
                        className="w-full px-3 py-2 border rounded focus:ring-2 focus:ring-purple-500"
                        required
                      />
                    </div>

                    <div className="border-t pt-4">
                      <label className="block text-sm mb-2">Sub-Itens Componentes</label>
                      <p className="text-xs text-gray-600 mb-3">
                        Adicione os componentes que formam este item final (Ex: bases, colunas, tampo, etc.)
                      </p>
                      <div className="flex gap-2 mb-3">
                        <select
                          value={selectedItem}
                          onChange={(e) => setSelectedItem(e.target.value)}
                          className="flex-1 px-3 py-2 border rounded focus:ring-2 focus:ring-purple-500"
                        >
                          <option value="">Selecione um sub-item</option>
                          {itens.map((item) => (
                            <option key={item.id} value={item.id}>
                              {item.codigo} - {item.descricao}
                            </option>
                          ))}
                        </select>
                        <input
                          type="number"
                          step="0.01"
                          value={quantidade}
                          onChange={(e) => setQuantidade(Number(e.target.value))}
                          placeholder="Quantidade"
                          className="w-32 px-3 py-2 border rounded focus:ring-2 focus:ring-purple-500"
                        />
                        <button
                          type="button"
                          onClick={handleAddSubItem}
                          className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 flex items-center gap-2"
                        >
                          <Plus className="w-4 h-4" />
                          Adicionar
                        </button>
                      </div>

                      {subItens.length > 0 && (
                        <div className="bg-white border rounded p-4 space-y-2">
                          {subItens.map((subItem, index) => {
                            const item = getItemById(subItem.itemId);
                            return (
                              <div key={index} className="flex items-center justify-between p-3 bg-purple-50 rounded">
                                <div className="flex-1">
                                  <div className="flex items-center gap-2 mb-1">
                                    <p className="font-mono text-sm text-purple-600">{item?.codigo}</p>
                                    <span className="px-2 py-0.5 bg-purple-200 text-purple-800 text-xs rounded">
                                      {item?.tipo}
                                    </span>
                                  </div>
                                  <p className="text-sm">{item?.descricao}</p>
                                  <p className="text-xs text-gray-600 mt-1">
                                    Quantidade: {subItem.quantidade} {item?.unidade}
                                  </p>
                                </div>
                                <button
                                  type="button"
                                  onClick={() => handleRemoveSubItem(index)}
                                  className="text-red-600 hover:text-red-800 ml-3"
                                >
                                  <Trash2 className="w-4 h-4" />
                                </button>
                              </div>
                            );
                          })}
                        </div>
                      )}
                    </div>

                    <button
                      type="submit"
                      disabled={subItens.length === 0}
                      className="w-full px-4 py-2 bg-purple-600 text-white rounded hover:bg-purple-700 disabled:bg-gray-300 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                    >
                      <Save className="w-4 h-4" />
                      Salvar Item Final
                    </button>
                  </div>
                </form>
              )}

              <div className="p-6">
                {itensFinal.length === 0 ? (
                  <div className="text-center py-8">
                    <Boxes className="w-12 h-12 text-gray-300 mx-auto mb-3" />
                    <p className="text-gray-500">Nenhum item final cadastrado</p>
                    <p className="text-sm text-gray-400 mt-1">
                      Crie produtos finais combinando seus sub-itens
                    </p>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {itensFinal.map((itemFinal) => (
                      <div key={itemFinal.id} className="border rounded-lg p-5 hover:bg-gray-50 transition-colors">
                        <div className="mb-4">
                          <p className="font-mono text-sm text-purple-600 mb-1">{itemFinal.codigo}</p>
                          <p className="text-lg">{itemFinal.descricao}</p>
                          <p className="text-sm text-gray-500 mt-2">
                            Composto por {itemFinal.subItens.length} {itemFinal.subItens.length === 1 ? 'sub-item' : 'sub-itens'}
                          </p>
                        </div>

                        <div className="border-t pt-4">
                          <p className="text-sm text-gray-600 mb-3">Componentes:</p>
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                            {itemFinal.subItens.map((subItem, idx) => {
                              const item = getItemById(subItem.itemId);
                              return (
                                <div key={idx} className="p-3 bg-purple-50 border border-purple-200 rounded">
                                  <div className="flex items-start justify-between">
                                    <div className="flex-1">
                                      <p className="font-mono text-xs text-purple-600 mb-1">{item?.codigo}</p>
                                      <p className="text-sm">{item?.descricao}</p>
                                    </div>
                                    <span className="text-sm ml-2 whitespace-nowrap">
                                      {subItem.quantidade}x
                                    </span>
                                  </div>
                                </div>
                              );
                            })}
                          </div>
                        </div>
                      </div>
                    ))}
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