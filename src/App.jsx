import React from 'react';
import { AppShell } from '@mantine/core';
import AppRoutes from './routes/Routes';

function App() {

  return (
    <AppShell
      header={{ height: 60 }}
      padding="md"
    >
      <AppShell.Main>
        <AppRoutes />
      </AppShell.Main>
    </AppShell>
  );
}

export default App;
