import { useState } from 'react';
import { toast, ToastContainer } from 'react-toastify';
import { Link } from 'react-router-dom';
import styles from './Signup.module.css';

const Signup = () => {
  const [email, setEmail] = useState();
  const [password, setPassword] = useState();
  const [confirm, setConfirm] = useState();
  const [showPassword, setShowPassword] = useState();
  const [error, setError] = useState();

  const submitHandler = async (event) => {
    event.preventDefault();

    if (password.trim().length > 5) {
      if (password != confirm) {
        setError("Password don't match");
      } else {
        setError('');
        await signup();
      }
    } else {
      alert('Password must be atleast 6 Characters long');
    }
  };

  async function signup() {
    try {
      const response = await fetch(
        'https://identitytoolkit.googleapis.com/v1/accounts:signUp?key=AIzaSyCjZyJhl_3dZo3dfdrcONzTCqseL1Ii6Xw',
        {
          method: 'POST',
          body: JSON.stringify({
            email: email,
            password: password,
            returnSecureToken: true,
          }),
          headers: { 'Content-Type': 'application/json' },
        }
      );

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error.message || 'Authentication failed');
      }

      const data = await response.json();
      console.log(data);
      toast.success('Signup is successful!🎉');
    } catch (err) {
      toast.error(err.message);
    }
  }

  return (
    <>
      <div className={`container ${styles.signupContainer}`}>
        <div className={`shadow-lg p-4 ${styles.card}`}>
          <h2 className="text-center mb-4 text-primary">Create Account</h2>
          <form onSubmit={submitHandler}>
            <div className="form-group mb-3 fw-semibold">
              <label>Email</label>
              <input
                type="email"
                className={`form-control ${styles.input}`}
                placeholder="Enter your email"
                value={email}
                required
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>

            <div className="form-group mb-3 fw-semibold">
              <label>Password</label>
              <input
                type={showPassword ? 'text' : 'password'}
                className={`form-control ${styles.input}`}
                placeholder="Enter password"
                value={password}
                required
                onChange={(e) => setPassword(e.target.value)}
              />
            </div>

            <div className="form-group mb-3 fw-semibold">
              <label>Confirm Password</label>
              <input
                type={showPassword ? 'text' : 'password'}
                className={`form-control ${error ? 'is-invalid' : ''} ${
                  styles.input
                }`}
                placeholder="Re-enter password"
                value={confirm}
                required
                onChange={(e) => setConfirm(e.target.value)}
              />
              {error && <div className="invalid-feedback">{error}</div>}
            </div>

            <div className="form-check mb-3 ">
              <input
                type="checkbox"
                className="form-check-input"
                onChange={() => setShowPassword(!showPassword)}
                id="togglePassword"
              />
              <label className="form-check-label" htmlFor="togglePassword">
                Show Password
              </label>
            </div>
            <button
              type="submit"
              className={`btn w-100 ${styles.primaryButton}`}
            >
              Sign Up
            </button>
          </form>

          <div className="text-center mt-3">
            <span className="text-muted">Have an account? </span>
          </div>
        </div>

        <ToastContainer position="top-right" autoClose={3000} />
      </div>
    </>
  );
};

export default Signup;
