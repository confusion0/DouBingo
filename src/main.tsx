import { createRoot } from 'react-dom/client';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';

import { AuthTokenProvider } from './context/AuthTokenContext.tsx';
import { MessageProvider } from './context/MessageContext.tsx';
import { UsernameProvider } from './context/UsernameContext.tsx';

import './index.css';
import App from './App.tsx';

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: false
    }
  }
});

createRoot(document.getElementById('root')!).render(
  <QueryClientProvider client={queryClient}>
    <AuthTokenProvider>
      <UsernameProvider>
        <MessageProvider>
          <App />
        </MessageProvider>
      </UsernameProvider>
    </AuthTokenProvider>
  </QueryClientProvider>
);
