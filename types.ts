export enum AppMode {
  HOME = 'HOME',
  DICTATION = 'DICTATION',
  POETRY = 'POETRY',
  OCR = 'OCR',
  PARENTS = 'PARENTS'
}

export interface UserSettings {
  isDyslexicFont: boolean;
  isHighSpacing: boolean;
}

export interface DictationState {
  words: string;
  generatedSentence: string;
  userAttempt: string;
  status: 'idle' | 'loading' | 'ready' | 'success' | 'error';
  feedback: string | null;
}

export interface PoetryLine {
  id: string;
  text: string;
  originalIndex: number;
}

export interface Post {
  id: string;
  author: string;
  content: string;
  likes: number;
}
