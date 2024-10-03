import { useState, useEffect } from 'react';
import axios from 'axios';
import logo from '/logo-removebg-preview.png';
import Spinner from "@/components/ui/Spinner"; 

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [isLoggedIn, setIsLoggedIn] = useState(false); 
  const [loading, setLoading] = useState(false); 
  const [showPassword, setShowPassword] = useState(false); 

  const base_url = import.meta.env.VITE_API_URL;

  useEffect(() => {
    const token = localStorage.getItem('authToken');
    if (token) {
      setIsLoggedIn(true); 
    }
  }, []);

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true); 
    try {
      const response = await axios.post(`${base_url}/api/login`, { email, password });
      const token = response.data.session_id;
      localStorage.setItem('authToken', token);

      setSuccess('Login successful!');
      setIsLoggedIn(true); 

      // Redirect to the CallMeeting page
      setTimeout(() => {
        window.location.href = '/main/callmeeting';
      }, 1000);
    } catch (error) {
      setError('Invalid email or password');
      console.error('Error logging in:', error);
    } finally {
      setLoading(false); // Stop the spinner when login is done
    }
  };

  return (
    <div className="font-[sans-serif] bg-gray-200 text-gray-800">
      <div className="min-h-screen flex flex-col items-center justify-center lg:p-6 p-4">
        <div className="grid md:grid-cols-2 items-center gap-10 max-w-6xl w-full">
          
          {/* Left side content */}
          <div>
            <a href="javascript:void(0)">
              <img
                src={logo}
                alt="logo"
                className="w-100 inline-block ml-[-80px]"
              />
            </a>
            <h2 className="text-4xl font-extrabold lg:leading-[50px] text-black">
            Streamlined Meetings with Automated Documentation
            </h2>
            <p className="text-sm mt-6 text-black">
            Streamline your meeting experience with our intuitive platform. Effortlessly organize, manage, and document meetings, ensuring everything runs smoothly and efficiently.
            </p>
          </div>
          
          
          {!isLoggedIn ? (
            // Login form
            <form onSubmit={handleLogin} className="bg-white rounded-xl px-6 py-8 space-y-6 max-w-md md:ml-auto w-full">
              <h3 className="text-3xl font-extrabold mb-12">Sign in</h3>

              {error && <p className="text-red-500 text-center">{error}</p>}
              {success && <p className="text-green-500 text-center">{success}</p>} 

              <div>
                <input
                  name="email"
                  type="email"
                  placeholder="Email address"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  className="bg-gray-100 focus:bg-transparent w-full text-sm px-4 py-3.5 rounded-md outline-gray-800"
                />
              </div>
              <div className="relative">
                <input
                  name="password"
                  type={showPassword ? "text" : "password"} // Toggle input type based on showPassword
                  placeholder="Password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  className="bg-gray-100 focus:bg-transparent w-full text-sm px-4 py-3.5 rounded-md outline-gray-800"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)} // Toggle showPassword state
                  className="absolute inset-y-0 right-0 px-3 py-3.5 text-sm text-gray-500 focus:outline-none"
                >
                  {showPassword ? "Hide" : "Show"}
                </button>
              </div>
              <div className="text-sm text-right">
                <a href="javascript:void(0);" className="text-blue-600 font-semibold hover:underline">
                  Forgot your password?
                </a>
              </div>
              <div className="relative">
                <button
                  type="submit"
                  className="w-full shadow-xl py-3 px-6 text-sm font-semibold rounded-md text-white bg-gray-800 hover:bg-[#222] focus:outline-none"
                >
                  {loading ? (
                    <Spinner style={{ width: '20px', height: '20px', marginRight: '10px' }} /> // Spinner inside the button
                  ) : (
                    "Log in"
                  )}
                </button>
              </div>
            </form>
          ) : (
            // If user is logged in, show logout button
            <div className="bg-white rounded-xl px-6 py-8 space-y-6 max-w-md md:ml-auto w-full">
              <h3 className="text-3xl font-extrabold mb-12">Welcome back!</h3>
              <p className="text-lg">You are already logged in.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Login;
