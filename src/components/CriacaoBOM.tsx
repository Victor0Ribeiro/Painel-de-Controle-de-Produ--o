import { useState } from 'react';
import { ArrowLeft, Plus, Trash2, Save, FileText, Package } from 'lucide-react';
import type { Item, BOM, BOMItem } from '../App';

interface CriacaoBOMProps {
  itens: Item[];
  boms: BOM[];
  generateNextCode: () => string;
  onAddBOM: (bom: BOM) => void;
  onBack: () => void;
}

export function CriacaoBOM({ itens, boms, generateNextCode, onAddBOM, onBack }: CriacaoBOMProps) {
  const [showBOMForm, setShowBOMForm] = useState(false);
  const [bomDescricao, setBomDescricao] = useState('');
  const [bomItens, setBomItens] = useState<BOMItem[]>([]);
  const [selectedItem, setSelectedItem] = useState('');
  const [quantidade, setQuantidade] = useState(1);

  const handleAddItemToBOM = () => {
    if (selectedItem && quantidade > 0) {
      setBomItens([...bomItens, { itemId: selectedItem, quantidade }]);
      setSelectedItem('');
      setQuantidade(1);
    }
  };

  const handleRemoveItemFromBOM = (index: number) => {
    setBomItens(bomItens.filter((_, i) => i !== index));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const newBOM: BOM = {
      id: Date.now().toString(),
      codigo: generateNextCode(),
      descricao: bomDescricao,
      itens: bomItens,
    };
    onAddBOM(newBOM);
    setBomDescricao('');
    setBomItens([]);
    setShowBOMForm(false);
  };

  const getItemById = (id: string) => {
    return itens.find(item => item.id === id);
  };

  return (
    <div>
      <header className="bg-green-900 text-white shadow-lg">
        <div className="container mx-auto px-6 py-4">
          <button
            onClick={onBack}
            className="flex items-center gap-2 text-green-200 hover:text-white mb-3 transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            Voltar
          </button>
          <h1 className="text-2xl">Criação de BOM (Bill of Materials)</h1>
          <p className="text-green-200 text-sm mt-1">Configure listas de materiais para produção</p>
        </div>
      </header>

      <main className="container mx-auto px-6 py-8">
        {itens.length === 0 ? (
          <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-6 text-center">
            <Package className="w-12 h-12 text-yellow-500 mx-auto mb-3" />
            <p className="text-yellow-800">
              Você precisa cadastrar itens primeiro antes de criar BOMs.
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
                    <FileText className="w-5 h-5" />
                    BOMs Cadastradas
                  </h2>
                  <p className="text-gray-500 text-sm mt-1">{boms.length} BOMs cadastradas</p>
                </div>
                <button
                  onClick={() => setShowBOMForm(!showBOMForm)}
                  className="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700 flex items-center gap-2"
                >
                  <Plus className="w-4 h-4" />
                  Nova BOM
                </button>
              </div>

              {showBOMForm && (
                <form onSubmit={handleSubmit} className="p-6 bg-green-50 border-b border-green-200">
                  <h3 className="mb-4">Nova BOM</h3>
                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm mb-1">Descrição</label>
                      <input
                        type="text"
                        value={bomDescricao}
                        onChange={(e) => setBomDescricao(e.target.value)}
                        placeholder="Ex: Lista de materiais para Mesa Executiva"
                        className="w-full px-3 py-2 border rounded focus:ring-2 focus:ring-green-500"
                        required
                      />
                    </div>

                    <div className="border-t pt-4">
                      <label className="block text-sm mb-2">Itens da BOM</label>
                      <div className="flex gap-2 mb-3">
                        <select
                          value={selectedItem}
                          onChange={(e) => setSelectedItem(e.target.value)}
                          className="flex-1 px-3 py-2 border rounded focus:ring-2 focus:ring-green-500"
                        >
                          <option value="">Selecione um item</option>
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
                          className="w-32 px-3 py-2 border rounded focus:ring-2 focus:ring-green-500"
                        />
                        <button
                          type="button"
                          onClick={handleAddItemToBOM}
                          className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 flex items-center gap-2"
                        >
                          <Plus className="w-4 h-4" />
                          Adicionar
                        </button>
                      </div>

                      {bomItens.length > 0 && (
                        <div className="bg-white border rounded p-4 space-y-2">
                          {bomItens.map((bomItem, index) => {
                            const item = getItemById(bomItem.itemId);
                            return (
                              <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded">
                                <div>
                                  <p className="font-mono text-sm text-green-600">{item?.codigo}</p>
                                  <p className="text-sm">{item?.descricao}</p>
                                  <p className="text-xs text-gray-500 mt-1">
                                    Quantidade: {bomItem.quantidade} {item?.unidade}
                                  </p>
                                </div>
                                <button
                                  type="button"
                                  onClick={() => handleRemoveItemFromBOM(index)}
                                  className="text-red-600 hover:text-red-800"
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
                      disabled={bomItens.length === 0}
                      className="w-full px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700 disabled:bg-gray-300 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                    >
                      <Save className="w-4 h-4" />
                      Salvar BOM
                    </button>
                  </div>
                </form>
              )}

              <div className="p-6">
                {boms.length === 0 ? (
                  <p className="text-center text-gray-500 py-8">Nenhuma BOM cadastrada</p>
                ) : (
                  <div className="space-y-4">
                    {boms.map((bom) => (
                      <div key={bom.id} className="border rounded-lg p-4 hover:bg-gray-50">
                        <div className="mb-3">
                          <p className="font-mono text-sm text-green-600">{bom.codigo}</p>
                          <p className="mt-1">{bom.descricao}</p>
                          <p className="text-sm text-gray-500 mt-1">
                            {bom.itens.length} {bom.itens.length === 1 ? 'item' : 'itens'}
                          </p>
                        </div>

                        <div className="border-t pt-3">
                          <p className="text-sm text-gray-600 mb-2">Itens:</p>
                          <div className="space-y-2">
                            {bom.itens.map((bomItem, idx) => {
                              const item = getItemById(bomItem.itemId);
                              return (
                                <div key={idx} className="flex items-start justify-between p-2 bg-gray-50 rounded text-sm">
                                  <div>
                                    <p className="font-mono text-xs text-gray-500">{item?.codigo}</p>
                                    <p>{item?.descricao}</p>
                                  </div>
                                  <span className="text-gray-600 whitespace-nowrap ml-3">
                                    {bomItem.quantidade} {item?.unidade}
                                  </span>
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