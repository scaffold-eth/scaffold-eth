import React from 'react';

(async () => {
  // dynamic imports for code splitting
  const { lazy, Suspense } = await import('react');
  const ReactDOM = await import('react-dom');
  await import('~~/helpers/types/__global');
  const App = lazy(() => import('./components/layout/App'));

  ReactDOM.render(
    <React.StrictMode>
      <Suspense fallback={<div></div>}>
        <App />
      </Suspense>
    </React.StrictMode>,
    document.getElementById('root')
  );
})();
