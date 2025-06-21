import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { GraduationCap, User, LogIn } from 'lucide-react';

const Login: React.FC = () => {
  const { login } = useAuth();
  const [selectedRole, setSelectedRole] = useState<'teacher' | 'student' | null>(null);
  const [name, setName] = useState('');
  const [rollNumber, setRollNumber] = useState('');

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (name && (selectedRole === 'teacher' || rollNumber)) {
      login(selectedRole!, name, selectedRole === 'student' ? rollNumber : undefined);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-gray-900 dark:to-gray-800 flex items-center justify-center p-4 transition-colors duration-300">
      <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl p-8 w-full max-w-md transition-colors duration-300">
        <div className="text-center mb-8">
          <div className="bg-blue-100 dark:bg-blue-900 w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-4 transition-colors duration-300">
            <GraduationCap className="h-10 w-10 text-blue-600 dark:text-blue-400" />
          </div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2 transition-colors duration-300">Student Portal</h1>
          <p className="text-gray-600 dark:text-gray-300 transition-colors duration-300">Choose your role to continue</p>
        </div>

        {!selectedRole ? (
          <div className="space-y-4">
            <button
              onClick={() => setSelectedRole('teacher')}
              className="w-full p-4 border-2 border-gray-200 dark:border-gray-600 rounded-xl hover:border-blue-300 dark:hover:border-blue-500 hover:bg-blue-50 dark:hover:bg-blue-900/20 transition-all duration-200 group"
            >
              <div className="flex items-center space-x-3">
                <div className="bg-orange-100 dark:bg-orange-900 p-3 rounded-lg group-hover:bg-orange-200 dark:group-hover:bg-orange-800 transition-colors">
                  <GraduationCap className="h-6 w-6 text-orange-600 dark:text-orange-400" />
                </div>
                <div className="text-left">
                  <h3 className="font-semibold text-gray-900 dark:text-white">Teacher Portal</h3>
                  <p className="text-sm text-gray-600 dark:text-gray-300">Full access to all modules</p>
                </div>
              </div>
            </button>

            <button
              onClick={() => setSelectedRole('student')}
              className="w-full p-4 border-2 border-gray-200 dark:border-gray-600 rounded-xl hover:border-blue-300 dark:hover:border-blue-500 hover:bg-blue-50 dark:hover:bg-blue-900/20 transition-all duration-200 group"
            >
              <div className="flex items-center space-x-3">
                <div className="bg-blue-100 dark:bg-blue-900 p-3 rounded-lg group-hover:bg-blue-200 dark:group-hover:bg-blue-800 transition-colors">
                  <User className="h-6 w-6 text-blue-600 dark:text-blue-400" />
                </div>
                <div className="text-left">
                  <h3 className="font-semibold text-gray-900 dark:text-white">Student Portal</h3>
                  <p className="text-sm text-gray-600 dark:text-gray-300">View and limited edit access</p>
                </div>
              </div>
            </button>
          </div>
        ) : (
          <form onSubmit={handleLogin} className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Name</label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 transition-colors duration-300"
                placeholder="Enter your name"
                required
              />
            </div>

            {selectedRole === 'student' && (
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Roll Number</label>
                <input
                  type="text"
                  value={rollNumber}
                  onChange={(e) => setRollNumber(e.target.value)}
                  className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 transition-colors duration-300"
                  placeholder="Enter your roll number"
                  required
                />
              </div>
            )}

            <div className="flex space-x-3">
              <button
                type="button"
                onClick={() => setSelectedRole(null)}
                className="flex-1 py-3 px-4 border border-gray-300 dark:border-gray-600 rounded-lg text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors duration-300"
              >
                Back
              </button>
              <button
                type="submit"
                className="flex-1 py-3 px-4 bg-blue-600 dark:bg-blue-700 text-white rounded-lg hover:bg-blue-700 dark:hover:bg-blue-600 transition-colors duration-300 flex items-center justify-center space-x-2"
              >
                <LogIn className="h-4 w-4" />
                <span>Login</span>
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
};

export default Login;