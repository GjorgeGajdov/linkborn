import type { EditorPrefs } from '../hooks/useEditorPrefs';

interface Props {
  prefs: EditorPrefs;
  onChange: (patch: Partial<EditorPrefs>) => void;
}

const FONT_SIZES = [14, 16, 18, 20];

const FONTS: { value: EditorPrefs['fontFamily']; label: string }[] = [
  { value: 'sans', label: 'Sans' },
  { value: 'serif', label: 'Serif' },
  { value: 'mono', label: 'Mono' },
];

const LINE_HEIGHTS: { value: EditorPrefs['lineHeight']; label: string }[] = [
  { value: 'compact', label: 'Compact' },
  { value: 'normal', label: 'Normal' },
  { value: 'relaxed', label: 'Relaxed' },
];

export function EditorPrefsPanel({ prefs, onChange }: Props) {
  return (
    <div className="prefs-panel-content">
      <div className="prefs-row">
        <span className="prefs-label">Size</span>
        <div className="prefs-options">
          {FONT_SIZES.map((size) => (
            <button
              key={size}
              className={`prefs-btn${prefs.fontSize === size ? ' prefs-btn--active' : ''}`}
              onClick={() => onChange({ fontSize: size })}
            >
              {size}
            </button>
          ))}
        </div>
      </div>
      <div className="prefs-row">
        <span className="prefs-label">Font</span>
        <div className="prefs-options">
          {FONTS.map(({ value, label }) => (
            <button
              key={value}
              className={`prefs-btn${prefs.fontFamily === value ? ' prefs-btn--active' : ''}`}
              onClick={() => onChange({ fontFamily: value })}
            >
              {label}
            </button>
          ))}
        </div>
      </div>
      <div className="prefs-row">
        <span className="prefs-label">Spacing</span>
        <div className="prefs-options">
          {LINE_HEIGHTS.map(({ value, label }) => (
            <button
              key={value}
              className={`prefs-btn${prefs.lineHeight === value ? ' prefs-btn--active' : ''}`}
              onClick={() => onChange({ lineHeight: value })}
            >
              {label}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
