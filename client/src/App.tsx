import { Switch, Route } from "wouter";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import NotFound from "@/pages/not-found";
import Home from "@/pages/Home";
import Quotes from "@/pages/Quotes";
import Journaling from "@/pages/Journaling";
import CustomTherapists from "@/pages/CustomTherapists";
import CustomTherapistForm from "@/pages/CustomTherapistForm";
import { LanguageProvider } from "./contexts/LanguageContext";

// Router组件在LanguageProvider内部使用
const Router = () => {
  return (
    <Switch>
      <Route path="/" component={Home}/>
      <Route path="/quotes" component={Quotes}/>
      <Route path="/journaling" component={Journaling}/>
      <Route path="/custom-therapists" component={CustomTherapists}/>
      <Route path="/custom-therapists/create" component={CustomTherapistForm}/>
      <Route path="/custom-therapists/edit/:id" component={CustomTherapistForm}/>
      <Route component={NotFound} />
    </Switch>
  );
};

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <LanguageProvider>
        <Router />
        <Toaster />
      </LanguageProvider>
    </QueryClientProvider>
  );
}

export default App;
