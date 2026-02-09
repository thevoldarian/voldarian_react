import { useEffect } from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { useAppSelector } from './store/hooks';
import Layout from './components/layout/AppLayout';
import Home from './pages/Home';
import About from './pages/About';
import Contact from './pages/Contact';
import { Box } from '@cloudscape-design/components';

function App() {
  const theme = useAppSelector(state => state.preferences.theme);

  useEffect(() => {
    document.body.classList.toggle('awsui-dark-mode', theme === 'dark');
  }, [theme]);

  return (
    <BrowserRouter>
      <Layout>
        <Routes>
          <Route path='/' element={<Home />} />
          <Route path='/about' element={<About />} />
          <Route path='/projects' element={<Box variant='div'>Projects - Coming Soon</Box>} />
          <Route path='/contact' element={<Contact />} />
          <Route path='*' element={<Box variant='div'>404 - Page Not Found</Box>} />
        </Routes>
      </Layout>
    </BrowserRouter>
  );
}

export default App;
