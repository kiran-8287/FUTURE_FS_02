import React, { useState } from 'react';
import Calendar from 'react-calendar';
import { ChevronLeft, ChevronRight, Clock, CheckCircle2, Plus, X } from 'lucide-react';
import { format } from 'date-fns';
import clsx from 'clsx';
import 'react-calendar/dist/Calendar.css';

interface Task {
  id: number;
  title: string;
  time: string;
  completed: boolean;
  date: string; // ISO date string
}

export const CalendarWidget: React.FC = () => {
  const [date, setDate] = useState<Date>(new Date());
  const [tasks, setTasks] = useState<Task[]>([
    { id: 1, title: 'Call with Acme Corp', time: '10:00 AM', completed: false, date: format(new Date(), 'yyyy-MM-dd') },
    { id: 2, title: 'Team Sync', time: '02:00 PM', completed: true, date: format(new Date(), 'yyyy-MM-dd') },
    { id: 3, title: 'Review Q1 Report', time: '04:30 PM', completed: false, date: format(new Date(), 'yyyy-MM-dd') },
  ]);
  const [isAddingTask, setIsAddingTask] = useState(false);
  const [newTaskTitle, setNewTaskTitle] = useState('');
  const [newTaskTime, setNewTaskTime] = useState('');

  const selectedDateStr = format(date, 'yyyy-MM-dd');
  const tasksForSelectedDate = tasks.filter(task => task.date === selectedDateStr);

  const toggleTaskCompletion = (taskId: number) => {
    setTasks(tasks.map(task =>
      task.id === taskId ? { ...task, completed: !task.completed } : task
    ));
  };

  const addTask = () => {
    if (!newTaskTitle.trim()) return;

    const newTask: Task = {
      id: Date.now(),
      title: newTaskTitle,
      time: newTaskTime || format(new Date(), 'hh:mm a'),
      completed: false,
      date: selectedDateStr
    };

    setTasks([...tasks, newTask]);
    setNewTaskTitle('');
    setNewTaskTime('');
    setIsAddingTask(false);
  };

  const deleteTask = (taskId: number) => {
    setTasks(tasks.filter(task => task.id !== taskId));
  };

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden flex flex-col md:flex-row h-full">
      <style>{`
              .react-calendar { 
                width: 100%; bg: transparent; border: none; font-family: inherit; 
              }
              .react-calendar__navigation { margin-bottom: 1rem; }
              .react-calendar__navigation button { 
                min-width: 44px; background: none; font-size: 16px; font-weight: 600; color: #111827;
              }
              .react-calendar__navigation button:enabled:hover { background-color: #F3F4F6; border-radius: 8px; }
              .react-calendar__month-view__weekdays { 
                text-transform: uppercase; font-weight: 600; font-size: 0.75em; color: #9CA3AF; text-decoration: none;
              }
              .react-calendar__month-view__weekdays__weekday { padding: 0.5em; text-decoration: none; }
              .react-calendar__month-view__weekdays__weekday abbr { text-decoration: none; }
              .react-calendar__tile { 
                padding: 10px 6px; background: none; text-align: center; font-size: 0.875rem; border-radius: 8px; color: #374151;
              }
              .react-calendar__tile:enabled:hover { background-color: #EFF6FF; color: #2563EB; }
              .react-calendar__tile--now { background: #EFF6FF !important; color: #2563EB !important; font-weight: bold; }
              .react-calendar__tile--active { background: #2563EB !important; color: white !important; }
            `}</style>

      {/* Calendar Section */}
      <div className="p-6 md:w-3/5 border-b md:border-b-0 md:border-r border-gray-100 flex flex-col justify-center">
        <div className="mb-2 flex items-center justify-between">
          <h3 className="font-semibold text-gray-900">Calendar</h3>
          <span className="text-xs font-medium text-blue-600 bg-blue-50 px-2 py-1 rounded-full">
            {format(date, 'MMMM yyyy')}
          </span>
        </div>
        <Calendar
          onChange={(d) => setDate(d as Date)}
          value={date}
          prevLabel={<ChevronLeft size={18} className="text-gray-400 hover:text-gray-600" />}
          nextLabel={<ChevronRight size={18} className="text-gray-400 hover:text-gray-600" />}
          className="w-full"
          formatShortWeekday={(locale, date) => format(date, 'EEE')}
        />
      </div>

      {/* Tasks Section */}
      <div className="p-6 md:w-2/5 bg-white flex flex-col">
        <div className="flex items-center justify-between mb-4">
          <h4 className="text-sm font-semibold text-gray-500 uppercase tracking-wider">
            Schedule for {format(date, 'MMM d')}
          </h4>
          {tasksForSelectedDate.length > 0 && (
            <span className="text-xs text-gray-400">
              {tasksForSelectedDate.filter(t => t.completed).length}/{tasksForSelectedDate.length}
            </span>
          )}
        </div>

        <div className="space-y-3 flex-1 overflow-y-auto pr-1">
          {tasksForSelectedDate.length === 0 && !isAddingTask ? (
            <div className="text-center py-8 text-gray-400 text-sm">
              No tasks scheduled for this day
            </div>
          ) : (
            tasksForSelectedDate.map(task => (
              <div key={task.id} className="flex items-start group p-2 rounded-lg hover:bg-gray-50 border border-transparent hover:border-gray-100 transition-all">
                <button
                  onClick={() => toggleTaskCompletion(task.id)}
                  className={clsx(
                    "mt-0.5 mr-3 flex-shrink-0 w-5 h-5 rounded border flex items-center justify-center transition-colors",
                    task.completed
                      ? "bg-green-500 border-green-500 text-white"
                      : "border-gray-300 hover:border-blue-500 bg-white"
                  )}
                >
                  {task.completed && <CheckCircle2 size={12} />}
                </button>
                <div className="flex-1">
                  <p className={clsx(
                    "text-sm font-medium transition-all",
                    task.completed ? "text-gray-400 line-through" : "text-gray-900"
                  )}>
                    {task.title}
                  </p>
                  <div className="flex items-center text-xs text-gray-400 mt-1">
                    <Clock size={12} className="mr-1" />
                    {task.time}
                  </div>
                </div>
                <button
                  onClick={() => deleteTask(task.id)}
                  className="opacity-0 group-hover:opacity-100 ml-2 text-gray-400 hover:text-red-500 transition-all"
                >
                  <X size={14} />
                </button>
              </div>
            ))
          )}

          {/* Add Task Form */}
          {isAddingTask && (
            <div className="p-3 border border-blue-200 rounded-lg bg-blue-50/50 space-y-2">
              <input
                type="text"
                placeholder="Task title..."
                value={newTaskTitle}
                onChange={(e) => setNewTaskTitle(e.target.value)}
                className="w-full px-2 py-1 text-sm border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500"
                autoFocus
                onKeyDown={(e) => {
                  if (e.key === 'Enter') addTask();
                  if (e.key === 'Escape') setIsAddingTask(false);
                }}
              />
              <input
                type="text"
                placeholder="Time (e.g., 10:00 AM)"
                value={newTaskTime}
                onChange={(e) => setNewTaskTime(e.target.value)}
                className="w-full px-2 py-1 text-sm border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500"
                onKeyDown={(e) => {
                  if (e.key === 'Enter') addTask();
                  if (e.key === 'Escape') setIsAddingTask(false);
                }}
              />
              <div className="flex gap-2">
                <button
                  onClick={addTask}
                  className="flex-1 py-1 bg-blue-600 text-white text-xs rounded hover:bg-blue-700 transition-colors"
                >
                  Add
                </button>
                <button
                  onClick={() => {
                    setIsAddingTask(false);
                    setNewTaskTitle('');
                    setNewTaskTime('');
                  }}
                  className="flex-1 py-1 bg-gray-200 text-gray-700 text-xs rounded hover:bg-gray-300 transition-colors"
                >
                  Cancel
                </button>
              </div>
            </div>
          )}
        </div>

        {!isAddingTask && (
          <button
            onClick={() => setIsAddingTask(true)}
            className="w-full mt-auto py-2 border border-dashed border-gray-300 rounded-lg text-xs text-gray-500 hover:bg-blue-50 hover:text-blue-600 hover:border-blue-200 transition-all flex items-center justify-center gap-1"
          >
            <Plus size={14} />
            Add Task
          </button>
        )}
      </div>
    </div>
  );
};
