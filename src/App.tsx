import { useEffect } from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { useAppSelector } from './store/hooks';
import Layout from './components/layout/AppLayout';
import Home from './pages/Home';
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
          <Route path='/about' element={<Box variant='div'>About - Coming Soon</Box>} />
          <Route path='/projects' element={<Box variant='div'>Projects - Coming Soon</Box>} />
          <Route path='/contact' element={<Box variant='div'>Contact - Coming Soon</Box>} />
        </Routes>
      </Layout>
    </BrowserRouter>
  );
}

export default App;
