import { useState } from 'react';
import { ToastContainer, toast } from 'react-toastify';
import { FaEye, FaEyeSlash } from 'react-icons/fa';
import styles from './Login.module.css';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (password.trim().length > 6) {
      await loginHandler();
    } else {
      toast.error('Password must be atleast 6 characters long');
    }
  };

  const loginHandler = async () => {
    try {
      const response = await fetch(
        'https://identitytoolkit.googleapis.com/v1/accounts:signInWithPassword?key=AIzaSyCjZyJhl_3dZo3dfdrcONzTCqseL1Ii6Xw',
        {
          method: 'POST',
          body: JSON.stringify({
            email: email,
            password: password,
            returnSecureToken: true,
          }),
          headers: {
            'Content-type': 'application/json',
          },
        }
      );

      if (!response.ok) {
        const errMsg = await response.json();
        throw new Error(errMsg.error.message || 'Login failed');
      }

      const data = await response.json();
      console.log(data);
      localStorage.setItem('token', data.idToken);
      toast.success('Login is successful!🎉');
    } catch (err) {
      toast.error(err.message);
    }
  };

  return (
    <div className={`${styles.loginBg}`}>
      <div className={`${styles.loginContainer} card shadow p-4`}>
        <h3 className="text-center mb-4">Login</h3>
        <form onSubmit={handleSubmit}>
          <div className="form-group mb-3">
            <input
              type="email"
              placeholder="Email"
              className={`form-control ${styles.customInput}`}
              value={email}
              required
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>

          <div className="form-group mb-3 position-relative">
            <input
              type={showPassword ? 'text' : 'password'}
              placeholder="Password"
              className={`form-control ${styles.customInput}`}
              value={password}
              required
              onChange={(e) => setPassword(e.target.value)}
            />
            <span
              className={`${styles.passwordToggle}`}
              onClick={togglePasswordVisibility}
            >
              {showPassword ? <FaEyeSlash /> : <FaEye />}
            </span>
          </div>

          <button
            type="submit"
            className={`btn ${styles.btnPrimary} w-100 mb-2`}
          >
            Login
          </button>

          <div className="text-center"></div>

          <div className="text-center mt-3">
            <small className="text-muted">Don't have an account?</small>
          </div>
        </form>
      </div>
      <ToastContainer position="top-right" autoClose={3000} />
    </div>
  );
};

export default Login;
