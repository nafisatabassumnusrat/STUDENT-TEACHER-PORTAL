import React, { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { useLocalStorage } from '../../hooks/useLocalStorage';
import { Result } from '../../types';
import { Plus, Search, Trophy, Medal, Award } from 'lucide-react';

const StudentResultViewer: React.FC = () => {
  const { user } = useAuth();
  const [results, setResults] = useLocalStorage<Result[]>('results', []);
  const [showForm, setShowForm] = useState(false);
  const [searchRoll, setSearchRoll] = useState('');
  const [formData, setFormData] = useState({
    studentName: '',
    studentRoll: '',
    subjects: {
      Math: 0,
      English: 0,
      Science: 0,
      History: 0,
      Bengali: 0
    }
  });

  const isTeacher = user?.role === 'teacher';

  const calculateGrade = (percentage: number): string => {
    if (percentage >= 90) return 'A+';
    if (percentage >= 80) return 'A';
    if (percentage >= 70) return 'B';
    if (percentage >= 60) return 'C';
    if (percentage >= 50) return 'D';
    return 'F';
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const totalMarks = Object.values(formData.subjects).reduce((sum, mark) => sum + mark, 0);
    const maxMarks = Object.keys(formData.subjects).length * 100;
    const percentage = (totalMarks / maxMarks) * 100;
    
    const newResult: Result = {
      id: Date.now().toString(),
      studentName: formData.studentName,
      studentRoll: formData.studentRoll,
      subjects: formData.subjects,
      totalMarks,
      grade: calculateGrade(percentage)
    };

    setResults([...results, newResult]);
    setFormData({
      studentName: '',
      studentRoll: '',
      subjects: { Math: 0, English: 0, Science: 0, History: 0, Bengali: 0 }
    });
    setShowForm(false);
  };

  const getLeaderboard = () => {
    return results
      .sort((a, b) => b.totalMarks - a.totalMarks)
      .slice(0, 3)
      .map((result, index) => ({ ...result, rank: index + 1 }));
  };

  const getStudentResult = (rollNumber: string) => {
    return results.find(result => result.studentRoll === rollNumber);
  };

  const searchedResult = searchRoll ? getStudentResult(searchRoll) : null;
  const leaderboard = getLeaderboard();

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Student Results</h2>
          <p className="text-gray-600 mt-1">
            {isTeacher ? 'Manage student results and view rankings' : 'View your results and class rankings'}
          </p>
        </div>
        {isTeacher && (
          <button
            onClick={() => setShowForm(true)}
            className="bg-yellow-600 text-white px-4 py-2 rounded-lg hover:bg-yellow-700 transition-colors flex items-center space-x-2"
          >
            <Plus className="h-4 w-4" />
            <span>Add Result</span>
          </button>
        )}
      </div>

      {/* Add Result Form */}
      {showForm && isTeacher && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-2xl max-h-[90vh] overflow-y-auto">
            <h3 className="text-lg font-bold mb-4">Add Student Result</h3>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Student Name</label>
                  <input
                    type="text"
                    value={formData.studentName}
                    onChange={(e) => setFormData({ ...formData, studentName: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-yellow-500 focus:border-transparent"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Roll Number</label>
                  <input
                    type="text"
                    value={formData.studentRoll}
                    onChange={(e) => setFormData({ ...formData, studentRoll: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-yellow-500 focus:border-transparent"
                    required
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Subject Marks (out of 100)</label>
                <div className="grid grid-cols-2 gap-4">
                  {Object.keys(formData.subjects).map((subject) => (
                    <div key={subject}>
                      <label className="block text-xs text-gray-600 mb-1">{subject}</label>
                      <input
                        type="number"
                        min="0"
                        max="100"
                        value={formData.subjects[subject as keyof typeof formData.subjects]}
                        onChange={(e) => setFormData({
                          ...formData,
                          subjects: {
                            ...formData.subjects,
                            [subject]: parseInt(e.target.value) || 0
                          }
                        })}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-yellow-500 focus:border-transparent"
                      />
                    </div>
                  ))}
                </div>
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
                  className="flex-1 py-2 px-4 bg-yellow-600 text-white rounded-lg hover:bg-yellow-700"
                >
                  Add Result
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Student Search */}
      {!isTeacher && (
        <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Search Your Results</h3>
          <div className="flex space-x-4">
            <input
              type="text"
              value={searchRoll}
              onChange={(e) => setSearchRoll(e.target.value)}
              placeholder="Enter your roll number"
              className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-yellow-500 focus:border-transparent"
            />
            <button
              onClick={() => setSearchRoll(user?.rollNumber || '')}
              className="bg-yellow-600 text-white px-6 py-2 rounded-lg hover:bg-yellow-700 transition-colors flex items-center space-x-2"
            >
              <Search className="h-4 w-4" />
              <span>Search</span>
            </button>
          </div>
        </div>
      )}

      {/* Search Result */}
      {searchedResult && !isTeacher && (
        <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Your Results</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <h4 className="font-medium text-gray-900 mb-3">Subject Marks</h4>
              <div className="space-y-2">
                {Object.entries(searchedResult.subjects).map(([subject, marks]) => (
                  <div key={subject} className="flex justify-between items-center">
                    <span className="text-gray-600">{subject}</span>
                    <div className="flex items-center space-x-2">
                      <span className="font-medium">{marks}/100</span>
                      <div className={`px-2 py-1 rounded text-xs font-medium ${
                        marks >= 80 ? 'bg-green-100 text-green-800' :
                        marks >= 60 ? 'bg-yellow-100 text-yellow-800' :
                        'bg-red-100 text-red-800'
                      }`}>
                        {calculateGrade((marks / 100) * 100)}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
            <div>
              <h4 className="font-medium text-gray-900 mb-3">Overall Performance</h4>
              <div className="space-y-3">
                <div className="flex justify-between">
                  <span className="text-gray-600">Total Marks</span>
                  <span className="font-medium">{searchedResult.totalMarks}/500</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Percentage</span>
                  <span className="font-medium">{((searchedResult.totalMarks / 500) * 100).toFixed(2)}%</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Grade</span>
                  <div className={`px-3 py-1 rounded-lg font-medium ${
                    searchedResult.grade.startsWith('A') ? 'bg-green-100 text-green-800' :
                    searchedResult.grade === 'B' ? 'bg-blue-100 text-blue-800' :
                    searchedResult.grade === 'C' ? 'bg-yellow-100 text-yellow-800' :
                    'bg-red-100 text-red-800'
                  }`}>
                    {searchedResult.grade}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Leaderboard */}
      {leaderboard.length > 0 && (
        <div className="bg-white rounded-lg shadow-sm p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-6 flex items-center space-x-2">
            <Trophy className="h-5 w-5 text-yellow-600" />
            <span>Top 3 Students</span>
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {leaderboard.map((result) => (
              <div key={result.id} className="text-center">
                <div className={`w-16 h-16 mx-auto mb-4 rounded-full flex items-center justify-center ${
                  result.rank === 1 ? 'bg-yellow-100' :
                  result.rank === 2 ? 'bg-gray-100' :
                  'bg-orange-100'
                }`}>
                  {result.rank === 1 ? <Trophy className="h-8 w-8 text-yellow-600" /> :
                   result.rank === 2 ? <Medal className="h-8 w-8 text-gray-600" /> :
                   <Award className="h-8 w-8 text-orange-600" />}
                </div>
                <h4 className="font-semibold text-gray-900">{result.studentName}</h4>
                <p className="text-sm text-gray-600 mb-2">Roll: {result.studentRoll}</p>
                <div className="space-y-1">
                  <p className="text-lg font-bold text-gray-900">{result.totalMarks}/500</p>
                  <p className="text-sm text-gray-600">{((result.totalMarks / 500) * 100).toFixed(2)}%</p>
                  <div className={`inline-block px-3 py-1 rounded-full text-sm font-medium ${
                    result.grade.startsWith('A') ? 'bg-green-100 text-green-800' :
                    result.grade === 'B' ? 'bg-blue-100 text-blue-800' :
                    'bg-yellow-100 text-yellow-800'
                  }`}>
                    Grade {result.grade}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {results.length === 0 && (
        <div className="text-center py-12 text-gray-500">
          <Trophy className="h-16 w-16 mx-auto mb-4 text-gray-300" />
          <p className="text-lg">No results found</p>
          {isTeacher && <p className="text-sm">Add student results to get started</p>}
        </div>
      )}
    </div>
  );
};

export default StudentResultViewer;