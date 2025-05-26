import React, { useState, useEffect } from 'react';
import { Plus, Trash2, Pencil, Sun, Moon, Clock, X, CheckCircle2 } from 'lucide-react';
import MainLayout from '../components/layouts/MainLayout';
import Card from '../components/ui/Card';
import Button from '../components/ui/Button';
import Toast from '../components/ui/Toast';
import { useAuth } from '../contexts/AuthContext';
import { api } from '../utils/api';

function RoutineLogger() {
  const { currentUser } = useAuth();
  const [routines, setRoutines] = useState([]);
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showAddModal, setShowAddModal] = useState(false);
  const [showAddStepModal, setShowAddStepModal] = useState(false);
  const [currentRoutine, setCurrentRoutine] = useState(null);
  const [toast, setToast] = useState(null);
  
  // Form states
  const [newRoutineName, setNewRoutineName] = useState('');
  const [newRoutineTimeOfDay, setNewRoutineTimeOfDay] = useState('morning');
  const [newStepName, setNewStepName] = useState('');
  const [newStepProduct, setNewStepProduct] = useState('');
  const [newStepNotes, setNewStepNotes] = useState('');
  
  // Fetch routines and products
  useEffect(() => {
    const fetchData = async () => {
      try {
        console.log('Starting to fetch data...');
        console.log('Current user:', currentUser?.email);
        console.log('Current user ID:', currentUser?.uid);
        setLoading(true);
        setError(null);
        
        // For testing, use the demo user ID since that's what's in our database
        const testUserId = 'demo-user-123';
        console.log('Using test user ID:', testUserId);
        
        // Fetch both routines and products
        console.log('Fetching routines and products...');
        const [routinesData, productsData] = await Promise.all([
          api.getRoutines(testUserId),
          api.getProducts(testUserId)
        ]);
        
        console.log('Fetched routines:', routinesData);
        console.log('Fetched products:', productsData);
        
        setRoutines(routinesData);
        setProducts(productsData);
      } catch (err) {
        console.error('Error details:', {
          message: err.message,
          stack: err.stack,
          response: err.response?.data
        });
        setError(err.message || 'Failed to fetch data');
      } finally {
        setLoading(false);
      }
    };

    // For development, always fetch data regardless of user authentication
    fetchData();
  }, []);
  
  const openAddModal = () => {
    setNewRoutineName('');
    setNewRoutineTimeOfDay('morning');
    setShowAddModal(true);
  };
  
  const closeAddModal = () => {
    setShowAddModal(false);
  };
  
  const openAddStepModal = (routine) => {
    setCurrentRoutine(routine);
    setNewStepName('');
    setNewStepProduct('');
    setNewStepNotes('');
    setShowAddStepModal(true);
  };
  
  const closeAddStepModal = () => {
    setShowAddStepModal(false);
  };
  
  const handleAddRoutine = async (e) => {
    e.preventDefault();
    
    try {
      const newRoutine = {
        name: newRoutineName,
        schedule: newRoutineTimeOfDay,
        userId: currentUser?.uid,
        products: [],
        isActive: true
      };
      
      const createdRoutine = await api.createRoutine(newRoutine);
      setRoutines([...routines, createdRoutine]);
      closeAddModal();
    } catch (err) {
      console.error('Error creating routine:', err);
      setError('Failed to create routine: ' + err.message);
    }
  };
  
  const handleAddStep = async (e) => {
    e.preventDefault();
    
    if (!currentRoutine) return;
    
    try {
      console.log('Adding step with product:', newStepProduct);
      const selectedProduct = products.find(p => p._id === newStepProduct);
      console.log('Selected product:', selectedProduct);
      
      const updatedProducts = [...currentRoutine.products, {
        name: selectedProduct ? selectedProduct.name : newStepName,
        category: selectedProduct ? selectedProduct.category : '',
        frequency: 'daily', // default frequency
        notes: newStepNotes,
        productId: selectedProduct ? selectedProduct._id : null // Store the reference to the product
      }];
      
      const updatedRoutine = await api.updateRoutine(currentRoutine._id, {
        ...currentRoutine,
        products: updatedProducts,
        userId: 'demo-user-123' // For testing, use the demo user ID
      });
      
      setRoutines(routines.map(routine => 
        routine._id === currentRoutine._id ? updatedRoutine : routine
      ));
      
      closeAddStepModal();
    } catch (err) {
      console.error('Error adding step:', err);
      setError('Failed to add step: ' + err.message);
    }
  };
  
  const handleCompleteRoutine = async (routineId) => {
    try {
      const routineToUpdate = routines.find(r => r._id === routineId);
      if (!routineToUpdate) return;

      const updatedRoutine = await api.updateRoutine(routineId, {
        ...routineToUpdate,
        lastCompleted: new Date().toISOString(),
        userId: currentUser?.uid
      });
      
      setRoutines(routines.map(routine => 
        routine._id === routineId ? updatedRoutine : routine
      ));

      // Show success toast
      setToast({
        type: 'success',
        message: `${routineToUpdate.name} has been completed!`
      });
    } catch (err) {
      console.error('Error completing routine:', err);
      setToast({
        type: 'error',
        message: 'Failed to complete routine: ' + err.message
      });
    }
  };
  
  // Helper function to check if routine was completed today
  const wasCompletedToday = (routine) => {
    if (!routine.lastCompleted) return false;
    const lastCompleted = new Date(routine.lastCompleted);
    const today = new Date();
    return lastCompleted.toDateString() === today.toDateString();
  };
  
  const getRoutineIcon = (schedule) => {
    switch (schedule) {
      case 'morning':
        return <Sun size={20} />;
      case 'evening':
        return <Moon size={20} />;
      default:
        return <Clock size={20} />;
    }
  };
  
  const getProductById = (productId) => {
    return products.find(product => product._id === productId);
  };

  if (loading) {
    return (
      <MainLayout>
        <div className="flex items-center justify-center h-screen">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-lavender-600 mx-auto mb-4"></div>
            <p className="text-gray-600">Loading routines...</p>
          </div>
        </div>
      </MainLayout>
    );
  }

  if (error) {
    return (
      <MainLayout>
        <div className="flex items-center justify-center h-screen">
          <div className="text-center">
            <div className="text-red-600 mb-4">⚠️</div>
            <p className="text-gray-800 font-medium mb-2">Error loading routines</p>
            <p className="text-gray-600">{error}</p>
          </div>
        </div>
      </MainLayout>
    );
  }
  
  return (
    <MainLayout>
      {toast && (
        <Toast
          type={toast.type}
          message={toast.message}
          onClose={() => setToast(null)}
        />
      )}
      <div className="pb-12">
        <header className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-display font-bold text-gray-800 mb-2">
              Skincare Routines
            </h1>
            <p className="text-gray-600">
              Manage and track your skincare routines
            </p>
          </div>
          <Button 
            variant="primary"
            icon={<Plus size={18} />}
            onClick={openAddModal}
          >
            Add Routine
          </Button>
        </header>
        
        {routines.length === 0 ? (
          <Card className="p-8 text-center">
            <h3 className="text-lg font-medium text-gray-700 mb-2">No routines yet</h3>
            <p className="text-gray-500 mb-6">Create your first skincare routine to get started.</p>
            <Button 
              variant="primary"
              icon={<Plus size={18} />}
              onClick={openAddModal}
            >
              Create Routine
            </Button>
          </Card>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {routines.map((routine) => (
              <Card
                key={routine._id}
                title={routine.name}
                subtitle={routine.lastCompleted ? `Last completed: ${new Date(routine.lastCompleted).toLocaleDateString()}` : 'Not completed yet'}
                headerAction={
                  <div className="flex items-center space-x-2">
                    <span className={`p-1.5 rounded-full 
                      ${routine.schedule === 'morning' ? 'bg-yellow-100 text-yellow-600' : 
                        routine.schedule === 'evening' ? 'bg-indigo-100 text-indigo-600' : 
                        'bg-gray-100 text-gray-600'}`}
                    >
                      {getRoutineIcon(routine.schedule)}
                    </span>
                  </div>
                }
              >
                <div className="space-y-3">
                  {routine.products.length === 0 ? (
                    <p className="text-gray-500 text-center py-4">No steps added yet</p>
                  ) : (
                    routine.products.map((product, index) => (
                      <div 
                        key={index}
                        className="flex items-start p-3 bg-gray-50 rounded-md"
                      >
                        <div className="flex-shrink-0 w-6 h-6 bg-lavender-100 rounded-full flex items-center justify-center mr-3 mt-0.5">
                          <span className="text-xs font-medium text-lavender-700">{index + 1}</span>
                        </div>
                        <div className="flex-1">
                          <h4 className="font-medium text-gray-800">{product.name}</h4>
                          {product.category && (
                            <p className="text-sm text-gray-600">{product.category}</p>
                          )}
                          {product.notes && (
                            <p className="text-xs text-gray-500 mt-1">{product.notes}</p>
                          )}
                        </div>
                      </div>
                    ))
                  )}
                </div>
                
                <div className="flex mt-5 space-x-3">
                  <Button 
                    variant="outline" 
                    size="sm"
                    icon={<Plus size={16} />}
                    onClick={() => openAddStepModal(routine)}
                    fullWidth
                  >
                    Add Step
                  </Button>
                  <Button 
                    variant={wasCompletedToday(routine) ? "success" : "primary"}
                    size="sm"
                    icon={<CheckCircle2 size={16} />}
                    onClick={() => handleCompleteRoutine(routine._id)}
                    fullWidth
                  >
                    {wasCompletedToday(routine) ? "Complete Again" : "Complete"}
                  </Button>
                </div>
              </Card>
            ))}
          </div>
        )}
      </div>
      
      {/* Add Routine Modal */}
      {showAddModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg w-full max-w-md p-6 animate-fade-in">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-medium text-gray-800">Add New Routine</h3>
              <button 
                className="text-gray-500 hover:text-gray-700"
                onClick={closeAddModal}
              >
                <X size={20} />
              </button>
            </div>
            
            <form onSubmit={handleAddRoutine}>
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-1" htmlFor="routineName">
                  Routine Name
                </label>
                <input
                  type="text"
                  id="routineName"
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-lavender-500 focus:border-lavender-500"
                  value={newRoutineName}
                  onChange={(e) => setNewRoutineName(e.target.value)}
                  placeholder="e.g., Morning Routine"
                  required
                />
              </div>
              
              <div className="mb-6">
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Time of Day
                </label>
                <div className="grid grid-cols-3 gap-3">
                  <label className={`flex items-center justify-center p-3 rounded-md border ${newRoutineTimeOfDay === 'morning' ? 'bg-lavender-100 border-lavender-300' : 'border-gray-300 hover:bg-gray-50'} cursor-pointer`}>
                    <input
                      type="radio"
                      name="timeOfDay"
                      value="morning"
                      checked={newRoutineTimeOfDay === 'morning'}
                      onChange={() => setNewRoutineTimeOfDay('morning')}
                      className="sr-only"
                    />
                    <Sun size={20} className={newRoutineTimeOfDay === 'morning' ? 'text-lavender-600' : 'text-gray-500'} />
                    <span className={`ml-2 ${newRoutineTimeOfDay === 'morning' ? 'text-lavender-700' : 'text-gray-700'}`}>
                      Morning
                    </span>
                  </label>
                  
                  <label className={`flex items-center justify-center p-3 rounded-md border ${newRoutineTimeOfDay === 'evening' ? 'bg-lavender-100 border-lavender-300' : 'border-gray-300 hover:bg-gray-50'} cursor-pointer`}>
                    <input
                      type="radio"
                      name="timeOfDay"
                      value="evening"
                      checked={newRoutineTimeOfDay === 'evening'}
                      onChange={() => setNewRoutineTimeOfDay('evening')}
                      className="sr-only"
                    />
                    <Moon size={20} className={newRoutineTimeOfDay === 'evening' ? 'text-lavender-600' : 'text-gray-500'} />
                    <span className={`ml-2 ${newRoutineTimeOfDay === 'evening' ? 'text-lavender-700' : 'text-gray-700'}`}>
                      Evening
                    </span>
                  </label>
                  
                  <label className={`flex items-center justify-center p-3 rounded-md border ${newRoutineTimeOfDay === 'both' ? 'bg-lavender-100 border-lavender-300' : 'border-gray-300 hover:bg-gray-50'} cursor-pointer`}>
                    <input
                      type="radio"
                      name="timeOfDay"
                      value="both"
                      checked={newRoutineTimeOfDay === 'both'}
                      onChange={() => setNewRoutineTimeOfDay('both')}
                      className="sr-only"
                    />
                    <Clock size={20} className={newRoutineTimeOfDay === 'both' ? 'text-lavender-600' : 'text-gray-500'} />
                    <span className={`ml-2 ${newRoutineTimeOfDay === 'both' ? 'text-lavender-700' : 'text-gray-700'}`}>
                      Both
                    </span>
                  </label>
                </div>
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
                  Create Routine
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}
      
      {/* Add Step Modal */}
      {showAddStepModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg w-full max-w-md p-6 animate-fade-in">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-medium text-gray-800">
                Add Step to {currentRoutine?.name}
              </h3>
              <button 
                className="text-gray-500 hover:text-gray-700"
                onClick={closeAddStepModal}
              >
                <X size={20} />
              </button>
            </div>
            
            <form onSubmit={handleAddStep}>
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-1" htmlFor="productSelect">
                  Select Product
                </label>
                <select
                  id="productSelect"
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-lavender-500 focus:border-lavender-500"
                  value={newStepProduct}
                  onChange={(e) => {
                    console.log('Selected product ID:', e.target.value);
                    setNewStepProduct(e.target.value);
                    if (e.target.value) {
                      const product = products.find(p => p._id === e.target.value);
                      setNewStepName(product?.name || '');
                    }
                  }}
                >
                  <option value="">Select a product</option>
                  {products.map(product => (
                    <option key={product._id} value={product._id}>
                      {product.name} ({product.category})
                    </option>
                  ))}
                </select>
              </div>

              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-1" htmlFor="stepName">
                  Step Name {!newStepProduct && '(Required if no product selected)'}
                </label>
                <input
                  type="text"
                  id="stepName"
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-lavender-500 focus:border-lavender-500"
                  value={newStepName}
                  onChange={(e) => setNewStepName(e.target.value)}
                  placeholder="e.g., Cleanser, Toner, Serum, etc."
                  required={!newStepProduct}
                />
              </div>
              
              <div className="mb-6">
                <label className="block text-sm font-medium text-gray-700 mb-1" htmlFor="notes">
                  Notes (Optional)
                </label>
                <textarea
                  id="notes"
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-lavender-500 focus:border-lavender-500"
                  value={newStepNotes}
                  onChange={(e) => setNewStepNotes(e.target.value)}
                  placeholder="Any special instructions or notes..."
                  rows={3}
                ></textarea>
              </div>
              
              <div className="flex justify-end space-x-3">
                <Button
                  variant="outline"
                  type="button"
                  onClick={closeAddStepModal}
                >
                  Cancel
                </Button>
                <Button
                  variant="primary"
                  type="submit"
                  disabled={!newStepProduct && !newStepName}
                >
                  Add Step
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}
    </MainLayout>
  );
}

export default RoutineLogger;