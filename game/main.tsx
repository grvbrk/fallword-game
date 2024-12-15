// @ts-expect-error
import './index.css';

// import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { App } from './App';
import { PageContextProvider } from './hooks/usePage';
import GameSettingsProvider from './hooks/useGameConfig';
import UserActivityProvider from './hooks/useUserActivity';

createRoot(document.getElementById('root')!).render(
  // <StrictMode>
  <PageContextProvider>
    <UserActivityProvider>
      <GameSettingsProvider>
        <App />
      </GameSettingsProvider>
    </UserActivityProvider>
  </PageContextProvider>
  // </StrictMode>
);
