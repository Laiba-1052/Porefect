import React, { useState, useEffect } from 'react';
import { format, addDays, subDays, isToday } from 'date-fns';
import { ChevronLeft, ChevronRight, CheckCircle, Circle, AlertCircle } from 'lucide-react';
import MainLayout from '../components/layouts/MainLayout';
import Card from '../components/ui/Card';
import Button from '../components/ui/Button';
import { useAuth } from '../contexts/AuthContext';
import taskService from '../services/taskService';

function Tasks() {
  const { userProfile } = useAuth();
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [tasks, setTasks] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchTasks = async () => {
      try {
        setIsLoading(true);
        setError(null);
        const userId = userProfile?.uid || 'demo-user-123';
        const data = await taskService.getTasksForDay(userId, selectedDate);
        setTasks(data);
      } catch (err) {
        console.error('Error fetching tasks:', err);
        setError('Failed to load tasks. Please try again later.');
      } finally {
        setIsLoading(false);
      }
    };

    fetchTasks();
  }, [selectedDate, userProfile]);

  const handlePreviousDay = () => {
    setSelectedDate(prev => subDays(prev, 1));
  };

  const handleNextDay = () => {
    setSelectedDate(prev => addDays(prev, 1));
  };

  const handleToggleTask = async (taskId, currentStatus) => {
    try {
      const userId = userProfile?.uid || 'demo-user-123';
      
      if (currentStatus) {
        await taskService.uncompleteTask(taskId, userId);
      } else {
        await taskService.completeTask(taskId, userId);
      }

      // Refresh tasks
      const updatedTasks = await taskService.getTasksForDay(userId, selectedDate);
      setTasks(updatedTasks);
    } catch (err) {
      console.error('Error toggling task:', err);
      // Show error toast or notification here
    }
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
        {/* Date Navigation */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-display font-bold text-gray-800 mb-2">
              Tasks
            </h1>
            <p className="text-gray-600">
              Your skincare tasks and routines for the day
            </p>
          </div>
          <div className="flex items-center space-x-4">
            <Button
              variant="outline"
              onClick={handlePreviousDay}
              icon={<ChevronLeft size={18} />}
            >
              Previous
            </Button>
            <div className="text-center">
              <div className="text-lg font-medium text-gray-800">
                {format(selectedDate, 'EEEE')}
              </div>
              <div className="text-sm text-gray-600">
                {format(selectedDate, 'MMM d, yyyy')}
              </div>
            </div>
            <Button
              variant="outline"
              onClick={handleNextDay}
              icon={<ChevronRight size={18} />}
            >
              Next
            </Button>
          </div>
        </div>

        {/* Tasks List */}
        {tasks.length === 0 ? (
          <Card className="p-8 text-center">
            <h3 className="text-lg font-medium text-gray-700 mb-2">No tasks for this day</h3>
            <p className="text-gray-500">Take some time to relax!</p>
          </Card>
        ) : (
          <div className="space-y-4">
            {tasks.map((task) => (
              <Card
                key={task._id}
                className={`p-4 transition-all ${
                  task.completed ? 'bg-gray-50' : 'hover:shadow-md'
                }`}
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-4">
                    <button
                      onClick={() => handleToggleTask(task._id, task.completed)}
                      className="text-lavender-500 hover:text-lavender-600 transition-colors"
                    >
                      {task.completed ? (
                        <CheckCircle className="h-6 w-6 fill-current" />
                      ) : (
                        <Circle className="h-6 w-6" />
                      )}
                    </button>
                    <div>
                      <h3 className={`font-medium ${
                        task.completed ? 'text-gray-500 line-through' : 'text-gray-800'
                      }`}>
                        {task.title}
                      </h3>
                      <div className="flex items-center space-x-3 mt-1">
                        {task.type === 'routine' && (
                          <span className="text-xs font-medium text-lavender-500 bg-lavender-50 px-2 py-1 rounded">
                            Routine
                          </span>
                        )}
                        {task.time && (
                          <span className="text-xs text-gray-500">
                            {task.time}
                          </span>
                        )}
                        {task.schedule && (
                          <span className="text-xs text-gray-500">
                            {task.schedule}
                          </span>
                        )}
                      </div>
                    </div>
                  </div>
                  
                  {task.type === 'routine' && task.steps && (
                    <div className="text-sm text-gray-500">
                      {task.steps.length} steps
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

export default Tasks; 