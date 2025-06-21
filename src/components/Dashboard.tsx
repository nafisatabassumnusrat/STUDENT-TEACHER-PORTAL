import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { useTheme } from '../context/ThemeContext';
import DarkModeToggle from './DarkModeToggle';
import { 
  Users, 
  MapPin, 
  Vote, 
  Trophy, 
  BookOpen, 
  Clock, 
  Book, 
  DollarSign, 
  Phone, 
  Target,
  LogOut,
  Menu,
  X,
  Palette
} from 'lucide-react';

// Import module components
import StudentBioDatabase from './modules/StudentBioDatabase';
import ClassroomSeatPlanner from './modules/ClassroomSeatPlanner';
import VotingSystem from './modules/VotingSystem';
import StudentResultViewer from './modules/StudentResultViewer';
import BookLendingHistory from './modules/BookLendingHistory';
import SubjectReminderClock from './modules/SubjectReminderClock';
import MiniDictionary from './modules/MiniDictionary';
import StudentBudgetTracker from './modules/StudentBudgetTracker';
import StudentTeacherContactList from './modules/StudentTeacherContactList';
import CareerGoalTracker from './modules/CareerGoalTracker';

const Dashboard: React.FC = () => {
  const { user, logout } = useAuth();
  const { isDarkMode } = useTheme();
  const [activeModule, setActiveModule] = useState<string | null>(null);
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const modules = [
    { id: 'bio', name: 'Student Bio Database', icon: Users, color: 'bg-blue-500 dark:bg-blue-600' },
    { id: 'seats', name: 'Classroom Seat Planner', icon: MapPin, color: 'bg-green-500 dark:bg-green-600' },
    { id: 'voting', name: 'Voting System', icon: Vote, color: 'bg-purple-500 dark:bg-purple-600' },
    { id: 'results', name: 'Student Results', icon: Trophy, color: 'bg-yellow-500 dark:bg-yellow-600' },
    { id: 'books', name: 'Book Lending', icon: BookOpen, color: 'bg-red-500 dark:bg-red-600' },
    { id: 'reminders', name: 'Exam Reminders', icon: Clock, color: 'bg-indigo-500 dark:bg-indigo-600' },
    { id: 'dictionary', name: 'Mini Dictionary', icon: Book, color: 'bg-teal-500 dark:bg-teal-600' },
    { id: 'budget', name: 'Budget Tracker', icon: DollarSign, color: 'bg-orange-500 dark:bg-orange-600' },
    { id: 'contacts', name: 'Contact List', icon: Phone, color: 'bg-pink-500 dark:bg-pink-600' },
    { id: 'career', name: 'Career Goals', icon: Target, color: 'bg-cyan-500 dark:bg-cyan-600' },
  ];

  const renderModule = () => {
    switch (activeModule) {
      case 'bio': return <StudentBioDatabase />;
      case 'seats': return <ClassroomSeatPlanner />;
      case 'voting': return <VotingSystem />;
      case 'results': return <StudentResultViewer />;
      case 'books': return <BookLendingHistory />;
      case 'reminders': return <SubjectReminderClock />;
      case 'dictionary': return <MiniDictionary />;
      case 'budget': return <StudentBudgetTracker />;
      case 'contacts': return <StudentTeacherContactList />;
      case 'career': return <CareerGoalTracker />;
      default: return <DashboardHome />;
    }
  };

  const DashboardHome = () => (
    <div className="p-6">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white transition-colors duration-300">
          Welcome, {user?.name}!
        </h1>
        <p className="text-gray-600 dark:text-gray-300 mt-2 transition-colors duration-300">
          {user?.role === 'teacher' ? 'Manage all student modules with full access' : 'Access your student modules'}
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {modules.map((module) => {
          const IconComponent = module.icon;
          return (
            <div
              key={module.id}
              onClick={() => setActiveModule(module.id)}
              className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-6 hover:shadow-md dark:hover:shadow-lg transition-all duration-200 cursor-pointer group"
            >
              <div className={`${module.color} w-12 h-12 rounded-lg flex items-center justify-center mb-4 group-hover:scale-110 transition-transform`}>
                <IconComponent className="h-6 w-6 text-white" />
              </div>
              <h3 className="font-semibold text-gray-900 dark:text-white mb-2 transition-colors duration-300">{module.name}</h3>
              <p className="text-sm text-gray-600 dark:text-gray-400 transition-colors duration-300">
                {user?.role === 'teacher' ? 'Full access' : 'Limited access'}
              </p>
            </div>
          );
        })}
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex transition-colors duration-300">
      {/* Sidebar */}
      <div className={`${sidebarOpen ? 'translate-x-0' : '-translate-x-full'} fixed inset-y-0 left-0 z-50 w-64 bg-white dark:bg-gray-800 shadow-lg transform transition-all duration-300 ease-in-out lg:translate-x-0 lg:static lg:inset-0`}>
        <div className="flex items-center justify-between h-16 px-6 border-b border-gray-200 dark:border-gray-700">
          <h2 className="text-xl font-bold text-gray-900 dark:text-white transition-colors duration-300">
            {user?.role === 'teacher' ? 'Teacher Portal' : 'Student Portal'}
          </h2>
          <button
            onClick={() => setSidebarOpen(false)}
            className="lg:hidden text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-200"
          >
            <X className="h-6 w-6" />
          </button>
        </div>

        <nav className="mt-6 px-3">
          <button
            onClick={() => setActiveModule(null)}
            className={`flex items-center w-full px-3 py-2 rounded-lg mb-2 transition-colors ${
              !activeModule 
                ? 'bg-blue-100 dark:bg-blue-900 text-blue-700 dark:text-blue-300' 
                : 'text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700'
            }`}
          >
            <span className="ml-3">Dashboard</span>
          </button>

          {modules.map((module) => {
            const IconComponent = module.icon;
            return (
              <button
                key={module.id}
                onClick={() => setActiveModule(module.id)}
                className={`flex items-center w-full px-3 py-2 rounded-lg mb-2 transition-colors ${
                  activeModule === module.id 
                    ? 'bg-blue-100 dark:bg-blue-900 text-blue-700 dark:text-blue-300' 
                    : 'text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700'
                }`}
              >
                <IconComponent className="h-5 w-5" />
                <span className="ml-3 text-sm">{module.name}</span>
              </button>
            );
          })}
        </nav>

        <div className="absolute bottom-4 left-4 right-4 space-y-3">
          {/* Dark Mode Toggle - Only for Teachers */}
          {user?.role === 'teacher' && (
            <div className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-700 rounded-lg transition-colors duration-300">
              <div className="flex items-center space-x-2">
                <Palette className="h-4 w-4 text-gray-600 dark:text-gray-400" />
                <span className="text-sm text-gray-700 dark:text-gray-300">Theme</span>
              </div>
              <DarkModeToggle />
            </div>
          )}
          
          <button
            onClick={logout}
            className="flex items-center w-full px-3 py-2 text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition-colors"
          >
            <LogOut className="h-5 w-5" />
            <span className="ml-3">Logout</span>
          </button>
        </div>
      </div>

      {/* Main content */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Header */}
        <div className="bg-white dark:bg-gray-800 shadow-sm border-b border-gray-200 dark:border-gray-700 h-16 flex items-center px-6 transition-colors duration-300">
          <button
            onClick={() => setSidebarOpen(true)}
            className="lg:hidden mr-4 text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-200"
          >
            <Menu className="h-6 w-6" />
          </button>
          <div className="flex-1">
            <h1 className="text-lg font-semibold text-gray-900 dark:text-white transition-colors duration-300">
              {activeModule ? modules.find(m => m.id === activeModule)?.name : 'Dashboard'}
            </h1>
          </div>
          <div className="flex items-center space-x-4">
            <span className="text-sm text-gray-600 dark:text-gray-400 transition-colors duration-300">
              {user?.role === 'student' && user.rollNumber && `Roll: ${user.rollNumber}`}
            </span>
            <div className="w-8 h-8 bg-blue-500 dark:bg-blue-600 rounded-full flex items-center justify-center transition-colors duration-300">
              <span className="text-white text-sm font-medium">
                {user?.name.charAt(0).toUpperCase()}
              </span>
            </div>
          </div>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-auto bg-gray-50 dark:bg-gray-900 transition-colors duration-300">
          {renderModule()}
        </div>
      </div>

      {/* Overlay for mobile */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 z-40 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}
    </div>
  );
};

export default Dashboard;