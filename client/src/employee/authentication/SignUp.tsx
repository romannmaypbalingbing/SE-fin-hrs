import React from 'react';
import { useNavigate } from 'react-router-dom';
import marisonfront from '../../assets/marisonfront.png';
import marisonlogo from '../../assets/MARISON-LOGO.png';
import supabase from '../../supabaseClient';
// import { v4 as uuidv4 } from 'uuid';

const SignUp: React.FC = () => {
  const [email, setEmail] = React.useState('');
  const [password, setPassword] = React.useState('');
  const [confirmPassword, setConfirmPassword] = React.useState('');

  const navigate = useNavigate();

  const handleSignUp = async (e: React.FormEvent) => {
    e.preventDefault();
  
    if (password !== confirmPassword) {
      alert('Password does not match. Please re-enter password.');
      return;
    }
  
    try {
      const { error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: {
            role: ['guest'] // Assign the 'user' role
          }
        }
      });
  
      if (error) {
        console.error('Error signing up:', error);
        alert('Sign up failed: ' + error.message);
        return;
      }
  
      alert('Sign up successful!');
      navigate('/signin');
    } catch (error: any) {
      console.error('Error during sign up:', error.message);
      alert('Sign up failed: ' + error.message);
    }
  };
    
 

  return (
    <div className="bg-slate-100 flex justify-center items-center h-screen">
      {/* center layout */}
      <div className="flex flex-col lg:flex-row bg-white rounded-lg shadow-xl overflow-hidden w-full max-w-4xl">
        {/* left side images */}
        <div className="hidden lg:block lg:w-1/2 bg-cover group relative"> 
          <img 
            src={marisonfront} 
            alt="Marison-Front_Image" 
            className="h-full" 
          />
          <div className="absolute inset-0 bg-red-950 opacity-0 group-hover:opacity-70 transition-opacity duration-300 flex flex-col items-center justify-center px-6">
            {/* Buttons for redirecting to login */}
            <h1 className="text-white text-xl font-sans italic font-medium mb-2">
              Already have an account?
            </h1>
            <a href="/signin" className="bg-red-800 hover:bg-red-900 text-white font-normal py-2 px-4 rounded text-center w-full mt-6">
              Sign in
            </a>
            <div className="mt-4 flex items-center justify-between">
              <span className="border-b w-1/5 lg:w-1/4"></span>
                <p className="text-xs text-center text-gray-300 uppercase">
                  or
                </p>
              <span className="border-b w-1/5 lg:w-1/4"></span>
            </div>
            <a href="/guest/reservation-info" 
               className="bg-red-800 hover:bg-red-900 text-white font-normal text-center py-2 px-4 rounded w-full mt-6"
               onClick={() => navigate('/guest-info')}
            >
              Continue as Guest
            </a>
          </div>
        </div>

          {/* right side forms */}
        <div className="w-full p-8 lg:w-1/2">
          <div className="items-center">
            <img
              src={marisonlogo}
              alt="Marison-Logo"
              className="w-33 h-10 inline-block"
            />
          </div>
          {/* google sign up button */}
          <a
            href="#"
            className="flex items-center justify-center mt-4 text-white rounded-lg shadow-md hover:bg-gray-100"
          >
            <div className="px-4 py-3">
              <svg className="h-6 w-6" viewBox="0 0 40 40">
                <path
                  d="M36.3425 16.7358H35V16.6667H20V23.3333H29.4192C28.045 27.2142 24.3525 30 20 30C14.4775 30 10 25.5225 10 20C10 14.4775 14.4775 9.99999 20 9.99999C22.5492 9.99999 24.8683 10.9617 26.6342 12.5325L31.3483 7.81833C28.3717 5.04416 24.39 3.33333 20 3.33333C10.7958 3.33333 3.33335 10.7958 3.33335 20C3.33335 29.2042 10.7958 36.6667 20 36.6667C29.2042 36.6667 36.6667 29.2042 36.6667 20C36.6667 18.8825 36.5517 17.7917 36.3425 16.7358Z"
                  fill="#FFC107"
                />
                <path
                  d="M5.25497 12.2425L10.7308 16.2583C12.2125 12.59 15.8008 9.99999 20 9.99999C22.5491 9.99999 24.8683 10.9617 26.6341 12.5325L31.3483 7.81833C28.3716 5.04416 24.39 3.33333 20 3.33333C13.5983 3.33333 8.04663 6.94749 5.25497 12.2425Z"
                  fill="#FF3D00"
                />
                <path
                  d="M20 36.6667C24.305 36.6667 28.2167 35.0192 31.1742 32.34L26.0159 27.975C24.3425 29.2425 22.2625 30 20 30C15.665 30 11.9842 27.2359 10.5975 23.3784L5.16254 27.5659C7.92087 32.9634 13.5225 36.6667 20 36.6667Z"
                  fill="#4CAF50"
                />
                <path
                  d="M36.3425 16.7358H35V16.6667H20V23.3333H29.4192C28.7592 25.1975 27.56 26.805 26.0133 27.9758C26.0142 27.975 26.015 27.975 26.0158 27.9742L31.1742 32.3392C30.8092 32.6708 36.6667 28.3333 36.6667 20C36.6667 18.8825 36.5517 17.7917 36.3425 16.7358Z"
                  fill="#1976D2"
                />
              </svg>
            </div>
            <h1 className="w-5/6 text-center text-sm text-slate-600 font-semibold">
              Sign Up with Google
            </h1>
          </a>

          <div className="mt-4 flex items-center justify-between">
            <span className="border-b w-1/5 lg:w-1/4"></span>
            <p className="text-xs text-center text-gray-500 uppercase">
              or sign up with email
            </p>
            <span className="border-b w-1/5 lg:w-1/4"></span>
          </div>

          {/* email */}
          <div className="mt-2">
            <label className="block text-slate-500 text-sm font-medium mb-2 text-left">
              Email Address
            </label>
            <input
              className="bg-slate-100 text-gray-700 focus:outline-none focus:shadow-outline border border-gray-300 rounded py-1 block w-full appearance-none"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>
          
          <div className="mt-2">
            <div className="flex justify-between">
              <label className="block text-slate-500 text-sm font-medium mb-2">
                Password
              </label>
            </div>
            <input
              className="bg-slate-100 text-gray-700 focus:outline-none focus:shadow-outline border border-gray-300 rounded py-1 block w-full appearance-none"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </div>

          <div className="mt-2">
            <div className="flex justify-between">
              <label className="block text-slate-500 text-sm font-medium mb-2">
                Re-enter Password
              </label>
            </div>
            <input
              className="bg-slate-100 text-gray-700 focus:outline-none focus:shadow-outline border border-gray-300 rounded py-1 block w-full appearance-none"
              type="password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
            />
          </div>

          {/* button */}
          <div className="mt-8">
            <button 
              type="submit"
              onClick={handleSignUp}
              className="bg-red-800 text-white font-bold py-2 w-full rounded-sm hover:bg-red-900"
            >
              Sign Up
            </button>
          </div>

          <div className="mt-4 flex items-center justify-between">
            <span className="border-b w-1/5 md:w-1/4"></span>
            <a href="/signin" className="text-xs text-gray-500 uppercase hover:text-amber-700">
              or sign in
            </a>
            <span className="border-b w-1/5 md:w-1/4"></span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SignUp;
