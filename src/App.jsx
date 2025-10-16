import AuthProvider from './components/context/AuthProvider';
import AppRouter from './AppRouter';

//import './App.css'

function App() {
  return (
    <>
      <AuthProvider>
        <AppRouter />
      </AuthProvider>
    </>
  );
}

export default App;
