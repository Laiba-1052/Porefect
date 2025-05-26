import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Droplet, Eye, EyeOff, AlertCircle } from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';
import { db } from '../../config/firebase';
import { doc, setDoc } from 'firebase/firestore';
import Button from '../../components/ui/Button';

function Register() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [username, setUsername] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  
  const { signup } = useAuth();
  const navigate = useNavigate();
  
  const toggleShowPassword = () => {
    setShowPassword(!showPassword);
  };
  
  const handleSubmit = async (e) => {
    e.preventDefault();
    
    try {
      setError('');
      setLoading(true);
      
      // Create the user in Firebase Auth
      const userCredential = await signup(email, password);
      
      // Create a user profile document in Firestore
      try {
        await setDoc(doc(db, 'users', userCredential.user.uid), {
          username,
          email,
          createdAt: new Date().toISOString(),
        });
      } catch (firestoreError) {
        console.error('Firestore Error:', firestoreError);
        // If Firestore fails, we should still have the auth user created
        setError('Account created but profile setup failed: ' + firestoreError.message);
        // Navigate anyway since the auth was successful
        navigate('/dashboard');
        return;
      }
      
      navigate('/dashboard');
    } catch (error) {
      console.error('Firebase Auth Error:', error);
      setError('Registration failed: ' + (error.message || 'Unknown error'));
    } finally {
      setLoading(false);
    }
  };
  
  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-lavender-50 via-white to-mint-50 px-4 py-12">
      <div className="max-w-md w-full space-y-8 bg-white p-8 rounded-xl shadow-md">
        <div className="text-center">
          <Link to="/" className="inline-flex items-center">
            <Droplet className="h-8 w-8 text-lavender-500" />
            <span className="ml-2 text-2xl font-display font-bold text-lavender-700">Porefect</span>
          </Link>
          <h2 className="mt-6 text-3xl font-display font-bold text-gray-800">Create an account</h2>
          <p className="mt-2 text-sm text-gray-600">
            Or{" "}
            <Link to="/login" className="font-medium text-lavender-600 hover:text-lavender-500">
              sign in to your account
            </Link>
          </p>
        </div>
        
        {error && (
          <div className="bg-error-50 p-4 rounded-md flex items-start">
            <AlertCircle className="h-5 w-5 text-error-500 mt-0.5 mr-2 flex-shrink-0" />
            <p className="text-error-700 text-sm">{error}</p>
          </div>
        )}
        
        <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
          <div className="space-y-4">
            <div>
              <label htmlFor="username" className="block text-sm font-medium text-gray-700">
                Username
              </label>
              <input
                id="username"
                name="username"
                type="text"
                required
                className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-lavender-500 focus:border-lavender-500"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
              />
            </div>
            
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-700">
                Email address
              </label>
              <input
                id="email"
                name="email"
                type="email"
                autoComplete="email"
                required
                className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-lavender-500 focus:border-lavender-500"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>
            
            <div>
              <label htmlFor="password" className="block text-sm font-medium text-gray-700">
                Password
              </label>
              <div className="mt-1 relative rounded-md shadow-sm">
                <input
                  id="password"
                  name="password"
                  type={showPassword ? "text" : "password"}
                  autoComplete="new-password"
                  required
                  className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-lavender-500 focus:border-lavender-500 pr-10"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                />
                <button
                  type="button"
                  className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-400 hover:text-gray-600"
                  onClick={toggleShowPassword}
                >
                  {showPassword ? (
                    <EyeOff className="h-5 w-5" />
                  ) : (
                    <Eye className="h-5 w-5" />
                  )}
                </button>
              </div>
            </div>
          </div>
          
          <Button
            type="submit"
            variant="primary"
            fullWidth
            loading={loading}
            disabled={loading}
          >
            Create account
          </Button>
        </form>
      </div>
    </div>
  );
}

export default Register;