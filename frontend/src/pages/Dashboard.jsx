import React, { useState, useEffect } from 'react';
import { Calendar, Clock, Star, Package, CheckCircle } from 'lucide-react';
import { User, Settings, Droplet } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import MainLayout from '../components/layouts/MainLayout';
import Card from '../components/ui/Card';
import Button from '../components/ui/Button';
import Toast from '../components/ui/Toast';
import { useAuth } from '../contexts/AuthContext';
import { api } from '../utils/api';
import { dummySuggestions } from '../data/dummyData';

function Dashboard() {
  const { currentUser } = useAuth();
  const navigate = useNavigate();
  const [dashboardData, setDashboardData] = useState({
    activities: [],
    upcomingTasks: [],
    routinesCount: 0,
    productsCount: 0,
    tasksCount: 0,
    completedCount: 0
  });
  const [suggestedRoutines, setSuggestedRoutines] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [toast, setToast] = useState(null);

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        setLoading(true);
        setError(null);

        // For demo purposes, use demo-user-123
        const userId = 'demo-user-123';
        
        // Fetch dashboard data using the new endpoint
        const response = await api.getDashboard(userId);
        setDashboardData(response);

        // Get suggested routines based on user skin type
        const skinType = currentUser?.skinType || 'combination';
        setSuggestedRoutines(dummySuggestions[skinType] || dummySuggestions['combination']);
      } catch (err) {
        console.error('Error fetching dashboard data:', err);
        setError(err.message || 'Failed to load dashboard data');
      } finally {
        setLoading(false);
      }
    };

    fetchDashboardData();
  }, [currentUser?.skinType]);

  const handleAddSuggestedRoutine = async (routine) => {
    try {
      await api.addSuggestedRoutine({
        userId: 'demo-user-123', // For demo purposes
        routineName: routine.name,
        steps: routine.steps
      });

      // Refresh dashboard data after adding routine
      const updatedDashboard = await api.getDashboard('demo-user-123');
      setDashboardData(updatedDashboard);

      // Show success toast
      setToast({
        type: 'success',
        message: `${routine.name} has been added to your routines!`
      });
    } catch (err) {
      console.error('Error adding routine:', err);
      // Show error toast
      setToast({
        type: 'error',
        message: 'Failed to add routine. Please try again.'
      });
    }
  };

  const handleViewAllTasks = () => {
    navigate('/tasks', { state: { showToday: true } });
  };

  const handleToggleTaskCompletion = async (taskId, currentStatus) => {
    try {
      await api.toggleTaskCompletion({
        taskId,
        userId: 'demo-user-123', // For demo purposes
        completed: !currentStatus
      });

      // Refresh dashboard data after toggling task
      const updatedDashboard = await api.getDashboard('demo-user-123');
      setDashboardData(updatedDashboard);
    } catch (err) {
      console.error('Error toggling task:', err);
      // Show error toast
      setToast({
        type: 'error',
        message: 'Failed to update task. Please try again.'
      });
    }
  };

  function formatActivityText(activity) {
    switch (activity.type) {
      case 'routine_completed':
        return `Completed ${activity.routineName}`;
      case 'product_added':
        return `Added ${activity.productName} to your collection`;
      case 'review_added':
        return `Reviewed ${activity.productName}`;
      default:
        return 'Activity logged';
    }
  }

  function formatTimeAgo(timestamp) {
    const now = new Date();
    const activityTime = new Date(timestamp);
    const diffInHours = Math.floor((now - activityTime) / (1000 * 60 * 60));
    
    if (diffInHours < 1) {
      return 'Just now';
    } else if (diffInHours < 24) {
      return `${diffInHours} hour${diffInHours > 1 ? 's' : ''} ago`;
    } else {
      const diffInDays = Math.floor(diffInHours / 24);
      return `${diffInDays} day${diffInDays > 1 ? 's' : ''} ago`;
    }
  }

  if (loading) {
    return (
      <MainLayout>
        <div className="flex items-center justify-center h-screen">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-lavender-600 mx-auto mb-4"></div>
            <p className="text-gray-600">Loading dashboard...</p>
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
            <p className="text-gray-800 font-medium mb-2">Error loading dashboard</p>
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
        <header className="flex items-center justify-between mb-8 mt-8">
          <div>
            <h1 className="text-3xl font-display font-bold text-gray-800 mb-2">
              Dashboard
            </h1>
            <p className="text-gray-600">
              Here's an overview of your skincare journey
            </p>
          </div>
        </header>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Activity Section */}
          <div className="md:col-span-2">
            <Card 
              title="Recent Activity" 
              className="h-full"
            >
              {dashboardData.activities.length === 0 ? (
                <p className="text-gray-500 italic">No recent activities found.</p>
              ) : (
                <div className="space-y-4">
                  {dashboardData.activities.map((activity) => (
                    <div key={activity.id} className="flex items-start pb-4 border-b border-gray-100 last:border-0">
                      <div className="h-10 w-10 rounded-full bg-lavender-100 flex items-center justify-center flex-shrink-0">
                        {activity.type === 'routine_completed' && (
                          <CheckCircle size={20} className="text-lavender-500" />
                        )}
                        {activity.type === 'product_added' && (
                          <Package size={20} className="text-lavender-500" />
                        )}
                        {activity.type === 'review_added' && (
                          <Star size={20} className="text-lavender-500" />
                        )}
                      </div>
                      <div className="ml-4">
                        <p className="text-gray-800 font-medium">{formatActivityText(activity)}</p>
                        <p className="text-sm text-gray-500">{formatTimeAgo(activity.timestamp)}</p>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </Card>
          </div>

          {/* Upcoming Tasks Section */}
          <div>
            <Card 
              title="Today's Tasks" 
              headerAction={
                <Button 
                  variant="outline" 
                  size="sm"
                  onClick={handleViewAllTasks}
                >
                  View All
                </Button>
              }
              className="h-full"
            >
              {dashboardData.upcomingTasks.length === 0 ? (
                <p className="text-gray-500 italic">No tasks scheduled for today.</p>
              ) : (
                <div className="space-y-3">
                  {dashboardData.upcomingTasks.map((task) => (
                    <div 
                      key={task.id} 
                      className="flex items-center p-3 border border-gray-100 rounded-lg hover:bg-lavender-50 transition-colors"
                    >
                      <div className="mr-3 text-lavender-500">
                        <Clock size={18} />
                      </div>
                      <div className="flex-1">
                        <p className="font-medium text-gray-800">{task.title}</p>
                        <div className="flex items-center text-xs text-gray-500">
                          <Calendar size={14} className="mr-1" />
                          <span>{task.schedule === 'daily' ? 'Daily' : 'Weekly'}</span>
                          {task.time && (
                            <span className="ml-2">at {task.time}</span>
                          )}
                        </div>
                      </div>
                      <button 
                        className={`h-5 w-5 rounded-full border ${
                          task.completed 
                            ? 'bg-mint-500 border-mint-500' 
                            : 'bg-white border-gray-300 hover:border-lavender-400'
                        } flex items-center justify-center transition-colors`}
                        onClick={() => handleToggleTaskCompletion(task.id, task.completed)}
                      >
                        {task.completed && <CheckCircle size={14} className="text-white" />}
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </Card>
          </div>
        </div>
        
        {/* Quick Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 my-6">
          <Card className="p-0">
            <div className="p-4">
              <div className="flex items-start">
                <div className="p-2 rounded-md bg-lavender-100">
                  <Droplet size={20} className="text-lavender-500" />
                </div>
                <div className="ml-3">
                  <p className="text-sm text-gray-500">Routines</p>
                  <p className="text-2xl font-semibold">{dashboardData.routinesCount}</p>
                </div>
              </div>
            </div>
          </Card>
          
          <Card className="p-0">
            <div className="p-4">
              <div className="flex items-start">
                <div className="p-2 rounded-md bg-mint-100">
                  <Package size={20} className="text-mint-500" />
                </div>
                <div className="ml-3">
                  <p className="text-sm text-gray-500">Products</p>
                  <p className="text-2xl font-semibold">{dashboardData.productsCount}</p>
                </div>
              </div>
            </div>
          </Card>
          
          <Card className="p-0">
            <div className="p-4">
              <div className="flex items-start">
                <div className="p-2 rounded-md bg-rose-100">
                  <Calendar size={20} className="text-rose-500" />
                </div>
                <div className="ml-3">
                  <p className="text-sm text-gray-500">Tasks</p>
                  <p className="text-2xl font-semibold">{dashboardData.tasksCount}</p>
                </div>
              </div>
            </div>
          </Card>
          
          <Card className="p-0">
            <div className="p-4">
              <div className="flex items-start">
                <div className="p-2 rounded-md bg-yellow-100">
                  <CheckCircle size={20} className="text-yellow-500" />
                </div>
                <div className="ml-3">
                  <p className="text-sm text-gray-500">Completed</p>
                  <p className="text-2xl font-semibold">{dashboardData.completedCount}</p>
                </div>
              </div>
            </div>
          </Card>
        </div>
        
        {/* Suggested Routines */}
        <div className="mt-8">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-display font-semibold text-gray-800">
              Suggested for Your {currentUser?.skinType || 'Combination'} Skin
            </h2>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {suggestedRoutines.map((routine, index) => (
              <Card
                key={index}
                title={routine.name}
                subtitle={routine.description}
                className="h-full"
                hoverable
              >
                <div className="space-y-3 mt-2">
                  {routine.steps.slice(0, 3).map((step, idx) => (
                    <div key={idx} className="flex items-start">
                      <div className="flex-shrink-0 h-6 w-6 rounded-full bg-lavender-100 flex items-center justify-center mt-0.5">
                        <span className="text-xs font-medium text-lavender-700">{idx + 1}</span>
                      </div>
                      <div className="ml-3">
                        <p className="text-sm font-medium text-gray-800">{step.name}</p>
                        <p className="text-xs text-gray-500">{step.description}</p>
                      </div>
                    </div>
                  ))}
                  {routine.steps.length > 3 && (
                    <p className="text-sm text-lavender-600 font-medium mt-2">
                      + {routine.steps.length - 3} more steps
                    </p>
                  )}
                </div>
                
                <div className="mt-4">
                  <Button 
                    variant="outline" 
                    fullWidth
                    onClick={() => handleAddSuggestedRoutine(routine)}
                  >
                    Add to My Routines
                  </Button>
                </div>
              </Card>
            ))}
          </div>
        </div>
      </div>
    </MainLayout>
  );
}

export default Dashboard;