import { useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { useAppSelector } from './store/hooks';
import Layout from './components/layout/AppLayout';
import Home from './pages/Home';
import About from './pages/About';
import Projects from './pages/Projects';
import Contact from './pages/Contact';
import GitHubDashboard from './pages/projects/GitHubDashboard';
import { Box } from '@cloudscape-design/components';

function App() {
  const { t } = useTranslation('errors');
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
          <Route path='/projects' element={<Projects />} />
          <Route path='/projects/github-dashboard' element={<GitHubDashboard />} />
          <Route path='/contact' element={<Contact />} />
          <Route
            path='*'
            element={
              <Box textAlign='center' padding='xxl'>
                {t('notFound')}
              </Box>
            }
          />
        </Routes>
      </Layout>
    </BrowserRouter>
  );
}

export default App;
