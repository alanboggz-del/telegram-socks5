import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { Route, Switch, Router as WouterRouter } from 'wouter';
import Home from './pages/home';

const queryClient = new QueryClient();

function NotFound() {
  return (
    <div className="min-h-screen bg-background text-foreground flex items-center justify-center font-mono">
      <div className="text-center space-y-4">
        <h1 className="text-4xl font-bold text-destructive">404</h1>
        <p className="text-muted-foreground">Page not found</p>
        <a href="/" className="text-primary hover:underline text-sm inline-block mt-4">
          Return to Status
        </a>
      </div>
    </div>
  );
}

function Router() {
  return (
    <Switch>
      <Route path="/" component={Home} />
      <Route component={NotFound} />
    </Switch>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <WouterRouter base={import.meta.env.BASE_URL.replace(/\/$/, '')}>
        <Router />
      </WouterRouter>
    </QueryClientProvider>
  );
}

export default App;
