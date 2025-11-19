import './App.css';
import { ThemeProvider } from './components/theme/ThemeProvider';
import { Root } from './ide/Root';

function App() {
  return (
    <ThemeProvider>
      <Root />
    </ThemeProvider>
  );
}

export default App;
