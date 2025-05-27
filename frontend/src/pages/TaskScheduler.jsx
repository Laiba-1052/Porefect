import React, { useState, useEffect } from 'react';
import { Plus, X, Clock, Repeat, Calendar as CalendarIcon, Grid, List, CheckCircle2, AlertCircle } from 'lucide-react';
import { useLocation } from 'react-router-dom';
import axios from 'axios';
import MainLayout from '../components/layouts/MainLayout';
import Card from '../components/ui/Card';
import Button from '../components/ui/Button';
import { useAuth } from '../contexts/AuthContext';
import { dummyRoutines } from '../data/dummyData';
import { format, startOfWeek, addDays, isSameDay } from 'date-fns';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

function TaskScheduler() {
  const { userProfile } = useAuth();
  const location = useLocation();
  const [tasks, setTasks] = useState([]);
  const [showAddModal, setShowAddModal] = useState(false);
  const [viewMode, setViewMode] = useState('list');
  const [currentWeekStart, setCurrentWeekStart] = useState(startOfWeek(new Date(), { weekStartsOn: 0 }));
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  
  // Check if we should show today's tasks (from dashboard)
  const showTodayTasks = location.state?.showToday || false;
  
  // Form states
  const [newTaskTitle, setNewTaskTitle] = useState('');
  const [newTaskType, setNewTaskType] = useState('task');
  const [newTaskRoutineId, setNewTaskRoutineId] = useState('');
  const [newTaskSchedule, setNewTaskSchedule] = useState('daily');
  const [newTaskTime, setNewTaskTime] = useState('');
  const [newTaskDaysOfWeek, setNewTaskDaysOfWeek] = useState([0, 1, 2, 3, 4, 5, 6]);
  
  useEffect(() => {
    const fetchTasks = async () => {
      try {
        setIsLoading(true);
        setError(null);
        const userId = userProfile?.uid || 'demo-user-123';
        const formattedDate = (showTodayTasks ? new Date() : currentWeekStart).toISOString().split('T')[0];
        const response = await axios.get(`${API_URL}/tasks/${userId}/${formattedDate}`);
        setTasks(response.data);
      } catch (err) {
        console.error('Error fetching tasks:', err);
        setError('Failed to load tasks. Please try again later.');
      } finally {
        setIsLoading(false);
      }
    };

    fetchTasks();
  }, [showTodayTasks, currentWeekStart, userProfile]);
  
  const openAddModal = () => {
    setNewTaskTitle('');
    setNewTaskType('task');
    setNewTaskRoutineId('');
    setNewTaskSchedule('daily');
    setNewTaskTime('');
    setNewTaskDaysOfWeek([0, 1, 2, 3, 4, 5, 6]);
    setShowAddModal(true);
  };
  
  const closeAddModal = () => {
    setShowAddModal(false);
  };
  
  const handleAddTask = async (e) => {
    e.preventDefault();
    
    try {
      const userId = userProfile?.uid || 'demo-user-123';
      const newTask = {
        title: newTaskTitle,
        type: newTaskType,
        routineId: newTaskType === 'routine' ? newTaskRoutineId : null,
        userId,
        schedule: newTaskSchedule,
        time: newTaskTime,
        daysOfWeek: newTaskDaysOfWeek,
      };
      
      const response = await axios.post(`${API_URL}/tasks`, newTask);
      setTasks(prev => [...prev, response.data]);
      
      closeAddModal();
    } catch (err) {
      console.error('Error adding task:', err);
      // TODO: Show error notification
    }
  };
  
  const handleToggleTaskCompletion = async (taskId, currentStatus) => {
    try {
      const userId = userProfile?.uid || 'demo-user-123';
      
      if (currentStatus) {
        await axios.post(`${API_URL}/tasks/${taskId}/uncomplete`, { userId });
      } else {
        await axios.post(`${API_URL}/tasks/${taskId}/complete`, { userId });
      }

      // Refresh tasks
      const formattedDate = (showTodayTasks ? new Date() : currentWeekStart).toISOString().split('T')[0];
      const response = await axios.get(`${API_URL}/tasks/${userId}/${formattedDate}`);
      setTasks(response.data);
    } catch (err) {
      console.error('Error toggling task:', err);
      // Show error notification
    }
  };
  
  const handleDayOfWeekToggle = (day) => {
    if (newTaskDaysOfWeek.includes(day)) {
      setNewTaskDaysOfWeek(newTaskDaysOfWeek.filter(d => d !== day));
    } else {
      setNewTaskDaysOfWeek([...newTaskDaysOfWeek, day].sort());
    }
  };
  
  const getTasksForDay = (day) => {
    return tasks.filter(task => {
      return task.daysOfWeek.includes(day) && !task.completed;
    });
  };
  
  const getDayLabel = (day) => {
    return ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'][day];
  };
  
  const getRoutineById = (routineId) => {
    return dummyRoutines.find(routine => routine.id === routineId);
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
              Beauty Task Scheduler
            </h1>
            <p className="text-gray-600">
              Schedule and track your skincare tasks
            </p>
          </div>
          <div className="flex space-x-3">
            <div className="flex items-center space-x-2 bg-white rounded-lg border border-gray-300 p-1">
              <button
                className={`p-1.5 rounded ${viewMode === 'calendar' ? 'bg-lavender-100 text-lavender-700' : 'text-gray-500 hover:text-gray-700'}`}
                onClick={() => setViewMode('calendar')}
                title="Calendar View"
              >
                <Grid size={18} />
              </button>
              <button
                className={`p-1.5 rounded ${viewMode === 'list' ? 'bg-lavender-100 text-lavender-700' : 'text-gray-500 hover:text-gray-700'}`}
                onClick={() => setViewMode('list')}
                title="List View"
              >
                <List size={18} />
              </button>
            </div>
            <Button 
              variant="primary"
              icon={<Plus size={18} />}
              onClick={openAddModal}
            >
              Add Task
            </Button>
          </div>
        </header>
        
        {tasks.length === 0 ? (
          <Card className="p-8 text-center">
            <h3 className="text-lg font-medium text-gray-700 mb-2">No tasks scheduled</h3>
            <p className="text-gray-500 mb-6">Create your first beauty task to get started.</p>
            <Button 
              variant="primary"
              icon={<Plus size={18} />}
              onClick={openAddModal}
            >
              Schedule Task
            </Button>
          </Card>
        ) : viewMode === 'calendar' ? (
          <div className="bg-white rounded-lg shadow overflow-hidden">
            {/* Calendar Header */}
            <div className="flex justify-between items-center p-4 border-b">
              <button
                className="p-2 rounded-full hover:bg-gray-100 text-gray-600"
                onClick={() => setCurrentWeekStart(addDays(currentWeekStart, -7))}
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M12.707 5.293a1 1 0 010 1.414L9.414 10l3.293 3.293a1 1 0 01-1.414 1.414l-4-4a1 1 0 010-1.414l4-4a1 1 0 011.414 0z" clipRule="evenodd" />
                </svg>
              </button>
              
              <h3 className="text-lg font-medium text-gray-800">
                {format(currentWeekStart, 'MMMM d')} - {format(addDays(currentWeekStart, 6), 'MMMM d, yyyy')}
              </h3>
              
              <button
                className="p-2 rounded-full hover:bg-gray-100 text-gray-600"
                onClick={() => setCurrentWeekStart(addDays(currentWeekStart, 7))}
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z" clipRule="evenodd" />
                </svg>
              </button>
            </div>
            
            {/* Calendar Grid */}
            <div className="grid grid-cols-7 text-center p-4 gap-4">
              {/* Day Headers */}
              {[0, 1, 2, 3, 4, 5, 6].map((day) => (
                <div key={`header-${day}`} className="font-medium text-gray-700 mb-2">
                  {getDayLabel(day)}
                </div>
              ))}
              
              {/* Day Cells */}
              {[0, 1, 2, 3, 4, 5, 6].map((day) => {
                const date = addDays(currentWeekStart, day);
                const isToday = isSameDay(date, new Date());
                const dayTasks = getTasksForDay(day);
                
                return (
                  <div 
                    key={`day-${day}`} 
                    className={`border rounded-lg p-2 min-h-40 ${isToday ? 'bg-lavender-50 border-lavender-200' : 'border-gray-200'}`}
                  >
                    <div className={`text-center mb-2 ${isToday ? 'text-lavender-700 font-medium' : 'text-gray-500'}`}>
                      {format(date, 'd')}
                    </div>
                    
                    <div className="space-y-2">
                      {dayTasks.length === 0 ? (
                        <p className="text-xs text-gray-400 text-center">No tasks</p>
                      ) : (
                        dayTasks.map((task) => (
                          <div 
                            key={task.id}
                            className="text-xs p-1.5 rounded bg-white border border-gray-200 cursor-pointer hover:bg-lavender-50 transition-colors"
                            onClick={() => handleToggleTaskCompletion(task.id, task.completed)}
                          >
                            <div className="flex items-center">
                              <button 
                                className={`h-4 w-4 rounded-full border flex-shrink-0 ${
                                  task.completed 
                                    ? 'bg-mint-500 border-mint-500' 
                                    : 'bg-white border-gray-300'
                                } flex items-center justify-center`}
                              >
                                {task.completed && <CheckCircle2 size={12} className="text-white" />}
                              </button>
                              <span className={`ml-1.5 truncate ${task.completed ? 'line-through text-gray-400' : 'text-gray-700'}`}>
                                {task.title}
                              </span>
                            </div>
                            {task.time && (
                              <div className="flex items-center mt-1 text-gray-500">
                                <Clock size={10} className="mr-1" />
                                <span>{task.time}</span>
                              </div>
                            )}
                          </div>
                        ))
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        ) : (
          <Card>
            <div className="divide-y divide-gray-100">
              {tasks.map((task) => (
                <div key={task.id} className="py-3 flex items-center justify-between">
                  <div className="flex items-center">
                    <button 
                      className={`h-5 w-5 rounded-full border ${
                        task.completed 
                          ? 'bg-mint-500 border-mint-500' 
                          : 'bg-white border-gray-300 hover:border-lavender-400'
                      } flex items-center justify-center mr-3 transition-colors`}
                      onClick={() => handleToggleTaskCompletion(task.id, task.completed)}
                    >
                      {task.completed && <CheckCircle2 size={14} className="text-white" />}
                    </button>
                    
                    <div>
                      <h4 className={`font-medium ${task.completed ? 'line-through text-gray-400' : 'text-gray-800'}`}>
                        {task.title}
                      </h4>
                      <div className="flex items-center text-xs text-gray-500 mt-1">
                        <Clock size={12} className="mr-1" />
                        <span>{task.schedule === 'daily' ? 'Daily' : 'Weekly'}</span>
                        {task.time && <span className="ml-2">{task.time}</span>}
                        
                        <span className="mx-2">•</span>
                        
                        <Repeat size={12} className="mr-1" />
                        {task.schedule === 'daily' ? (
                          <span>Every day</span>
                        ) : (
                          <span>
                            {task.daysOfWeek.map(day => getDayLabel(day)[0]).join(', ')}
                          </span>
                        )}
                      </div>
                    </div>
                  </div>
                  
                  {task.type === 'routine' && (
                    <div className="text-xs py-1 px-2 bg-lavender-100 text-lavender-700 rounded-md">
                      Routine
                    </div>
                  )}
                </div>
              ))}
            </div>
          </Card>
        )}
      </div>
      
      {/* Add Task Modal */}
      {showAddModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg w-full max-w-md p-6 animate-fade-in">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-medium text-gray-800">Schedule New Task</h3>
              <button 
                className="text-gray-500 hover:text-gray-700"
                onClick={closeAddModal}
              >
                <X size={20} />
              </button>
            </div>
            
            <form onSubmit={handleAddTask}>
              <div className="space-y-4 mb-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1" htmlFor="taskType">
                    Task Type
                  </label>
                  <div className="grid grid-cols-2 gap-3">
                    <label className={`flex items-center justify-center p-3 rounded-md border ${newTaskType === 'task' ? 'bg-lavender-100 border-lavender-300' : 'border-gray-300 hover:bg-gray-50'} cursor-pointer`}>
                      <input
                        type="radio"
                        name="taskType"
                        value="task"
                        checked={newTaskType === 'task'}
                        onChange={() => setNewTaskType('task')}
                        className="sr-only"
                      />
                      <CalendarIcon size={20} className={newTaskType === 'task' ? 'text-lavender-600' : 'text-gray-500'} />
                      <span className={`ml-2 ${newTaskType === 'task' ? 'text-lavender-700' : 'text-gray-700'}`}>
                        Basic Task
                      </span>
                    </label>
                    
                    <label className={`flex items-center justify-center p-3 rounded-md border ${newTaskType === 'routine' ? 'bg-lavender-100 border-lavender-300' : 'border-gray-300 hover:bg-gray-50'} cursor-pointer`}>
                      <input
                        type="radio"
                        name="taskType"
                        value="routine"
                        checked={newTaskType === 'routine'}
                        onChange={() => setNewTaskType('routine')}
                        className="sr-only"
                      />
                      <CheckCircle2 size={20} className={newTaskType === 'routine' ? 'text-lavender-600' : 'text-gray-500'} />
                      <span className={`ml-2 ${newTaskType === 'routine' ? 'text-lavender-700' : 'text-gray-700'}`}>
                        Routine
                      </span>
                    </label>
                  </div>
                </div>
                
                {newTaskType === 'routine' ? (
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1" htmlFor="routine">
                      Select Routine
                    </label>
                    <select
                      id="routine"
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-lavender-500 focus:border-lavender-500"
                      value={newTaskRoutineId}
                      onChange={(e) => {
                        const routine = getRoutineById(e.target.value);
                        setNewTaskRoutineId(e.target.value);
                        setNewTaskTitle(routine ? routine.name : '');
                      }}
                      required
                    >
                      <option value="" disabled>Select a routine</option>
                      {dummyRoutines.map((routine) => (
                        <option key={routine.id} value={routine.id}>
                          {routine.name}
                        </option>
                      ))}
                    </select>
                  </div>
                ) : (
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1" htmlFor="taskName">
                      Task Name
                    </label>
                    <input
                      type="text"
                      id="taskName"
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-lavender-500 focus:border-lavender-500"
                      value={newTaskTitle}
                      onChange={(e) => setNewTaskTitle(e.target.value)}
                      placeholder="e.g., Apply face mask, Clean makeup brushes"
                      required
                    />
                  </div>
                )}
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1" htmlFor="schedule">
                    Frequency
                  </label>
                  <div className="grid grid-cols-2 gap-3">
                    <label className={`flex items-center justify-center p-3 rounded-md border ${newTaskSchedule === 'daily' ? 'bg-lavender-100 border-lavender-300' : 'border-gray-300 hover:bg-gray-50'} cursor-pointer`}>
                      <input
                        type="radio"
                        name="schedule"
                        value="daily"
                        checked={newTaskSchedule === 'daily'}
                        onChange={() => setNewTaskSchedule('daily')}
                        className="sr-only"
                      />
                      <span className={newTaskSchedule === 'daily' ? 'text-lavender-700' : 'text-gray-700'}>
                        Daily
                      </span>
                    </label>
                    
                    <label className={`flex items-center justify-center p-3 rounded-md border ${newTaskSchedule === 'weekly' ? 'bg-lavender-100 border-lavender-300' : 'border-gray-300 hover:bg-gray-50'} cursor-pointer`}>
                      <input
                        type="radio"
                        name="schedule"
                        value="weekly"
                        checked={newTaskSchedule === 'weekly'}
                        onChange={() => setNewTaskSchedule('weekly')}
                        className="sr-only"
                      />
                      <span className={newTaskSchedule === 'weekly' ? 'text-lavender-700' : 'text-gray-700'}>
                        Weekly
                      </span>
                    </label>
                  </div>
                </div>
                
                {newTaskSchedule === 'weekly' && (
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Days of Week
                    </label>
                    <div className="flex flex-wrap gap-2">
                      {['S', 'M', 'T', 'W', 'T', 'F', 'S'].map((day, index) => (
                        <button
                          key={index}
                          type="button"
                          className={`w-9 h-9 flex items-center justify-center rounded-full 
                            ${newTaskDaysOfWeek.includes(index) ? 'bg-lavender-500 text-white' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'}
                          `}
                          onClick={() => handleDayOfWeekToggle(index)}
                        >
                          {day}
                        </button>
                      ))}
                    </div>
                  </div>
                )}
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1" htmlFor="time">
                    Time (Optional)
                  </label>
                  <input
                    type="time"
                    id="time"
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-lavender-500 focus:border-lavender-500"
                    value={newTaskTime}
                    onChange={(e) => setNewTaskTime(e.target.value)}
                  />
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
                  disabled={
                    !newTaskTitle || 
                    (newTaskType === 'routine' && !newTaskRoutineId) ||
                    (newTaskSchedule === 'weekly' && newTaskDaysOfWeek.length === 0)
                  }
                >
                  Schedule Task
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}
    </MainLayout>
  );
}

export default TaskScheduler;