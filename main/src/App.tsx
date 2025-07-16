import { BrowserRouter } from "react-router-dom"
import AppRouter from "./router"
import './App.css'
import { AuthProvider } from "./hooks/useAuth"
import { ToastProvider } from "./hooks/useToasts"
import { ToastsContainer } from "./components/Toasts"

function App() {


  return (
    <>
      <BrowserRouter>

        <AuthProvider>
        <ToastProvider>

          <ToastsContainer/>
          <AppRouter/>

        </ToastProvider>
        </AuthProvider>

      </BrowserRouter>
    </>
  )
}

export default App
