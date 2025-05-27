import React, { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { doc, getDoc } from 'firebase/firestore';
import { db } from '../config/firebase';
import MainLayout from '../components/layouts/MainLayout';

function Profile() {
  const { currentUser } = useAuth();
  const [userData, setUserData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    async function fetchUserData() {
      if (!currentUser) {
        setLoading(false);
        return;
      }

      try {
        const userDoc = await getDoc(doc(db, 'users', currentUser.uid));
        if (userDoc.exists()) {
          setUserData(userDoc.data());
        } else {
          setError('No user data found');
        }
      } catch (err) {
        console.error('Error fetching user data:', err);
        setError('Failed to load user data');
      } finally {
        setLoading(false);
      }
    }

    fetchUserData();
  }, [currentUser]);

  if (!currentUser) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-lavender-50">
        <div className="bg-white p-8 rounded-xl shadow-md">
          <p className="text-gray-600">Please log in to view your profile.</p>
        </div>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-lavender-50">
        <div className="bg-white p-8 rounded-xl shadow-md">
          <p className="text-gray-600">Loading...</p>
        </div>
      </div>
    );
  }

  return (
    <MainLayout>
      <div className="pb-12">
        <header className="flex items-center justify-between mb-8 mt-8">
          <div>
            <h1 className="text-3xl font-display font-bold text-gray-800 mb-2">
              Profile
            </h1>
          </div>
        </header>
        <div className="max-w-3xl mx-auto">
          <div className="bg-white rounded-xl shadow-md overflow-hidden">
            <div className="p-8">
              <h1 className="text-2xl font-bold text-gray-900 mb-4">Profile</h1>
              
              {error && (
                <div className="bg-error-50 text-error-700 p-4 rounded-md mb-4">
                  {error}
                </div>
              )}

              {userData && (
                <div className="space-y-4">
                  <div>
                    <h2 className="text-sm font-medium text-gray-500">Username</h2>
                    <p className="mt-1 text-lg text-gray-900">{userData.username}</p>
                  </div>
                  
                  <div>
                    <h2 className="text-sm font-medium text-gray-500">Email</h2>
                    <p className="mt-1 text-lg text-gray-900">{userData.email}</p>
                  </div>
                  
                  <div>
                    <h2 className="text-sm font-medium text-gray-500">Account Created</h2>
                    <p className="mt-1 text-lg text-gray-900">
                      {new Date(userData.createdAt).toLocaleDateString()}
                    </p>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </MainLayout>
  );
}

export default Profile; 