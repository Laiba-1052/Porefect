import React, { useState, useEffect } from 'react';
import { Plus, Search, Filter, ShoppingBag, Clock, Star, Calendar, AlertCircle } from 'lucide-react';
import MainLayout from '../components/layouts/MainLayout';
import Card from '../components/ui/Card';
import Button from '../components/ui/Button';
import { useAuth } from '../contexts/AuthContext';
import { dummyProducts } from '../data/dummyData';
import { format, differenceInDays } from 'date-fns';

function ProductTracker() {
  const { userProfile } = useAuth();
  const [products, setProducts] = useState([]);
  const [filteredProducts, setFilteredProducts] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('');
  const [showAddModal, setShowAddModal] = useState(false);
  
  // Form states
  const [newProductName, setNewProductName] = useState('');
  const [newProductBrand, setNewProductBrand] = useState('');
  const [newProductCategory, setNewProductCategory] = useState('');
  const [newProductPurchaseDate, setNewProductPurchaseDate] = useState('');
  const [newProductExpiryDate, setNewProductExpiryDate] = useState('');
  const [newProductSize, setNewProductSize] = useState('');
  const [newProductPrice, setNewProductPrice] = useState('');
  const [newProductNotes, setNewProductNotes] = useState('');
  
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
    // In a real app, this would fetch from Firestore
    setProducts(dummyProducts);
    setFilteredProducts(dummyProducts);
  }, []);
  
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
  
  const openAddModal = () => {
    setNewProductName('');
    setNewProductBrand('');
    setNewProductCategory('');
    setNewProductPurchaseDate('');
    setNewProductExpiryDate('');
    setNewProductSize('');
    setNewProductPrice('');
    setNewProductNotes('');
    setShowAddModal(true);
  };
  
  const closeAddModal = () => {
    setShowAddModal(false);
  };
  
  const handleAddProduct = (e) => {
    e.preventDefault();
    
    // In a real app, this would save to Firestore
    const newProduct = {
      id: `product-${Date.now()}`,
      name: newProductName,
      brand: newProductBrand,
      category: newProductCategory,
      userId: userProfile?.uid || 'demo-user',
      purchaseDate: newProductPurchaseDate ? new Date(newProductPurchaseDate).toISOString() : null,
      expiryDate: newProductExpiryDate ? new Date(newProductExpiryDate).toISOString() : null,
      price: newProductPrice ? parseFloat(newProductPrice) : null,
      size: newProductSize,
      notes: newProductNotes,
      imageUrl: 'https://images.pexels.com/photos/3785147/pexels-photo-3785147.jpeg?auto=compress&cs=tinysrgb&w=600', // Default placeholder
      createdAt: new Date().toISOString()
    };
    
    setProducts([...products, newProduct]);
    closeAddModal();
  };
  
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
  
  return (
    <MainLayout>
      <div className="pb-12">
        <header className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-display font-bold text-gray-800 mb-2">
              Product Tracker
            </h1>
            <p className="text-gray-600">
              Keep track of all your skincare products
            </p>
          </div>
          <Button 
            variant="primary"
            icon={<Plus size={18} />}
            onClick={openAddModal}
          >
            Add Product
          </Button>
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
            <p className="text-gray-500 mb-6">Add products to your collection or try a different search.</p>
            <Button 
              variant="primary"
              icon={<Plus size={18} />}
              onClick={openAddModal}
            >
              Add Product
            </Button>
          </Card>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredProducts.map((product) => (
              <Card
                key={product.id}
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
                
                <div className="flex mt-4 pt-4 border-t border-gray-100 justify-between">
                  <Button 
                    variant="ghost" 
                    size="sm"
                  >
                    Details
                  </Button>
                  <Button 
                    variant="outline" 
                    size="sm"
                    icon={<Clock size={16} />}
                  >
                    Log Use
                  </Button>
                </div>
              </Card>
            ))}
          </div>
        )}
      </div>
      
      {/* Add Product Modal */}
      {showAddModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg w-full max-w-2xl p-6 max-h-[90vh] overflow-y-auto animate-fade-in">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-medium text-gray-800">Add New Product</h3>
              <button 
                className="text-gray-500 hover:text-gray-700"
                onClick={closeAddModal}
              >
                <X size={20} />
              </button>
            </div>
            
            <form onSubmit={handleAddProduct}>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1" htmlFor="productName">
                    Product Name*
                  </label>
                  <input
                    type="text"
                    id="productName"
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-lavender-500 focus:border-lavender-500"
                    value={newProductName}
                    onChange={(e) => setNewProductName(e.target.value)}
                    required
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1" htmlFor="brand">
                    Brand*
                  </label>
                  <input
                    type="text"
                    id="brand"
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-lavender-500 focus:border-lavender-500"
                    value={newProductBrand}
                    onChange={(e) => setNewProductBrand(e.target.value)}
                    required
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1" htmlFor="category">
                    Category*
                  </label>
                  <select
                    id="category"
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-lavender-500 focus:border-lavender-500"
                    value={newProductCategory}
                    onChange={(e) => setNewProductCategory(e.target.value)}
                    required
                  >
                    <option value="" disabled>Select a category</option>
                    {categories.map((category) => (
                      <option key={category} value={category}>
                        {category}
                      </option>
                    ))}
                  </select>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1" htmlFor="size">
                    Size
                  </label>
                  <input
                    type="text"
                    id="size"
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-lavender-500 focus:border-lavender-500"
                    value={newProductSize}
                    onChange={(e) => setNewProductSize(e.target.value)}
                    placeholder="e.g., 50ml, 1.7oz"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1" htmlFor="price">
                    Price
                  </label>
                  <input
                    type="number"
                    id="price"
                    step="0.01"
                    min="0"
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-lavender-500 focus:border-lavender-500"
                    value={newProductPrice}
                    onChange={(e) => setNewProductPrice(e.target.value)}
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1" htmlFor="purchaseDate">
                    Purchase Date
                  </label>
                  <input
                    type="date"
                    id="purchaseDate"
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-lavender-500 focus:border-lavender-500"
                    value={newProductPurchaseDate}
                    onChange={(e) => setNewProductPurchaseDate(e.target.value)}
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1" htmlFor="expiryDate">
                    Expiry Date
                  </label>
                  <input
                    type="date"
                    id="expiryDate"
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-lavender-500 focus:border-lavender-500"
                    value={newProductExpiryDate}
                    onChange={(e) => setNewProductExpiryDate(e.target.value)}
                  />
                </div>
              </div>
              
              <div className="mb-6">
                <label className="block text-sm font-medium text-gray-700 mb-1" htmlFor="notes">
                  Notes
                </label>
                <textarea
                  id="notes"
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-lavender-500 focus:border-lavender-500"
                  rows="3"
                  value={newProductNotes}
                  onChange={(e) => setNewProductNotes(e.target.value)}
                  placeholder="Any additional notes about this product..."
                ></textarea>
              </div>
              
              <div className="flex justify-end space-x-3">
                <Button
                  variant="outline"
                  type="button"
                  onClick={closeAddModal}
                >
                  Cancel
                </Button>
                <Button
                  variant="primary"
                  type="submit"
                >
                  Add Product
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}
    </MainLayout>
  );
}

export default ProductTracker;