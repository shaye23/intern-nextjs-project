import { useEffect, useState } from 'react';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import { useAuth } from '@/context/AuthContext';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import Router, { useRouter } from 'next/router';

const Signup = () => {
  const { signup } = useAuth();
  const [errorMessage, setErrorMessage] = useState('');
  const router=useRouter();

  const initialValues = {
    email: '',
    password: '',
    username: '', 
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
    username: Yup.string()
      .required('Username is required'),
  });

  const formik = useFormik({
    initialValues,
    onSubmit: async (values) => {
      try {
        // Pass the username to the signup function
        await signup(values.email, values.password, values.username);
        toast.success('Sign up successful!');
        router.push('/dashboard');
      } catch (err:any) {
        console.error(err);
        toast.error('Signup failed');
        console.log(err)
        if (err.code === 'auth/email-already-in-use' ) {
          setErrorMessage('Email is already in use. Please choose a different one.');
          console.log('Error Message:', errorMessage);
        } else {
          setErrorMessage('An error occurred during sign up. Please try again later.');
        }
      }
    },
    validationSchema, // This line should be inside the braces
  });
  

  return (
    <div className="flex items-center justify-center min-w-full mt-20">
      <div className="w-full max-w-md p-4 bg-white rounded shadow-md">
        <div>
          <h1 className="text-2xl font-semibold mb-4">Signup</h1>
          <form onSubmit={formik.handleSubmit}>
            {/* Username Field */}
            <div className="form-control">
              <label className="block mb-2 font-bold">Username:</label>
              <input
                type="text"
                name="username"
                className={`w-full p-2 border rounded mb-4 ${formik.touched.username && formik.errors.username ? 'border-red-500' : ''}`}
                placeholder="Your username"
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                value={formik.values.username}
              />
              {formik.touched.username && formik.errors.username && (
                <div className="error text-red-500">{formik.errors.username}</div>
              )}
            </div>
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
             {formik.errors.email && formik.errors.password && formik.errors.username && (
              <div className="error text-red-500 mt-2">Please enter email, username, and password</div>
            )}
            {errorMessage && (
    <div className="error text-red-500 mt-2 mb-2">{errorMessage}</div>
  )}
            {/* Submit Button */}
            <button
              type="submit"
              className="w-full bg-blue-500 text-white p-2 rounded"
            >
              Sign up
            </button>
           
            
          </form>
          <ToastContainer />
        </div>
      </div>
    </div>
  );
};
export default Signup;
