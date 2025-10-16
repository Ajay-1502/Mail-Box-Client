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
import AuthContext from './components/context/auth-context';

function AppRouter() {
  const authCtx = useContext(AuthContext);

  const routes = createBrowserRouter([
    {
      path: '/inbox',
      element: authCtx.isLoggedIn ? <Inbox /> : <Navigate to="/" replace />,
    },
    {
      path: '/',
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
        <Navigate to="/" replace />
      ),
    },
    {
      path: '/sent',
      element: authCtx.isLoggedIn ? <Sent /> : <Navigate to="/" replace />,
    },
  ]);

  return <RouterProvider router={routes} />;
}

export default AppRouter;
