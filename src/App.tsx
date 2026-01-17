import { BrowserRouter, Routes, Route } from 'react-router-dom';
import AppLayout from './layouts/AppLayout';
import { Home, MyInfo, People, Hiring, Reports, Files, Payroll, Settings } from './pages';
import { ArtifactWorkspace } from './pages/ArtifactWorkspace';
import { ChatTransitionsDemo } from './pages/ChatTransitionsDemo';
import { TextReflowDemo } from './pages/TextReflowDemo';
import { TextReflowDemo2 } from './pages/TextReflowDemo2';
import { ChatProvider } from './contexts/ChatContext';
import { ArtifactProvider } from './contexts/ArtifactContext';
import { ArtifactTransitionProvider } from './contexts/ArtifactTransitionContext';
import { ArtifactTransitionOverlay } from './components/ArtifactTransitionOverlay';

function App() {
  return (
    <ChatProvider>
      <ArtifactProvider>
        <ArtifactTransitionProvider>
        <BrowserRouter>
          <Routes>
            {/* Artifact workspace - Full page, no AppLayout */}
            <Route path="/artifact/:type/:id" element={<ArtifactWorkspace />} />

            {/* Demo routes for testing transitions */}
            <Route path="/chat-transitions-demo" element={<ChatTransitionsDemo />} />
            <Route path="/text-reflow-demo" element={<TextReflowDemo />} />
            <Route path="/text-reflow-demo-2" element={<TextReflowDemo2 />} />

            {/* Regular routes with AppLayout */}
            <Route
              path="/*"
              element={
                <AppLayout>
                  <Routes>
                    <Route path="/" element={<Home />} />
                    <Route path="/my-info" element={<MyInfo />} />
                    <Route path="/people" element={<People />} />
                    <Route path="/hiring" element={<Hiring />} />
                    <Route path="/reports" element={<Reports />} />
                    <Route path="/files" element={<Files />} />
                    <Route path="/payroll" element={<Payroll />} />
                    <Route path="/settings" element={<Settings />} />
                  </Routes>
                </AppLayout>
              }
            />
          </Routes>
          <ArtifactTransitionOverlay />
        </BrowserRouter>
        </ArtifactTransitionProvider>
      </ArtifactProvider>
    </ChatProvider>
  );
}

export default App;
