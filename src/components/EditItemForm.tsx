import { useState, useEffect } from 'react';
import { X, Save, Plus, Trash2 } from 'lucide-react';
import type { Material, Item, ConsumoMaterial } from '../App';

interface EditItemFormProps {
  item: Material | Item;
  materiais: Material[];
  onSave: (item: Material | Item) => void;
  onUpdateMaterial: (material: Material) => void;
  onUpdateItem: (item: Item) => void;
  onClose: () => void;
}

export function EditItemForm({ item, materiais, onUpdateMaterial, onUpdateItem, onClose }: EditItemFormProps) {
  const isMaterial = 'estoqueAtual' in item;
  
  const [descricao, setDescricao] = useState(item.descricao);
  const [unidade, setUnidade] = useState(item.unidade);
  const [estoque, setEstoque] = useState(isMaterial ? item.estoqueAtual : 0);
  const [tipo, setTipo] = useState<'componente' | 'subconjunto'>(
    isMaterial ? 'componente' : (item as Item).tipo
  );
  const [consumos, setConsumos] = useState<ConsumoMaterial[]>(
    isMaterial ? [] : (item as Item).consumoMateriais
  );
  const [selectedMaterial, setSelectedMaterial] = useState('');
  const [quantidade, setQuantidade] = useState(1);

  const handleAddConsumo = () => {
    if (selectedMaterial && quantidade > 0) {
      setConsumos([...consumos, { materialId: selectedMaterial, quantidade }]);
      setSelectedMaterial('');
      setQuantidade(1);
    }
  };

  const handleRemoveConsumo = (index: number) => {
    setConsumos(consumos.filter((_, i) => i !== index));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (isMaterial) {
      const updatedMaterial: Material = {
        ...(item as Material),
        descricao,
        unidade,
        estoqueAtual: estoque,
      };
      onUpdateMaterial(updatedMaterial);
    } else {
      const updatedItem: Item = {
        ...(item as Item),
        descricao,
        unidade,
        tipo,
        consumoMateriais: consumos,
      };
      onUpdateItem(updatedItem);
    }
    onClose();
  };

  const getMaterialById = (id: string) => {
    return materiais.find(m => m.id === id);
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg shadow-xl max-w-2xl w-full max-h-[90vh] overflow-hidden">
        <div className="p-6 border-b border-gray-200 flex items-center justify-between bg-yellow-50">
          <div>
            <h2 className="text-xl">Editar {isMaterial ? 'Material' : 'Item'}</h2>
            <p className="text-sm text-gray-600 font-mono mt-1">{item.codigo}</p>
          </div>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 overflow-y-auto max-h-[calc(90vh-140px)]">
          <div className="space-y-4">
            <div>
              <label className="block text-sm mb-1">Código (não editável)</label>
              <input
                type="text"
                value={item.codigo}
                disabled
                className="w-full px-3 py-2 border rounded bg-gray-100 text-gray-600"
              />
            </div>

            <div>
              <label className="block text-sm mb-1">Descrição</label>
              <input
                type="text"
                value={descricao}
                onChange={(e) => setDescricao(e.target.value)}
                className="w-full px-3 py-2 border rounded focus:ring-2 focus:ring-yellow-500"
                required
              />
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-sm mb-1">Unidade</label>
                {isMaterial ? (
                  <select
                    value={unidade}
                    onChange={(e) => setUnidade(e.target.value)}
                    className="w-full px-3 py-2 border rounded focus:ring-2 focus:ring-yellow-500"
                  >
                    <option value="kg">kg</option>
                    <option value="m">m</option>
                    <option value="L">L</option>
                    <option value="un">un</option>
                    <option value="pc">pc</option>
                  </select>
                ) : (
                  <select
                    value={unidade}
                    onChange={(e) => setUnidade(e.target.value)}
                    className="w-full px-3 py-2 border rounded focus:ring-2 focus:ring-yellow-500"
                  >
                    <option value="un">un</option>
                    <option value="pc">pc</option>
                    <option value="cj">cj</option>
                  </select>
                )}
              </div>

              {isMaterial ? (
                <div>
                  <label className="block text-sm mb-1">Estoque Atual</label>
                  <input
                    type="number"
                    step="0.01"
                    value={estoque}
                    onChange={(e) => setEstoque(Number(e.target.value))}
                    className="w-full px-3 py-2 border rounded focus:ring-2 focus:ring-yellow-500"
                    required
                  />
                </div>
              ) : (
                <div>
                  <label className="block text-sm mb-1">Tipo</label>
                  <select
                    value={tipo}
                    onChange={(e) => setTipo(e.target.value as 'componente' | 'subconjunto')}
                    className="w-full px-3 py-2 border rounded focus:ring-2 focus:ring-yellow-500"
                  >
                    <option value="componente">Componente</option>
                    <option value="subconjunto">Subconjunto</option>
                  </select>
                </div>
              )}
            </div>

            {!isMaterial && (
              <div className="border-t pt-4">
                <label className="block text-sm mb-2">Consumo de Materiais</label>
                <div className="flex gap-2 mb-2">
                  <select
                    value={selectedMaterial}
                    onChange={(e) => setSelectedMaterial(e.target.value)}
                    className="flex-1 px-3 py-2 border rounded focus:ring-2 focus:ring-yellow-500"
                  >
                    <option value="">Selecione um material</option>
                    {materiais.map((mat) => (
                      <option key={mat.id} value={mat.id}>
                        {mat.codigo} - {mat.descricao}
                      </option>
                    ))}
                  </select>
                  <input
                    type="number"
                    step="0.01"
                    value={quantidade}
                    onChange={(e) => setQuantidade(Number(e.target.value))}
                    placeholder="Qtd"
                    className="w-24 px-3 py-2 border rounded focus:ring-2 focus:ring-yellow-500"
                  />
                  <button
                    type="button"
                    onClick={handleAddConsumo}
                    className="px-3 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
                  >
                    <Plus className="w-4 h-4" />
                  </button>
                </div>

                {consumos.length > 0 && (
                  <div className="space-y-2">
                    {consumos.map((consumo, index) => {
                      const mat = getMaterialById(consumo.materialId);
                      return (
                        <div key={index} className="flex items-center justify-between p-2 bg-gray-50 border rounded">
                          <span className="text-sm">
                            {mat?.codigo} - {consumo.quantidade} {mat?.unidade}
                          </span>
                          <button
                            type="button"
                            onClick={() => handleRemoveConsumo(index)}
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
            )}
          </div>

          <div className="mt-6 flex gap-3">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded hover:bg-gray-50"
            >
              Cancelar
            </button>
            <button
              type="submit"
              className="flex-1 px-4 py-2 bg-yellow-500 text-white rounded hover:bg-yellow-600 flex items-center justify-center gap-2"
            >
              <Save className="w-4 h-4" />
              Salvar Alterações
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}