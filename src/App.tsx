import { BrowserRouter, Routes, Route } from 'react-router-dom';
import AppLayout from './layouts/AppLayout';
import { Home, MyInfo, People, Hiring, Reports, Files, Payroll } from './pages';

function App() {
  return (
    <BrowserRouter>
      <AppLayout>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/my-info" element={<MyInfo />} />
          <Route path="/people" element={<People />} />
          <Route path="/hiring" element={<Hiring />} />
          <Route path="/reports" element={<Reports />} />
          <Route path="/files" element={<Files />} />
          <Route path="/payroll" element={<Payroll />} />
        </Routes>
      </AppLayout>
    </BrowserRouter>
  );
}

export default App;
