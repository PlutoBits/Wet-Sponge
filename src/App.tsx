// import "./components/components.css";
// import "./pages/pages.css";
import NavBar from "./assets/components/NavBar";
import { Routes, Route, Navigate, BrowserRouter } from "react-router-dom";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { PagesContent } from "./assets/types/Types";
import NotFoundPage from "./assets/pages/NotFoundPage";
import "./assets/pages/pages.css";
import "./assets/components/components.css";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import {
  ProfileWarp,
  UsernameWarp,
  AccountDataWrap,
} from "./assets/components/AccountContext";

const queryClient = new QueryClient();

function App() {
  return (
    <>
      <ProfileWarp>
        <UsernameWarp>
          <AccountDataWrap>
            <QueryClientProvider client={queryClient}>
              <ToastContainer theme="dark" position="top-center" />
              <BrowserRouter>
                <NavBar />
                <Routes>
                  {PagesContent.map((Content) => (
                    <Route path={Content.name} element={Content.element} />
                  ))}
                  <Route path="/" element={<Navigate to="/Home" replace />} />
                  <Route path="*" element={<NotFoundPage />} />
                </Routes>
              </BrowserRouter>
            </QueryClientProvider>
          </AccountDataWrap>
        </UsernameWarp>
      </ProfileWarp>
    </>
  );
}

export default App;
/* rafce */
