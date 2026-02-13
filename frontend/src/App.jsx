import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Layout from './components/Layout';
import HomePage from './pages/HomePage';
import UploadPage from './pages/UploadPage';
import DocumentationPage from './pages/DocumentationPage';

function App() {
  return (
    <Router>
      <Layout>
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/upload" element={<UploadPage />} />
          <Route path="/documentation/:id" element={<DocumentationPage />} />
        </Routes>
      </Layout>
    </Router>
  );
}

export default App;
