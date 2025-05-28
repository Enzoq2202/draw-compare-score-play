
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
