import { useContext } from 'react';
import Signup from './components/Signup';
import Login from './components/Login';
import ComposeEmail from './components/Composeemail';
import Inbox from './components/Inbox';
import Sent from './components/Sent';
import {
  createBrowserRouter,
  RouterProvider,
  Navigate,
} from 'react-router-dom';
import AuthProvider from './components/context/AuthProvider';
import AuthContext from './components/context/auth-context';

//import './App.css'

function App() {
  const authCtx = useContext(AuthContext);

  const routes = createBrowserRouter([
    {
      path: '/inbox',
      element: authCtx.isLoggedIn ? (
        <Inbox />
      ) : (
        <Navigate to="/login" replace />
      ),
    },
    {
      path: '/login',
      element: <Login />,
    },
    {
      path: '/signup',
      element: <Signup />,
    },
    {
      path: '/composeemail',
      element: authCtx.isLoggedIn ? (
        <ComposeEmail />
      ) : (
        <Navigate to="/login" replace />
      ),
    },
    {
      path: '/sent',
      element: authCtx.isLoggedIn ? <Sent /> : <Navigate to="/login" replace />,
    },
  ]);

  return (
    <>
      <AuthProvider>
        <RouterProvider router={routes} />
      </AuthProvider>
    </>
  );
}

export default App;
