// router
import { useRoutes } from 'react-router-dom';
import { routes } from './routes';

// react query
import { QueryClientProvider } from 'react-query';
import { getClient } from './queryClient';
import { ReactQueryDevtools } from 'react-query/devtools';

import Gnb from './components/gnb';

const App = () => {
  const elem = useRoutes(routes);
  const queryClient = getClient();

  return (
    <QueryClientProvider client={queryClient}>
      <Gnb />
      {elem}
      <ReactQueryDevtools />
    </QueryClientProvider>
  );
};

export default App;
