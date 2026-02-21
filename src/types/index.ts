export interface Note {
  title: string;
  content: string;
}

export interface AppState {
  notes: Record<string, Note>;
  current: string;
}
