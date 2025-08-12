import { BrowserRouter } from 'react-router-dom';
import AppRoutes from './router';
import { ToastProvider } from './hooks/useToasts';
import { ToastsContainer } from './components/Toasts';

function App() {
    return (
        <>
            <BrowserRouter>
                <ToastProvider>
                    <AppRoutes />
                    <ToastsContainer />
                </ToastProvider>
            </BrowserRouter>
        </>
    );
}

export default App;
