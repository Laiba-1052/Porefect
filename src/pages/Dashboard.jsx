import React, { useState, useEffect } from 'react';
import { Calendar, Clock, Star, Package, CheckCircle } from 'lucide-react';
import { User, Settings, Droplet } from 'lucide-react';
import MainLayout from '../components/layouts/MainLayout';
import Card from '../components/ui/Card';
import Button from '../components/ui/Button';
import { useAuth } from '../contexts/AuthContext';
import { 
  dummyActivities, 
  dummyRoutines, 
  dummySuggestions, 
  dummyTasks, 
  dummyProducts 
} from '../data/dummyData';

function Dashboard() {
  const { userProfile } = useAuth();
  const [activities, setActivities] = useState([]);
  const [suggestedRoutines, setSuggestedRoutines] = useState([]);
  const [upcomingTasks, setUpcomingTasks] = useState([]);

  useEffect(() => {
    // In a real app, this would fetch from Firestore
    setActivities(dummyActivities);

    // Get suggested routines based on user skin type
    const skinType = userProfile?.skinType || 'combination';
    setSuggestedRoutines(dummySuggestions[skinType] || dummySuggestions['combination']);

    // Get upcoming tasks (would normally filter in Firestore query)
    const today = new Date();
    const upcoming = dummyTasks.filter(task => !task.completed)
      .sort((a, b) => new Date(a.time || '23:59') - new Date(b.time || '23:59'));
    setUpcomingTasks(upcoming.slice(0, 3));
  }, [userProfile]);

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

  return (
    <MainLayout>
      <div className="pb-12">
        <header className="mb-8">
          <h1 className="text-3xl font-display font-bold text-gray-800 mb-2">
            Welcome, {userProfile?.username || 'there'}!
          </h1>
          <p className="text-gray-600">
            Here's an overview of your skincare journey
          </p>
        </header>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Activity Section */}
          <div className="md:col-span-2">
            <Card 
              title="Recent Activity" 
              className="h-full"
            >
              {activities.length === 0 ? (
                <p className="text-gray-500 italic">No recent activities found.</p>
              ) : (
                <div className="space-y-4">
                  {activities.slice(0, 5).map((activity) => (
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
                  onClick={() => {/* Navigate to tasks */}}
                >
                  View All
                </Button>
              }
              className="h-full"
            >
              {upcomingTasks.length === 0 ? (
                <p className="text-gray-500 italic">No tasks scheduled for today.</p>
              ) : (
                <div className="space-y-3">
                  {upcomingTasks.map((task) => (
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
                          {task.time && <span className="ml-2">{task.time}</span>}
                        </div>
                      </div>
                      <button 
                        className={`h-5 w-5 rounded-full border ${
                          task.completed 
                            ? 'bg-mint-500 border-mint-500' 
                            : 'bg-white border-gray-300 hover:border-lavender-400'
                        } flex items-center justify-center transition-colors`}
                        onClick={() => {/* Toggle completion */}}
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
                  <p className="text-2xl font-semibold">{dummyRoutines.length}</p>
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
                  <p className="text-2xl font-semibold">{dummyProducts.length}</p>
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
                  <p className="text-2xl font-semibold">{dummyTasks.length}</p>
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
                  <p className="text-2xl font-semibold">
                    {dummyTasks.filter(t => t.completed).length}
                  </p>
                </div>
              </div>
            </div>
          </Card>
        </div>
        
        {/* Suggested Routines */}
        <div className="mt-8">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-display font-semibold text-gray-800">
              Suggested for Your {userProfile?.skinType || 'Combination'} Skin
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
                  <Button variant="outline" fullWidth>
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