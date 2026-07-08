import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { Toaster } from '@/components/ui/toaster';
import { TooltipProvider } from '@/components/ui/tooltip';
import NotFound from '@/pages/not-found';
import { Route, Switch, Router as WouterRouter } from 'wouter';
import { Layout } from '@/components/layout';
import { SiteProvider } from '@/context/site-context';

import Home from '@/pages/home';
import About from '@/pages/about';
import Vision from '@/pages/vision';
import Media from '@/pages/media';
import Contact from '@/pages/contact';
import Admin from '@/pages/admin';

const queryClient = new QueryClient();

function Router() {
  return (
    <Switch>
      {/* Admin panel — no Layout wrapper */}
      <Route path="/admin" component={Admin} />

      {/* All public pages wrapped in Layout */}
      <Route>
        {() => (
          <Layout>
            <Switch>
              <Route path="/" component={Home} />
              <Route path="/about" component={About} />
              <Route path="/vision" component={Vision} />
              <Route path="/media" component={Media} />
              <Route path="/contact" component={Contact} />
              <Route component={NotFound} />
            </Switch>
          </Layout>
        )}
      </Route>
    </Switch>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <SiteProvider>
          <WouterRouter base={import.meta.env.BASE_URL.replace(/\/$/, '')}>
            <Router />
          </WouterRouter>
          <Toaster />
        </SiteProvider>
      </TooltipProvider>
    </QueryClientProvider>
  );
}

export default App;
