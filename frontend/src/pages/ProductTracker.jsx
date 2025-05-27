import React, { useState, useEffect } from 'react';
import { Search, Filter, ShoppingBag, Clock, Star, Calendar, AlertCircle } from 'lucide-react';
import MainLayout from '../components/layouts/MainLayout';
import Card from '../components/ui/Card';
import { useAuth } from '../contexts/AuthContext';
import { format, differenceInDays } from 'date-fns';
import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

function ProductTracker() {
  const { userProfile } = useAuth();
  const [products, setProducts] = useState([]);
  const [filteredProducts, setFilteredProducts] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  
  const categories = [
    'Cleanser',
    'Toner',
    'Serum',
    'Moisturizer',
    'Sunscreen',
    'Mask',
    'Exfoliator',
    'Oil',
    'Treatment',
    'Other'
  ];
  
  useEffect(() => {
    const fetchProducts = async () => {
      try {
        setIsLoading(true);
        setError(null);
        const userId = userProfile?.uid || 'demo-user-123';
        const response = await axios.get(`${API_URL}/products/${userId}`);
        setProducts(response.data);
        setFilteredProducts(response.data);
      } catch (error) {
        console.error('Error fetching products:', error);
        setError('Failed to load products. Please try again later.');
      } finally {
        setIsLoading(false);
      }
    };

    fetchProducts();
  }, [userProfile]);
  
  useEffect(() => {
    let filtered = products;
    
    // Apply search query
    if (searchQuery) {
      filtered = filtered.filter(
        product => product.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
                 product.brand.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }
    
    // Apply category filter
    if (categoryFilter) {
      filtered = filtered.filter(product => product.category === categoryFilter);
    }
    
    setFilteredProducts(filtered);
  }, [searchQuery, categoryFilter, products]);
  
  const isProductExpiringSoon = (product) => {
    if (!product.expiryDate) return false;
    const expiryDate = new Date(product.expiryDate);
    const daysUntilExpiry = differenceInDays(expiryDate, new Date());
    return daysUntilExpiry <= 30 && daysUntilExpiry > 0;
  };
  
  const isProductExpired = (product) => {
    if (!product.expiryDate) return false;
    const expiryDate = new Date(product.expiryDate);
    return expiryDate < new Date();
  };
  
  if (isLoading) {
    return (
      <MainLayout>
        <div className="flex items-center justify-center h-[60vh]">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-lavender-500"></div>
        </div>
      </MainLayout>
    );
  }

  if (error) {
    return (
      <MainLayout>
        <div className="flex flex-col items-center justify-center h-[60vh] text-center">
          <div className="text-error-500 mb-4">
            <AlertCircle size={48} />
          </div>
          <h2 className="text-xl font-medium text-gray-800 mb-2">Oops! Something went wrong</h2>
          <p className="text-gray-600">{error}</p>
        </div>
      </MainLayout>
    );
  }
  
  return (
    <MainLayout>
      <div className="pb-12">
        <header className="flex items-center justify-between mb-8 mt-8">
          <div>
            <h1 className="text-3xl font-display font-bold text-gray-800 mb-2">
              Product Tracker
            </h1>
            <p className="text-gray-600">
              Keep track of all your skincare products
            </p>
          </div>
        </header>
        
        {/* Search and Filters */}
        <div className="mb-6 flex flex-col md:flex-row md:items-center space-y-4 md:space-y-0 md:space-x-4">
          <div className="relative flex-1">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <Search size={18} className="text-gray-400" />
            </div>
            <input
              type="text"
              className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-lavender-500 focus:border-lavender-500"
              placeholder="Search products..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
          
          <div className="w-full md:w-64">
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Filter size={18} className="text-gray-400" />
              </div>
              <select
                className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-lavender-500 focus:border-lavender-500"
                value={categoryFilter}
                onChange={(e) => setCategoryFilter(e.target.value)}
              >
                <option value="">All Categories</option>
                {categories.map((category) => (
                  <option key={category} value={category}>
                    {category}
                  </option>
                ))}
              </select>
            </div>
          </div>
        </div>
        
        {/* Product Grid */}
        {filteredProducts.length === 0 ? (
          <Card className="p-8 text-center">
            <h3 className="text-lg font-medium text-gray-700 mb-2">No products found</h3>
            <p className="text-gray-500">Try a different search or filter.</p>
          </Card>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredProducts.map((product) => (
              <Card
                key={product._id}
                className="h-full hover:shadow-md transition-shadow"
              >
                <div className="relative">
                  <img 
                    src={product.imageUrl} 
                    alt={product.name} 
                    className="w-full h-48 object-cover rounded-md mb-4" 
                  />
                  {isProductExpired(product) && (
                    <div className="absolute top-2 right-2 bg-error-500 text-white text-xs font-bold px-2 py-1 rounded-md">
                      EXPIRED
                    </div>
                  )}
                  {isProductExpiringSoon(product) && !isProductExpired(product) && (
                    <div className="absolute top-2 right-2 bg-warning-500 text-white text-xs font-bold px-2 py-1 rounded-md">
                      EXPIRING SOON
                    </div>
                  )}
                </div>
                
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-medium text-gray-500 bg-gray-100 px-2 py-1 rounded">
                      {product.category}
                    </span>
                    <div className="flex">
                      {Array(5).fill(0).map((_, i) => (
                        <Star 
                          key={i}
                          size={16}
                          className={i < (product.rating || 0) ? "text-yellow-400 fill-current" : "text-gray-300"}
                        />
                      ))}
                    </div>
                  </div>
                  
                  <h3 className="font-medium text-gray-800">{product.name}</h3>
                  <p className="text-sm text-gray-600">{product.brand}</p>
                  
                  {(product.purchaseDate || product.expiryDate) && (
                    <div className="pt-2 space-y-1">
                      {product.purchaseDate && (
                        <div className="flex items-center text-xs text-gray-500">
                          <ShoppingBag size={14} className="mr-1" />
                          <span>Purchased: {format(new Date(product.purchaseDate), 'MMM d, yyyy')}</span>
                        </div>
                      )}
                      {product.expiryDate && (
                        <div className="flex items-center text-xs text-gray-500">
                          <Calendar size={14} className="mr-1" />
                          <span>Expires: {format(new Date(product.expiryDate), 'MMM d, yyyy')}</span>
                        </div>
                      )}
                    </div>
                  )}
                  
                  {(product.price || product.size) && (
                    <div className="flex justify-between pt-2 text-sm">
                      {product.price && (
                        <span>${product.price.toFixed(2)}</span>
                      )}
                      {product.size && (
                        <span className="text-gray-500">{product.size}</span>
                      )}
                    </div>
                  )}
                </div>
              </Card>
            ))}
          </div>
        )}
      </div>
    </MainLayout>
  );
}

export default ProductTracker;