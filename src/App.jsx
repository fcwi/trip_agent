import { lazy, Suspense, useEffect } from "react";
import { Loader } from "lucide-react";
import AuthenticationScreen from "./components/AuthenticationScreen.jsx";
import { useTripAuthentication } from "./hooks/useTripAuthentication.js";

const loadAuthenticatedTripApp = () => import("./AuthenticatedTripApp.jsx");
const AuthenticatedTripApp = lazy(loadAuthenticatedTripApp);
const preloadAuthenticatedTripApp = () =>
  loadAuthenticatedTripApp().catch(() => {
    // React.lazy 會將實際載入錯誤交給全域錯誤邊界處理。
  });

const LoadingScreen = ({ label }) => (
  <main
    id="main-content"
    role="status"
    aria-live="polite"
    className="flex min-h-screen items-center justify-center bg-stone-50 text-stone-600 dark:bg-neutral-950 dark:text-neutral-300"
  >
    <div className="flex items-center gap-3 rounded-2xl border border-stone-200 bg-white/80 px-5 py-3 text-sm font-bold shadow-lg backdrop-blur dark:border-neutral-700 dark:bg-neutral-900/80">
      <Loader aria-hidden="true" className="h-5 w-5 animate-spin" />
      <span>{label}</span>
    </div>
  </main>
);

const App = () => {
  const authentication = useTripAuthentication();
  const { isAuthReady, isAuthLoading, isVerified } = authentication;

  useEffect(() => {
    if (isAuthLoading || isVerified) {
      preloadAuthenticatedTripApp();
    }
  }, [isAuthLoading, isVerified]);

  if (!isAuthReady) {
    return <LoadingScreen label="確認登入狀態中…" />;
  }

  if (!isVerified) {
    return (
      <AuthenticationScreen
        authentication={authentication}
        onUnlockIntent={preloadAuthenticatedTripApp}
      />
    );
  }

  return (
    <Suspense fallback={<LoadingScreen label="載入旅程內容中…" />}>
      <AuthenticatedTripApp authentication={authentication} />
    </Suspense>
  );
};

export default App;
