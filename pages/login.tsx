import { useState } from 'react';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import { useAuth } from '@/context/AuthContext';
import { useRouter } from 'next/router';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import Navbar  from './components/Navbar';

const Login = () => {
  const { login } = useAuth();
  const router = useRouter();
  const [errorMessage, setErrorMessage] = useState('');

  const initialValues = {
    email: '',
    password: '',
  };

  const validationSchema = Yup.object().shape({
    email: Yup.string()
      .email('Invalid email address')
      .required('Email is required')
      .matches(/@/, 'Email must contain "@"'),
    password: Yup.string()
      .required('Password is required')
      .min(8, 'Password must be at least 8 characters')
      .matches(/[!@#$%^&*(),.?":{}|<>]/, 'Password must contain at least one special character'),
  });

  const formik = useFormik({
    initialValues,
    onSubmit: async (values) => {
      try {
        await login(values.email, values.password);
        toast.success('Login successful!');
         router.push('/dashboard');
        

        // Show success notification
        
      } catch (err:any) {
        toast.error('Login failed');
        console.error(err);

        console.log('Error Object:', err);
        // Check the error code to determine the type of error
        if (err.code === 'auth/invalid-credential') {
          setErrorMessage('Invalid email or password. Please try again.');
        } else {
          setErrorMessage('An error occurred. Please try again later.');
        }
      }
    },
    validationSchema,
  });

  return (
    <div className="flex items-center justify-center min-w-full mt-20 ">
      <div className="w-full max-w-md p-4 bg-white rounded shadow-md">
        <div>
          <h1 className="text-2xl font-semibold mb-4 items-center">LOGIN</h1>
          <form onSubmit={formik.handleSubmit}>
            {/* Email Field */}
            <div className="form-control">
              <label className="block mb-2 font-bold">Email:</label>
              <input
                type="email"
                name="email"
                className={`w-full p-2 border rounded mb-4 ${formik.touched.email && formik.errors.email ? 'border-red-500' : ''}`}
                placeholder="Your email"
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                value={formik.values.email}
              />
              {formik.touched.email && formik.errors.email && (
                <div className="error text-red-500">{formik.errors.email}</div>
              )}
            </div>
            {/* Password Field */}
            <div className="form-control">
              <label className="block mb-2 font-bold">Password:</label>
              <input
                type="password"
                name="password"
                className={`w-full p-2 border rounded mb-4 ${formik.touched.password && formik.errors.password ? 'border-red-500' : ''}`}
                placeholder="Your password"
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                value={formik.values.password}
              />
              {formik.touched.password && formik.errors.password && (
                <div className="error text-red-500">{formik.errors.password}</div>
              )}
            </div>
            {/* Error Message */}
            {errorMessage && (
              <div className="error text-red-500 mt-2 mb-2">{errorMessage}</div>
            )}
            {/* Submit Button */}
            <button
              type="submit"
              className="w-full bg-blue-500 text-white p-2 rounded"
            >
              Login
            </button>
            
          </form>
        
          
        </div>
      </div>
    </div>
  );
};

export default Login;
