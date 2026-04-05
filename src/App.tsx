import { useState } from 'react';
import { Home } from './components/Home';
import { CriacaoItem } from './components/CriacaoItem';
import { CriacaoBOM } from './components/CriacaoBOM';
import { CriacaoItemFinal } from './components/CriacaoItemFinal';
import { CriacaoRoteiro } from './components/CriacaoRoteiro';
import { PainelCARE } from './components/PainelCARE';

export type Priority = 'alta' | 'media' | 'baixa';
export type Status = 'pendente' | 'em-inspecao' | 'concluida' | 'aprovada' | 'reprovada';

export interface OP {
  id: string;
  numero: string;
  peca: string; // Agora será o código do item
  pecaNome?: string; // Nome da peça (preenchido automaticamente)
  descricao?: string; // Descrição/documentação da OP
  lote: number;
  quantidadeInspecionar: number;
  prioridade: Priority;
  status: Status;
  dataEntrada: string;
  dataEntrega?: string; // Data de entrega prevista
  operador?: string;
  historico: {
    totalInspecoes: number;
    taxaDefeito: number;
  };
  problemas: string[];
}

export interface Inspecao {
  opId: string;
  cotasDefeituosas: string[];
  observacoes: string;
  pecasInspecionadas: number;
  pecasAprovadas: number;
  pecasReprovadas: number;
  timestamp: string;
}

export interface Material {
  id: string;
  codigo: string;
  descricao: string;
  unidade: string;
  estoqueAtual: number;
}

export interface ConsumoMaterial {
  materialId: string;
  quantidade: number;
}

export interface Item {
  id: string;
  codigo: string;
  descricao: string;
  unidade: string;
  consumoMateriais: ConsumoMaterial[];
  tipo: 'componente' | 'subconjunto';
}

export interface BOMItem {
  itemId: string;
  quantidade: number;
}

export interface BOM {
  id: string;
  codigo: string;
  descricao: string;
  itens: BOMItem[];
}

export interface ItemFinal {
  id: string;
  codigo: string;
  descricao: string;
  subItens: BOMItem[];
}

export type EtapaRoteiro = 'corte' | 'servico-externo' | 'solda' | 'acabamento' | 'jato' | 'pintura' | 'montagem' | 'embalagem';

export interface Roteiro {
  id: string;
  itemId: string;
  etapas: EtapaRoteiro[];
  observacoes: string;
}

type Page = 'home' | 'criacao-item' | 'criacao-bom' | 'criacao-item-final' | 'criacao-roteiro' | 'painel-care';

function App() {
  const [currentPage, setCurrentPage] = useState<Page>('home');
  const [materiais, setMateriais] = useState<Material[]>([
    { id: '1', codigo: '000001', descricao: 'Chapa de Aço 1020 - 3mm', unidade: 'kg', estoqueAtual: 500 },
    { id: '2', codigo: '000002', descricao: 'Tubo Quadrado 50x50x2mm', unidade: 'm', estoqueAtual: 200 },
    { id: '3', codigo: '000003', descricao: 'Eletrodo E6013 2.5mm', unidade: 'kg', estoqueAtual: 50 },
    { id: '4', codigo: '000004', descricao: 'Tinta Epóxi Preta', unidade: 'L', estoqueAtual: 30 },
  ]);
  const [itens, setItens] = useState<Item[]>([
    {
      id: 'item1',
      codigo: '000005',
      descricao: 'Suporte de Fixação Metálico',
      unidade: 'un',
      tipo: 'componente',
      consumoMateriais: [
        { materialId: '1', quantidade: 2.5 },
        { materialId: '3', quantidade: 0.2 }
      ]
    },
    {
      id: 'item2',
      codigo: '000006',
      descricao: 'Base de Estrutura Soldada',
      unidade: 'un',
      tipo: 'componente',
      consumoMateriais: [
        { materialId: '2', quantidade: 3.0 },
        { materialId: '3', quantidade: 0.3 }
      ]
    },
    {
      id: 'item3',
      codigo: '000007',
      descricao: 'Tampa Frontal com Dobradiças',
      unidade: 'un',
      tipo: 'componente',
      consumoMateriais: [
        { materialId: '1', quantidade: 1.8 }
      ]
    }
  ]);
  const [boms, setBoms] = useState<BOM[]>([]);
  const [itensFinal, setItensFinal] = useState<ItemFinal[]>([]);
  const [roteiros, setRoteiros] = useState<Roteiro[]>([]);
  const [nextItemCode, setNextItemCode] = useState(5); // Começa em 5 porque já temos 4 materiais

  // Inicializar contador baseado nos itens existentes
  useState(() => {
    const totalItens = materiais.length + itens.length + boms.length + itensFinal.length;
    setNextItemCode(totalItens + 1);
  });

  const generateNextCode = () => {
    const code = String(nextItemCode).padStart(6, '0');
    setNextItemCode(nextItemCode + 1);
    return code;
  };

  const handleAddMaterial = (material: Material) => {
    setMateriais([...materiais, material]);
  };

  const handleAddItem = (item: Item) => {
    setItens([...itens, item]);
  };

  const handleAddBOM = (bom: BOM) => {
    setBoms([...boms, bom]);
  };

  const handleAddItemFinal = (itemFinal: ItemFinal) => {
    setItensFinal([...itensFinal, itemFinal]);
  };

  const handleAddRoteiro = (roteiro: Roteiro) => {
    setRoteiros([...roteiros, roteiro]);
  };

  const handleUpdateMaterial = (updatedMaterial: Material) => {
    setMateriais(materiais.map(m => m.id === updatedMaterial.id ? updatedMaterial : m));
  };

  const handleUpdateItem = (updatedItem: Item) => {
    setItens(itens.map(i => i.id === updatedItem.id ? updatedItem : i));
  };

  const renderPage = () => {
    switch (currentPage) {
      case 'home':
        return <Home onNavigate={setCurrentPage} />;
      case 'criacao-item':
        return (
          <CriacaoItem
            materiais={materiais}
            itens={itens}
            generateNextCode={generateNextCode}
            onAddMaterial={handleAddMaterial}
            onAddItem={handleAddItem}
            onUpdateMaterial={handleUpdateMaterial}
            onUpdateItem={handleUpdateItem}
            onBack={() => setCurrentPage('home')}
          />
        );
      case 'criacao-bom':
        return (
          <CriacaoBOM
            itens={itens}
            boms={boms}
            generateNextCode={generateNextCode}
            onAddBOM={handleAddBOM}
            onBack={() => setCurrentPage('home')}
          />
        );
      case 'criacao-item-final':
        return (
          <CriacaoItemFinal
            itens={itens}
            itensFinal={itensFinal}
            generateNextCode={generateNextCode}
            onAddItemFinal={handleAddItemFinal}
            onBack={() => setCurrentPage('home')}
          />
        );
      case 'criacao-roteiro':
        return (
          <CriacaoRoteiro
            itens={itens}
            roteiros={roteiros}
            onAddRoteiro={handleAddRoteiro}
            onBack={() => setCurrentPage('home')}
          />
        );
      case 'painel-care':
        return <PainelCARE materiais={materiais} itens={itens} onBack={() => setCurrentPage('home')} />;
      default:
        return <Home onNavigate={setCurrentPage} />;
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {renderPage()}
    </div>
  );
}

export default App;