import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { RouterProvider, createRouter } from "@tanstack/react-router";
import Keycloak, { KeycloakConfig } from "keycloak-js";
import { createContext } from "react";

import { routeTree } from "./routeTree.gen";
import { LoadingSpinner } from "./components/shared/loadingSpinner";

import "react-datepicker/dist/react-datepicker.css";
import "react-tooltip/dist/react-tooltip.css";

const basepath = import.meta.env.VITE_BASE_PATH ? new URL(import.meta.env.VITE_BASE_PATH).pathname : "/"

const initOptions: KeycloakConfig = {
  url: "https://obsidian.ccs.ornl.gov/auth/",
  realm: "obsidian",
  clientId: "obsidian-public",
};

const kc = new Keycloak(initOptions);

kc.init({
  onLoad: "login-required",
  redirectUri: window.location.toString(),
}).then(
  (auth) => {
    if (auth) {
      if (kc.token) {
        localStorage.setItem("exadigitAuthToken", kc.token);
      }
    }
  },
  () => {
    console.error("Authenticated Failed");
  }
);

export interface RouterContext {
  queryClient: QueryClient;
}

const queryClient = new QueryClient();
const router = createRouter({
  routeTree,
  context: { queryClient },
  defaultPendingComponent: LoadingSpinner,
});

declare module "@tanstack/react-router" {
  interface Register {
    router: typeof router;
  }
}

export const AppContext = createContext({ AuthToken: kc.token });

function App() {
  return (
    <AppContext.Provider value={{ AuthToken: kc.token }}>
      <QueryClientProvider client={queryClient}>
        <RouterProvider router={router} basepath={basepath}/>
      </QueryClientProvider>
    </AppContext.Provider>
  );
}

export default App;
