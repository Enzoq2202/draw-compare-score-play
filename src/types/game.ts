
export interface Player {
  id: string;
  name: string;
  color: string;
}

export type GameState = 'setup' | 'playing' | 'results';

export interface ScoreEntry {
  player: Player;
  score: number;
  category: string;
}

export type Category = 'cavalo' | 'estrela' | 'gato' | 'linus' | 'luminaria' | 'mack' | 'nike' | 'raposa';

export const CATEGORIES: Category[] = [
  'cavalo', 'estrela', 'gato', 'linus', 'luminaria', 'mack', 'nike', 'raposa'
];

export const CATEGORY_LABELS: Record<Category, string> = {
  cavalo: '🐴 Horse',
  estrela: '⭐ Star',
  gato: '🐱 Cat',
  linus: '🐧 Linus',
  luminaria: '💡 Lamp',
  mack: '🚛 Mack',
  nike: '👟 Nike',
  raposa: '🦊 Fox'
};

// Mapeamento de categorias para imagens de referência
export const CATEGORY_IMAGES: Record<Category, string> = {
  cavalo: 'https://images.unsplash.com/photo-1472396961693-142e6e269027?w=400&h=300&fit=crop',
  estrela: 'https://images.unsplash.com/photo-1470813740244-df37b8c1edcb?w=400&h=300&fit=crop',
  gato: 'https://images.unsplash.com/photo-1535268647677-300dbf3d78d1?w=400&h=300&fit=crop',
  linus: 'https://images.unsplash.com/photo-1441057206919-63d19fac2369?w=400&h=300&fit=crop',
  luminaria: 'https://images.unsplash.com/photo-1581090464777-f3220bbe1b8b?w=400&h=300&fit=crop',
  mack: 'https://images.unsplash.com/photo-1587293852726-70cdb56c2866?w=400&h=300&fit=crop',
  nike: 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=400&h=300&fit=crop',
  raposa: 'https://images.unsplash.com/photo-1439886183900-e79ec0057170?w=400&h=300&fit=crop'
};
