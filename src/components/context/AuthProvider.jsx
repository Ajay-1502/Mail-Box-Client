import { useState } from 'react';
import AuthContext from './auth-context';

const AuthProvider = (props) => {
  const storedEmail = localStorage.getItem('email');
  const [email, setEmail] = useState(storedEmail);

  const loginHandler = (email) => {
    setEmail(email);
    localStorage.setItem('email', email);
  };

  const logoutHandler = () => {
    setEmail(null);
    localStorage.removeItem('email');
  };

  const authObj = {
    isLoggedIn: !!email, //this converts any value to boolean in js. If string is empty it returns false, else true.
    login: loginHandler,
    logout: logoutHandler,
  };

  return (
    <AuthContext.Provider value={authObj}>
      {props.children}
    </AuthContext.Provider>
  );
};

export default AuthProvider;
