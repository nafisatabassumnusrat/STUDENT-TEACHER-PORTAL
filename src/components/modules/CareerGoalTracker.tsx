import React, { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { useLocalStorage } from '../../hooks/useLocalStorage';
import { CareerGoal } from '../../types';
import { Plus, Target, TrendingUp, Award, Briefcase } from 'lucide-react';

const CareerGoalTracker: React.FC = () => {
  const { user } = useAuth();
  const [careerGoals, setCareerGoals] = useLocalStorage<CareerGoal[]>('careerGoals', []);
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState({
    studentRoll: '',
    studentName: '',
    assignedGoal: '',
    description: '',
    basedOnResults: true
  });

  const isTeacher = user?.role === 'teacher';

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const newGoal: CareerGoal = {
      id: Date.now().toString(),
      studentRoll: formData.studentRoll,
      studentName: formData.studentName,
      assignedGoal: formData.assignedGoal,
      description: formData.description,
      basedOnResults: formData.basedOnResults
    };

    setCareerGoals([...careerGoals, newGoal]);
    setFormData({
      studentRoll: '',
      studentName: '',
      assignedGoal: '',
      description: '',
      basedOnResults: true
    });
    setShowForm(false);
  };

  const getStudentGoal = (rollNumber: string) => {
    return careerGoals.find(goal => goal.studentRoll === rollNumber);
  };

  const studentGoal = !isTeacher && user?.rollNumber ? getStudentGoal(user.rollNumber) : null;

  const careerPaths = [
    { id: 'web-dev', name: 'Web Developer', icon: '💻', description: 'Build websites and web applications' },
    { id: 'software-eng', name: 'Software Engineer', icon: '⚙️', description: 'Design and develop software systems' },
    { id: 'ai-eng', name: 'AI Engineer', icon: '🤖', description: 'Work with artificial intelligence and machine learning' },
    { id: 'data-scientist', name: 'Data Scientist', icon: '📊', description: 'Analyze data to extract insights' },
    { id: 'mobile-dev', name: 'Mobile Developer', icon: '📱', description: 'Create mobile applications' },
    { id: 'cybersecurity', name: 'Cybersecurity Specialist', icon: '🔒', description: 'Protect systems from cyber threats' },
    { id: 'game-dev', name: 'Game Developer', icon: '🎮', description: 'Create video games and interactive entertainment' },
    { id: 'ui-ux', name: 'UI/UX Designer', icon: '🎨', description: 'Design user interfaces and experiences' }
  ];

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Career Goal Tracker</h2>
          <p className="text-gray-600 mt-1">
            {isTeacher ? 'Assign career goals based on student performance' : 'View your assigned career path'}
          </p>
        </div>
        {isTeacher && (
          <button
            onClick={() => setShowForm(true)}
            className="bg-cyan-600 text-white px-4 py-2 rounded-lg hover:bg-cyan-700 transition-colors flex items-center space-x-2"
          >
            <Plus className="h-4 w-4" />
            <span>Assign Goal</span>
          </button>
        )}
      </div>

      {/* Assign Goal Form */}
      {showForm && isTeacher && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-md max-h-[90vh] overflow-y-auto">
            <h3 className="text-lg font-bold mb-4">Assign Career Goal</h3>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Student Name</label>
                <input
                  type="text"
                  value={formData.studentName}
                  onChange={(e) => setFormData({ ...formData, studentName: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-cyan-500 focus:border-transparent"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Student Roll</label>
                <input
                  type="text"
                  value={formData.studentRoll}
                  onChange={(e) => setFormData({ ...formData, studentRoll: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-cyan-500 focus:border-transparent"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Career Goal</label>
                <select
                  value={formData.assignedGoal}
                  onChange={(e) => setFormData({ ...formData, assignedGoal: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-cyan-500 focus:border-transparent"
                  required
                >
                  <option value="">Select a career path</option>
                  {careerPaths.map(path => (
                    <option key={path.id} value={path.name}>
                      {path.icon} {path.name}
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
                <textarea
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-cyan-500 focus:border-transparent"
                  rows={3}
                  placeholder="Why this career path suits the student..."
                  required
                />
              </div>
              <div className="flex items-center">
                <input
                  type="checkbox"
                  id="basedOnResults"
                  checked={formData.basedOnResults}
                  onChange={(e) => setFormData({ ...formData, basedOnResults: e.target.checked })}
                  className="h-4 w-4 text-cyan-600 focus:ring-cyan-500 border-gray-300 rounded"
                />
                <label htmlFor="basedOnResults" className="ml-2 block text-sm text-gray-700">
                  Based on academic results
                </label>
              </div>
              <div className="flex space-x-3 pt-4">
                <button
                  type="button"
                  onClick={() => setShowForm(false)}
                  className="flex-1 py-2 px-4 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="flex-1 py-2 px-4 bg-cyan-600 text-white rounded-lg hover:bg-cyan-700"
                >
                  Assign Goal
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Student View - My Career Goal */}
      {!isTeacher && studentGoal && (
        <div className="bg-gradient-to-r from-cyan-500 to-blue-600 text-white rounded-lg p-8 mb-8">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-2xl font-bold mb-2">Your Career Path</h3>
              <div className="flex items-center space-x-3 mb-4">
                <span className="text-3xl">
                  {careerPaths.find(p => p.name === studentGoal.assignedGoal)?.icon || '🎯'}
                </span>
                <div>
                  <h4 className="text-xl font-semibold">{studentGoal.assignedGoal}</h4>
                  <p className="text-cyan-100">
                    {careerPaths.find(p => p.name === studentGoal.assignedGoal)?.description}
                  </p>
                </div>
              </div>
              <p className="text-cyan-100 mb-4">{studentGoal.description}</p>
              {studentGoal.basedOnResults && (
                <div className="flex items-center space-x-2 text-cyan-100">
                  <Award className="h-4 w-4" />
                  <span className="text-sm">Assigned based on your academic performance</span>
                </div>
              )}
            </div>
            <div className="text-center">
              <Target className="h-16 w-16 mx-auto mb-2 text-cyan-200" />
              <p className="text-sm text-cyan-100">Your Goal</p>
            </div>
          </div>
        </div>
      )}

      {/* Student View - No Goal Assigned */}
      {!isTeacher && !studentGoal && (
        <div className="bg-gray-50 border-2 border-dashed border-gray-300 rounded-lg p-8 text-center mb-8">
          <Target className="h-16 w-16 mx-auto mb-4 text-gray-400" />
          <h3 className="text-lg font-semibold text-gray-900 mb-2">No Career Goal Assigned</h3>
          <p className="text-gray-600">Your teacher will assign a career path based on your academic performance.</p>
        </div>
      )}

      {/* Career Paths Overview */}
      <div className="mb-8">
        <h3 className="text-lg font-semibold text-gray-900 mb-6">Available Career Paths</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {careerPaths.map((path) => (
            <div key={path.id} className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 hover:shadow-md transition-shadow">
              <div className="text-center">
                <div className="text-4xl mb-3">{path.icon}</div>
                <h4 className="font-semibold text-gray-900 mb-2">{path.name}</h4>
                <p className="text-sm text-gray-600">{path.description}</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Teacher View - All Assigned Goals */}
      {isTeacher && careerGoals.length > 0 && (
        <div className="bg-white rounded-lg shadow-sm">
          <div className="px-6 py-4 border-b border-gray-200">
            <h3 className="text-lg font-semibold text-gray-900">Assigned Career Goals</h3>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Student</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Roll</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Career Goal</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Description</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Based on Results</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {careerGoals.map((goal) => {
                  const careerPath = careerPaths.find(p => p.name === goal.assignedGoal);
                  return (
                    <tr key={goal.id} className="hover:bg-gray-50">
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                        {goal.studentName}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                        {goal.studentRoll}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        <div className="flex items-center space-x-2">
                          <span>{careerPath?.icon}</span>
                          <span>{goal.assignedGoal}</span>
                        </div>
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-600 max-w-xs truncate">
                        {goal.description}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`px-2 py-1 text-xs font-medium rounded-full ${
                          goal.basedOnResults 
                            ? 'bg-green-100 text-green-800' 
                            : 'bg-gray-100 text-gray-800'
                        }`}>
                          {goal.basedOnResults ? 'Yes' : 'No'}
                        </span>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Statistics */}
      {isTeacher && careerGoals.length > 0 && (
        <div className="mt-8 bg-white rounded-lg shadow-sm p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center space-x-2">
            <TrendingUp className="h-5 w-5 text-cyan-600" />
            <span>Career Assignment Statistics</span>
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="text-center">
              <div className="text-2xl font-bold text-cyan-600">{careerGoals.length}</div>
              <div className="text-sm text-gray-600">Total Assignments</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-green-600">
                {careerGoals.filter(g => g.basedOnResults).length}
              </div>
              <div className="text-sm text-gray-600">Based on Results</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-blue-600">
                {new Set(careerGoals.map(g => g.assignedGoal)).size}
              </div>
              <div className="text-sm text-gray-600">Unique Paths</div>
            </div>
          </div>
        </div>
      )}

      {/* Empty State for Teachers */}
      {isTeacher && careerGoals.length === 0 && (
        <div className="text-center py-12 text-gray-500">
          <Briefcase className="h-16 w-16 mx-auto mb-4 text-gray-300" />
          <p className="text-lg">No career goals assigned yet</p>
          <p className="text-sm">Start assigning career paths to help guide your students' futures</p>
        </div>
      )}
    </div>
  );
};

export default CareerGoalTracker;