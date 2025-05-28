
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
  cavalo: 'src/types/cavalo.png',
  estrela: 'src/types/estrela.png',
  gato: 'src/types/gato.png',
  linus: 'src/types/linus.png',
  luminaria: 'src/types/luminaria.png',
  mack: 'src/types/mack.jpg',
  nike: 'src/types/nike.png',
  raposa: 'src/types/raposa.jpg'
};
