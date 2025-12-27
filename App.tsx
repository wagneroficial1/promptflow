import { useEffect, useState } from 'react';
import { fetchSubscription, type SubscriptionPayload } from './services/subscription';
import { setPlan } from './lib/usageStore';
import { supabase } from './services/supabaseClient';

import { PlansPage } from './components/PlansPage';
import { LandingPage } from './components/LandingPage';
import { AuthPage } from './components/AuthPage';
import { Dashboard } from './components/Dashboard';


export default function App() {
  const [screen, setScreen] = useState<'landing' | 'auth' | 'dashboard' | 'plans'>('landing');
  const [user, setUser] = useState<any>(null);

  const [subscription, setSubscription] = useState<SubscriptionPayload | null>(null);
const [loadingSubscription, setLoadingSubscription] = useState(false);
const [subscriptionError, setSubscriptionError] = useState<string | null>(null);

async function refreshSubscription() {
  setLoadingSubscription(true);
  setSubscriptionError(null);

  const result = await fetchSubscription();

  if (result.ok && result.data) {
    setSubscription(result.data);

    // Fonte da verdade: backend → store apenas reflete
    setPlan(result.data.plan);

    console.log('SUBSCRIPTION OK:', JSON.stringify(result.data, null, 2));
  } else {
    setSubscription(null);
    setPlan('free'); // fallback seguro
    console.log('SUBSCRIPTION ERROR:', result.error);

    setSubscriptionError(result.error ?? 'Erro ao consultar assinatura');
  }

  setLoadingSubscription(false);
}

    // ✅ Mantém logado após F5 (restaura sessão do Supabase)
  useEffect(() => {
    let isMounted = true;

    async function restoreSession() {
      const { data, error } = await supabase.auth.getSession();
      if (!isMounted) return;

      const session = data?.session;

      if (error) {
        console.log('RESTORE SESSION ERROR:', error.message);
      }

      if (session?.user) {
        setUser({
          email: session.user.email ?? 'Usuário',
          name:
            (session.user.user_metadata?.name as string | undefined) ??
            (session.user.email ? session.user.email.split('@')[0] : 'Usuário'),
        });

        // Se já existe sessão, vai direto pro dashboard
        setScreen('dashboard');
      }
    }

    restoreSession();

    const { data: sub } = supabase.auth.onAuthStateChange((_event, session) => {
      if (!isMounted) return;

      if (session?.user) {
        setUser({
          email: session.user.email ?? 'Usuário',
          name:
            (session.user.user_metadata?.name as string | undefined) ??
            (session.user.email ? session.user.email.split('@')[0] : 'Usuário'),
        });
      } else {
        setUser(null);
      }
    });

    return () => {
      isMounted = false;
      sub.subscription.unsubscribe();
    };
  }, []);


  useEffect(() => {
  if (screen === 'dashboard') {
    refreshSubscription();
  }
}, [screen]);


  const handleSubscribe = async (_planId: 'free' | 'pro' | 'business') => {
  if (!user) {
    setScreen('auth');
    return;
  }

  setScreen('dashboard');
  await refreshSubscription();
};


  if (screen === 'landing') {
    return (
      <>

        <LandingPage
          onStart={() => setScreen('auth')}
          onPlans={() => setScreen('plans')}
        />
      </>
    );
  }

  if (screen === 'plans') {
    return (
      <>

        <PlansPage
          onBack={() => setScreen('landing')}
          onSubscribe={handleSubscribe}
        />
      </>
    );
  }

  if (screen === 'auth') {
    return (
      <>

        <AuthPage
          onBack={() => setScreen('landing')}
          onLogin={(loggedInUser: any) => {
            setUser(loggedInUser);
            setScreen('dashboard');
          }}
        />
      </>
    );
  }

  return (
    <>

        <Dashboard
          user={user}
          subscription={subscription}
          loadingSubscription={loadingSubscription}
          subscriptionError={subscriptionError}
          onLogout={() => {
            setUser(null);
            setScreen('landing');
          }}
          onUpgrade={() => setScreen('plans')}
        />

    </>
  );
}
