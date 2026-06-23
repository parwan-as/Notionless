import { Page } from "./Page/Page";
import { AppStateProvider } from "./state/AppStateContext";
import { Navigate, Route, Routes } from "react-router-dom";
import { Auth } from "./auth/Auth";
import { Private } from "./auth/Private";

const privatePage = (
    <Private
        component={
            <AppStateProvider>
                <Page />
            </AppStateProvider>
        }
    />
);

function App() {
    return (
        <Routes>
            <Route path="/auth" element={<Auth />} />
            <Route path="/:id" element={privatePage} />
            <Route path="/" element={privatePage} />
            <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
    );
}

export default App;