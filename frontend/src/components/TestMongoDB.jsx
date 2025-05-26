import React, { useState, useEffect } from 'react';
import { api } from '../utils/api';

function TestMongoDB() {
  const [routines, setRoutines] = useState([]);
  const [products, setProducts] = useState([]);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);

  // Using the dummy user ID for testing
  const testUserId = 'demo-user-123';

  useEffect(() => {
    async function fetchData() {
      try {
        setLoading(true);
        setError(null);

        // Fetch both routines and products
        const [routinesData, productsData] = await Promise.all([
          api.getRoutines(testUserId),
          api.getProducts(testUserId)
        ]);

        setRoutines(routinesData);
        setProducts(productsData);
      } catch (err) {
        console.error('Error fetching data:', err);
        setError(err.message || 'Failed to fetch data');
      } finally {
        setLoading(false);
      }
    }

    fetchData();
  }, []);

  if (loading) {
    return (
      <div className="p-4">
        <h2 className="text-xl font-bold mb-4">Loading...</h2>
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-4">
        <h2 className="text-xl font-bold mb-4 text-red-600">Error:</h2>
        <p>{error}</p>
      </div>
    );
  }

  return (
    <div className="p-4">
      <h2 className="text-2xl font-bold mb-6">MongoDB Test Results</h2>
      
      <div className="mb-8">
        <h3 className="text-xl font-semibold mb-4">Routines ({routines.length})</h3>
        <div className="grid gap-4">
          {routines.map(routine => (
            <div key={routine._id} className="border p-4 rounded-lg">
              <h4 className="font-bold">{routine.name}</h4>
              <p className="text-gray-600">{routine.description || 'No description'}</p>
              <p className="text-sm text-gray-500">Schedule: {routine.schedule}</p>
            </div>
          ))}
        </div>
      </div>

      <div>
        <h3 className="text-xl font-semibold mb-4">Products ({products.length})</h3>
        <div className="grid gap-4">
          {products.map(product => (
            <div key={product._id} className="border p-4 rounded-lg">
              <h4 className="font-bold">{product.name}</h4>
              <p className="text-gray-600">{product.brand || 'No brand'}</p>
              <p className="text-sm text-gray-500">Category: {product.category || 'Uncategorized'}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default TestMongoDB; 