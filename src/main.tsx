import { createRoot } from 'react-dom/client';
import App from './App';
import './ui/theme.css';

const container = document.getElementById('root') as HTMLElement;

createRoot(container).render(<App />);