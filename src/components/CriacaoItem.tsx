import { useState } from 'react';
import { ArrowLeft, Plus, Trash2, Save, Package, Box, Edit, Search, X } from 'lucide-react';
import type { Material, Item, ConsumoMaterial } from '../App';
import { EditItemForm } from './EditItemForm';

interface CriacaoItemProps {
  materiais: Material[];
  itens: Item[];
  generateNextCode: () => string;
  onAddMaterial: (material: Material) => void;
  onAddItem: (item: Item) => void;
  onUpdateMaterial: (material: Material) => void;
  onUpdateItem: (item: Item) => void;
  onBack: () => void;
}

export function CriacaoItem({ materiais, itens, generateNextCode, onAddMaterial, onAddItem, onUpdateMaterial, onUpdateItem, onBack }: CriacaoItemProps) {
  const [showMaterialForm, setShowMaterialForm] = useState(false);
  const [showItemForm, setShowItemForm] = useState(false);
  const [showEditMode, setShowEditMode] = useState(false);
  const [showEditForm, setShowEditForm] = useState(false);
  const [searchFilter, setSearchFilter] = useState('');
  const [filterType, setFilterType] = useState<'todos' | 'material' | 'componente'>('todos');
  const [selectedEditItem, setSelectedEditItem] = useState<Material | Item | null>(null);

  // Edit Form States
  const [editDescricao, setEditDescricao] = useState('');
  const [editUnidade, setEditUnidade] = useState('');
  const [editEstoque, setEditEstoque] = useState(0);
  const [editTipo, setEditTipo] = useState<'componente' | 'subconjunto'>('componente');
  const [editConsumos, setEditConsumos] = useState<ConsumoMaterial[]>([]);

  // Material Form
  const [matDescricao, setMatDescricao] = useState('');
  const [matUnidade, setMatUnidade] = useState('kg');
  const [matEstoque, setMatEstoque] = useState(0);

  // Item Form
  const [itemDescricao, setItemDescricao] = useState('');
  const [itemUnidade, setItemUnidade] = useState('un');
  const [itemTipo, setItemTipo] = useState<'componente' | 'subconjunto'>('componente');
  const [consumos, setConsumos] = useState<ConsumoMaterial[]>([]);
  const [selectedMaterial, setSelectedMaterial] = useState('');
  const [quantidade, setQuantidade] = useState(1);

  const handleAddMaterialSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const newMaterial: Material = {
      id: Date.now().toString(),
      codigo: generateNextCode(),
      descricao: matDescricao,
      unidade: matUnidade,
      estoqueAtual: matEstoque,
    };
    onAddMaterial(newMaterial);
    setMatDescricao('');
    setMatUnidade('kg');
    setMatEstoque(0);
    setShowMaterialForm(false);
  };

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

  const handleAddItemSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const newItem: Item = {
      id: Date.now().toString(),
      codigo: generateNextCode(),
      descricao: itemDescricao,
      unidade: itemUnidade,
      consumoMateriais: consumos,
      tipo: itemTipo,
    };
    onAddItem(newItem);
    setItemDescricao('');
    setItemUnidade('un');
    setItemTipo('componente');
    setConsumos([]);
    setShowItemForm(false);
  };

  const getMaterialById = (id: string) => {
    return materiais.find(m => m.id === id);
  };

  // Filtrar itens para edição
  const getAllItems = () => {
    const all: (Material | Item)[] = [...materiais, ...itens];
    return all.filter(item => {
      const matchesSearch = 
        item.codigo.toLowerCase().includes(searchFilter.toLowerCase()) ||
        item.descricao.toLowerCase().includes(searchFilter.toLowerCase()) ||
        item.unidade.toLowerCase().includes(searchFilter.toLowerCase());
      
      const matchesType = 
        filterType === 'todos' ||
        (filterType === 'material' && 'estoqueAtual' in item) ||
        (filterType === 'componente' && 'tipo' in item);

      return matchesSearch && matchesType;
    });
  };

  return (
    <div>
      <header className="bg-blue-900 text-white shadow-lg">
        <div className="container mx-auto px-6 py-4">
          <div className="flex items-center justify-between mb-3">
            <button
              onClick={onBack}
              className="flex items-center gap-2 text-blue-200 hover:text-white transition-colors"
            >
              <ArrowLeft className="w-4 h-4" />
              Voltar
            </button>
            <button
              onClick={() => setShowEditMode(!showEditMode)}
              className="px-4 py-2 bg-yellow-500 text-white rounded hover:bg-yellow-600 flex items-center gap-2"
            >
              <Edit className="w-4 h-4" />
              Edição de Itens
            </button>
          </div>
          <h1 className="text-2xl">Criação de Itens</h1>
          <p className="text-blue-200 text-sm mt-1">Gerencie materiais e itens com consumo de recursos</p>
        </div>
      </header>

      <main className="container mx-auto px-6 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Materiais */}
          <div className="bg-white rounded-lg shadow">
            <div className="p-6 border-b border-gray-200 flex items-center justify-between">
              <div>
                <h2 className="text-xl flex items-center gap-2">
                  <Box className="w-5 h-5" />
                  Materiais
                </h2>
                <p className="text-gray-500 text-sm mt-1">{materiais.length} materiais cadastrados</p>
              </div>
              <button
                onClick={() => setShowMaterialForm(!showMaterialForm)}
                className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 flex items-center gap-2"
              >
                <Plus className="w-4 h-4" />
                Novo Material
              </button>
            </div>

            {showMaterialForm && (
              <form onSubmit={handleAddMaterialSubmit} className="p-6 bg-blue-50 border-b border-blue-200">
                <h3 className="mb-4">Novo Material</h3>
                <div className="space-y-3">
                  <div className="p-3 bg-blue-100 border border-blue-300 rounded">
                    <p className="text-sm text-blue-700 mb-1">Código será gerado automaticamente</p>
                    <p className="font-mono text-blue-900 text-lg">{String(materiais.length + itens.length + 5).padStart(6, '0')}</p>
                  </div>
                  <div>
                    <label className="block text-sm mb-1">Descrição</label>
                    <input
                      type="text"
                      value={matDescricao}
                      onChange={(e) => setMatDescricao(e.target.value)}
                      className="w-full px-3 py-2 border rounded focus:ring-2 focus:ring-blue-500"
                      required
                    />
                  </div>
                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="block text-sm mb-1">Unidade</label>
                      <select
                        value={matUnidade}
                        onChange={(e) => setMatUnidade(e.target.value)}
                        className="w-full px-3 py-2 border rounded focus:ring-2 focus:ring-blue-500"
                      >
                        <option value="kg">kg</option>
                        <option value="m">m</option>
                        <option value="L">L</option>
                        <option value="un">un</option>
                        <option value="pc">pc</option>
                      </select>
                    </div>
                    <div>
                      <label className="block text-sm mb-1">Estoque Atual</label>
                      <input
                        type="number"
                        step="0.01"
                        value={matEstoque}
                        onChange={(e) => setMatEstoque(Number(e.target.value))}
                        className="w-full px-3 py-2 border rounded focus:ring-2 focus:ring-blue-500"
                        required
                      />
                    </div>
                  </div>
                  <button
                    type="submit"
                    className="w-full px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700 flex items-center justify-center gap-2"
                  >
                    <Save className="w-4 h-4" />
                    Salvar Material
                  </button>
                </div>
              </form>
            )}

            <div className="p-6 max-h-96 overflow-y-auto">
              {materiais.length === 0 ? (
                <p className="text-center text-gray-500 py-8">Nenhum material cadastrado</p>
              ) : (
                <div className="space-y-2">
                  {materiais.map((mat) => (
                    <div key={mat.id} className="p-4 border rounded hover:bg-gray-50">
                      <div className="flex items-start justify-between">
                        <div>
                          <p className="font-mono text-sm text-blue-600">{mat.codigo}</p>
                          <p className="mt-1">{mat.descricao}</p>
                          <p className="text-sm text-gray-500 mt-1">
                            Estoque: {mat.estoqueAtual} {mat.unidade}
                          </p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* Itens */}
          <div className="bg-white rounded-lg shadow">
            <div className="p-6 border-b border-gray-200 flex items-center justify-between">
              <div>
                <h2 className="text-xl flex items-center gap-2">
                  <Package className="w-5 h-5" />
                  Itens
                </h2>
                <p className="text-gray-500 text-sm mt-1">{itens.length} itens cadastrados</p>
              </div>
              <button
                onClick={() => setShowItemForm(!showItemForm)}
                className="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700 flex items-center gap-2"
              >
                <Plus className="w-4 h-4" />
                Novo Item
              </button>
            </div>

            {showItemForm && (
              <form onSubmit={handleAddItemSubmit} className="p-6 bg-green-50 border-b border-green-200">
                <h3 className="mb-4">Novo Item</h3>
                <div className="space-y-3">
                  <div>
                    <label className="block text-sm mb-1">Descrição</label>
                    <input
                      type="text"
                      value={itemDescricao}
                      onChange={(e) => setItemDescricao(e.target.value)}
                      className="w-full px-3 py-2 border rounded focus:ring-2 focus:ring-green-500"
                      required
                    />
                  </div>
                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="block text-sm mb-1">Unidade</label>
                      <select
                        value={itemUnidade}
                        onChange={(e) => setItemUnidade(e.target.value)}
                        className="w-full px-3 py-2 border rounded focus:ring-2 focus:ring-green-500"
                      >
                        <option value="un">un</option>
                        <option value="pc">pc</option>
                        <option value="cj">cj</option>
                      </select>
                    </div>
                    <div>
                      <label className="block text-sm mb-1">Tipo</label>
                      <select
                        value={itemTipo}
                        onChange={(e) => setItemTipo(e.target.value as 'componente' | 'subconjunto')}
                        className="w-full px-3 py-2 border rounded focus:ring-2 focus:ring-green-500"
                      >
                        <option value="componente">Componente</option>
                        <option value="subconjunto">Subconjunto</option>
                      </select>
                    </div>
                  </div>

                  <div className="border-t pt-3">
                    <label className="block text-sm mb-2">Consumo de Materiais</label>
                    <div className="flex gap-2 mb-2">
                      <select
                        value={selectedMaterial}
                        onChange={(e) => setSelectedMaterial(e.target.value)}
                        className="flex-1 px-3 py-2 border rounded focus:ring-2 focus:ring-green-500"
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
                        className="w-24 px-3 py-2 border rounded focus:ring-2 focus:ring-green-500"
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
                            <div key={index} className="flex items-center justify-between p-2 bg-white border rounded">
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

                  <button
                    type="submit"
                    className="w-full px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700 flex items-center justify-center gap-2"
                  >
                    <Save className="w-4 h-4" />
                    Salvar Item
                  </button>
                </div>
              </form>
            )}

            <div className="p-6 max-h-96 overflow-y-auto">
              {itens.length === 0 ? (
                <p className="text-center text-gray-500 py-8">Nenhum item cadastrado</p>
              ) : (
                <div className="space-y-3">
                  {itens.map((item) => (
                    <div key={item.id} className="p-4 border rounded hover:bg-gray-50">
                      <div className="flex items-start justify-between mb-2">
                        <div>
                          <p className="font-mono text-sm text-green-600">{item.codigo}</p>
                          <p className="mt-1">{item.descricao}</p>
                          <span className="inline-block mt-1 px-2 py-1 bg-gray-100 text-gray-700 text-xs rounded">
                            {item.tipo}
                          </span>
                        </div>
                      </div>
                      {item.consumoMateriais.length > 0 && (
                        <div className="mt-2 pt-2 border-t">
                          <p className="text-xs text-gray-500 mb-1">Materiais consumidos:</p>
                          {item.consumoMateriais.map((consumo, idx) => {
                            const mat = getMaterialById(consumo.materialId);
                            return (
                              <p key={idx} className="text-xs text-gray-600">
                                • {mat?.codigo}: {consumo.quantidade} {mat?.unidade}
                              </p>
                            );
                          })}
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      </main>

      {/* Modal de Busca de Itens para Edição */}
      {showEditMode && !showEditForm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg shadow-xl max-w-4xl w-full max-h-[90vh] overflow-hidden">
            <div className="p-6 border-b border-gray-200 flex items-center justify-between bg-yellow-50">
              <h2 className="text-xl flex items-center gap-2">
                <Edit className="w-5 h-5" />
                Edição de Itens
              </h2>
              <button
                onClick={() => {
                  setShowEditMode(false);
                  setSelectedEditItem(null);
                }}
                className="text-gray-500 hover:text-gray-700"
              >
                <X className="w-6 h-6" />
              </button>
            </div>

            <div className="p-6 border-b border-gray-200 bg-gray-50">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                <div className="md:col-span-2">
                  <label className="block text-sm mb-1">Buscar por código, descrição ou unidade</label>
                  <div className="relative">
                    <Search className="w-5 h-5 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                    <input
                      type="text"
                      value={searchFilter}
                      onChange={(e) => setSearchFilter(e.target.value)}
                      placeholder="Digite para buscar..."
                      className="w-full pl-10 pr-3 py-2 border rounded focus:ring-2 focus:ring-yellow-500"
                    />
                  </div>
                </div>
                <div>
                  <label className="block text-sm mb-1">Tipo de Item</label>
                  <select
                    value={filterType}
                    onChange={(e) => setFilterType(e.target.value as 'todos' | 'material' | 'componente')}
                    className="w-full px-3 py-2 border rounded focus:ring-2 focus:ring-yellow-500"
                  >
                    <option value="todos">Todos</option>
                    <option value="material">Materiais</option>
                    <option value="componente">Componentes/Itens</option>
                  </select>
                </div>
              </div>
            </div>

            <div className="p-6 max-h-96 overflow-y-auto">
              {getAllItems().length === 0 ? (
                <p className="text-center text-gray-500 py-8">Nenhum item encontrado com os filtros aplicados</p>
              ) : (
                <div className="space-y-2">
                  {getAllItems().map((item) => {
                    const isMaterial = 'estoqueAtual' in item;
                    return (
                      <div
                        key={item.id}
                        className="p-4 border rounded hover:bg-gray-50 cursor-pointer"
                        onClick={() => {
                          setSelectedEditItem(item);
                          setShowEditForm(true);
                        }}
                      >
                        <div className="flex items-start justify-between">
                          <div className="flex-1">
                            <div className="flex items-center gap-2">
                              <p className="font-mono text-sm text-blue-600">{item.codigo}</p>
                              <span className={`px-2 py-1 text-xs rounded ${isMaterial ? 'bg-blue-100 text-blue-700' : 'bg-green-100 text-green-700'}`}>
                                {isMaterial ? 'Material' : 'Item'}
                              </span>
                            </div>
                            <p className="mt-1">{item.descricao}</p>
                            <p className="text-sm text-gray-500 mt-1">
                              {isMaterial ? `Estoque: ${item.estoqueAtual} ${item.unidade}` : `Unidade: ${item.unidade}`}
                            </p>
                          </div>
                          <Edit className="w-4 h-4 text-gray-400" />
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>

            <div className="p-4 border-t bg-gray-50 text-center text-sm text-gray-500">
              {getAllItems().length} {getAllItems().length === 1 ? 'item encontrado' : 'itens encontrados'}
            </div>
          </div>
        </div>
      )}

      {/* Formulário de Edição */}
      {showEditForm && selectedEditItem && (
        <EditItemForm
          item={selectedEditItem}
          materiais={materiais}
          onUpdateMaterial={onUpdateMaterial}
          onUpdateItem={onUpdateItem}
          onClose={() => setShowEditForm(false)}
        />
      )}
    </div>
  );
}