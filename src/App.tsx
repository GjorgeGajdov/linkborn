import { LandingPage } from './components/LandingPage';
import { AppLayout } from './components/AppLayout';
import { useUrlState } from './hooks/useUrlState';
import type { AppState } from './types';

export function App() {
  const [state, setState] = useUrlState();

  if (!state) {
    return (
      <LandingPage
        onStart={(initialState: AppState) => setState(initialState)}
      />
    );
  }

  return <AppLayout state={state} setState={setState} />;
}
