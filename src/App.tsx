import { BrowserRouter, Routes, Route } from 'react-router-dom';
import AppLayout from './layouts/AppLayout';
import { Home, MyInfo, People, Hiring, Reports, Files, Payroll, Settings } from './pages';
import { Chat } from './pages/Chat';
import { ChatProvider } from './contexts/ChatContext';

function App() {
  return (
    <ChatProvider>
      <BrowserRouter>
        <Routes>
          {/* Chat routes - Full page, no AppLayout */}
          <Route path="/chat" element={<Chat />} />
          <Route path="/chat/:conversationId" element={<Chat />} />

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
      </BrowserRouter>
    </ChatProvider>
  );
}

export default App;
