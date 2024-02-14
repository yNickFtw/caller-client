import "./App.css";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { Login } from "./pages/auth/login";
import { useUserStore } from "./states/useUserStore";
import { Home } from "./pages/home";
import { ThemeProvider } from "./components/theme-provider";
import { Register } from "./pages/auth/register";
import { Toaster } from "./components/ui/toaster";
import { useEffect, useState } from "react";
import { useThemeStore } from "./states/useThemeStore";
import { Servers } from "./pages/servers";
import { Server } from "./pages/server";

function App() {
  const { isLoggedIn } = useUserStore();
  const { setStoreTheme, themeSelected } = useThemeStore();

  useEffect(() => {
    if(themeSelected === "") {
      setStoreTheme("light")
    }
  }, [])

  return (
    <>
      <Toaster />
      <ThemeProvider defaultTheme="dark" storageKey="vite-ui-theme">
        <div className={themeSelected as string === "dark" ? "bg-zinc-950 transition-all" : "bg-zinc-50 transition-all"}>
          <BrowserRouter>
            <Routes>
              <Route
                path="/login"
                element={isLoggedIn ? <Home /> : <Login />}
              />
              <Route
                path="/register"
                element={isLoggedIn ? <Home /> : <Register />}
              />
              <Route path="/" element={isLoggedIn ? <Home /> : <Login />} />
              <Route path="/servers" element={isLoggedIn ? <Servers /> : <Login />} />
              <Route path="/server/:serverId"  element={isLoggedIn ? <Server /> : <Login />} />
            </Routes>
          </BrowserRouter>
        </div>
      </ThemeProvider>
    </>
  );
}

export default App;
