import React, { useState, useEffect } from 'react';
import { Plus, Trash2, Pencil, Sun, Moon, Clock, X, CheckCircle2 } from 'lucide-react';
import MainLayout from '../components/layouts/MainLayout';
import Card from '../components/ui/Card';
import Button from '../components/ui/Button';
import { useAuth } from '../contexts/AuthContext';
import { dummyRoutines, dummyProducts } from '../data/dummyData';

function RoutineLogger() {
  const { userProfile } = useAuth();
  const [routines, setRoutines] = useState([]);
  const [showAddModal, setShowAddModal] = useState(false);
  const [showAddStepModal, setShowAddStepModal] = useState(false);
  const [currentRoutine, setCurrentRoutine] = useState(null);
  
  // Form states
  const [newRoutineName, setNewRoutineName] = useState('');
  const [newRoutineTimeOfDay, setNewRoutineTimeOfDay] = useState('morning');
  const [newStepName, setNewStepName] = useState('');
  const [newStepProduct, setNewStepProduct] = useState('');
  const [newStepNotes, setNewStepNotes] = useState('');
  
  useEffect(() => {
    // In a real app, this would fetch from Firestore
    setRoutines(dummyRoutines);
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
  
  const handleAddRoutine = (e) => {
    e.preventDefault();
    
    // In a real app, this would save to Firestore
    const newRoutine = {
      id: `routine-${Date.now()}`,
      name: newRoutineName,
      timeOfDay: newRoutineTimeOfDay,
      userId: userProfile?.uid || 'demo-user',
      createdAt: new Date().toISOString(),
      steps: []
    };
    
    setRoutines([...routines, newRoutine]);
    closeAddModal();
  };
  
  const handleAddStep = (e) => {
    e.preventDefault();
    
    if (!currentRoutine) return;
    
    // In a real app, this would save to Firestore
    const newStep = {
      id: `step-${Date.now()}`,
      order: currentRoutine.steps.length + 1,
      name: newStepName,
      productId: newStepProduct,
      notes: newStepNotes
    };
    
    const updatedRoutines = routines.map(routine => {
      if (routine.id === currentRoutine.id) {
        return {
          ...routine,
          steps: [...routine.steps, newStep]
        };
      }
      return routine;
    });
    
    setRoutines(updatedRoutines);
    closeAddStepModal();
  };
  
  const handleCompleteRoutine = (routineId) => {
    // In a real app, this would save to Firestore
    const updatedRoutines = routines.map(routine => {
      if (routine.id === routineId) {
        return {
          ...routine,
          lastPerformed: new Date().toISOString()
        };
      }
      return routine;
    });
    
    setRoutines(updatedRoutines);
  };
  
  const getRoutineIcon = (timeOfDay) => {
    switch (timeOfDay) {
      case 'morning':
        return <Sun size={20} />;
      case 'evening':
        return <Moon size={20} />;
      default:
        return <Clock size={20} />;
    }
  };
  
  const getProductById = (productId) => {
    return dummyProducts.find(product => product.id === productId);
  };
  
  return (
    <MainLayout>
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
                key={routine.id}
                title={routine.name}
                subtitle={routine.lastPerformed ? `Last completed: ${new Date(routine.lastPerformed).toLocaleDateString()}` : 'Not completed yet'}
                headerAction={
                  <div className="flex items-center space-x-2">
                    <span className={`p-1.5 rounded-full 
                      ${routine.timeOfDay === 'morning' ? 'bg-yellow-100 text-yellow-600' : 
                        routine.timeOfDay === 'evening' ? 'bg-indigo-100 text-indigo-600' : 
                        'bg-gray-100 text-gray-600'}`}
                    >
                      {getRoutineIcon(routine.timeOfDay)}
                    </span>
                  </div>
                }
              >
                <div className="space-y-3">
                  {routine.steps.length === 0 ? (
                    <p className="text-gray-500 text-center py-4">No steps added yet</p>
                  ) : (
                    routine.steps.map((step, index) => (
                      <div 
                        key={step.id}
                        className="flex items-start p-3 bg-gray-50 rounded-md"
                      >
                        <div className="flex-shrink-0 w-6 h-6 bg-lavender-100 rounded-full flex items-center justify-center mr-3 mt-0.5">
                          <span className="text-xs font-medium text-lavender-700">{step.order}</span>
                        </div>
                        <div className="flex-1">
                          <h4 className="font-medium text-gray-800">{step.name}</h4>
                          {step.productId && (
                            <p className="text-sm text-gray-600">
                              {getProductById(step.productId)?.name || 'Unknown Product'}
                            </p>
                          )}
                          {step.notes && (
                            <p className="text-xs text-gray-500 mt-1">{step.notes}</p>
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
                    variant="primary" 
                    size="sm"
                    icon={<CheckCircle2 size={16} />}
                    onClick={() => handleCompleteRoutine(routine.id)}
                    fullWidth
                  >
                    Complete
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
                  
                  <label className={`flex items-center justify-center p-3 rounded-md border ${newRoutineTimeOfDay === 'custom' ? 'bg-lavender-100 border-lavender-300' : 'border-gray-300 hover:bg-gray-50'} cursor-pointer`}>
                    <input
                      type="radio"
                      name="timeOfDay"
                      value="custom"
                      checked={newRoutineTimeOfDay === 'custom'}
                      onChange={() => setNewRoutineTimeOfDay('custom')}
                      className="sr-only"
                    />
                    <Clock size={20} className={newRoutineTimeOfDay === 'custom' ? 'text-lavender-600' : 'text-gray-500'} />
                    <span className={`ml-2 ${newRoutineTimeOfDay === 'custom' ? 'text-lavender-700' : 'text-gray-700'}`}>
                      Custom
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
                <label className="block text-sm font-medium text-gray-700 mb-1" htmlFor="stepName">
                  Step Name
                </label>
                <input
                  type="text"
                  id="stepName"
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-lavender-500 focus:border-lavender-500"
                  value={newStepName}
                  onChange={(e) => setNewStepName(e.target.value)}
                  placeholder="e.g., Cleanser, Toner, Serum, etc."
                  required
                />
              </div>
              
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-1" htmlFor="productSelect">
                  Product (Optional)
                </label>
                <select
                  id="productSelect"
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-lavender-500 focus:border-lavender-500"
                  value={newStepProduct}
                  onChange={(e) => setNewStepProduct(e.target.value)}
                >
                  <option value="">Select a product</option>
                  {dummyProducts.map(product => (
                    <option key={product.id} value={product.id}>
                      {product.name}
                    </option>
                  ))}
                </select>
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