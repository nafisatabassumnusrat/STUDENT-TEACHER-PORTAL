import React, { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { useLocalStorage } from '../../hooks/useLocalStorage';
import { ExamReminder } from '../../types';
import { Plus, Clock, Calendar, AlertCircle } from 'lucide-react';

const SubjectReminderClock: React.FC = () => {
  const { user } = useAuth();
  const [reminders, setReminders] = useLocalStorage<ExamReminder[]>('examReminders', []);
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState({
    examName: '',
    subject: '',
    examDate: '',
    class: ''
  });

  const isTeacher = user?.role === 'teacher';

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const newReminder: ExamReminder = {
      id: Date.now().toString(),
      examName: formData.examName,
      subject: formData.subject,
      examDate: new Date(formData.examDate),
      class: formData.class
    };

    setReminders([...reminders, newReminder]);
    setFormData({ examName: '', subject: '', examDate: '', class: '' });
    setShowForm(false);
  };

  const getUpcomingExams = () => {
    const now = new Date();
    return reminders
      .filter(reminder => new Date(reminder.examDate) > now)
      .sort((a, b) => new Date(a.examDate).getTime() - new Date(b.examDate).getTime());
  };

  const getDaysUntilExam = (examDate: Date) => {
    const now = new Date();
    const diffTime = new Date(examDate).getTime() - now.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays;
  };

  const upcomingExams = getUpcomingExams();
  const nextExam = upcomingExams[0];

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Subject Reminder Clock</h2>
          <p className="text-gray-600 mt-1">
            {isTeacher ? 'Manage exam schedules and reminders' : 'View upcoming exam reminders'}
          </p>
        </div>
        {isTeacher && (
          <button
            onClick={() => setShowForm(true)}
            className="bg-indigo-600 text-white px-4 py-2 rounded-lg hover:bg-indigo-700 transition-colors flex items-center space-x-2"
          >
            <Plus className="h-4 w-4" />
            <span>Add Exam</span>
          </button>
        )}
      </div>

      {/* Add Exam Form */}
      {showForm && isTeacher && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-md">
            <h3 className="text-lg font-bold mb-4">Add Exam Reminder</h3>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Exam Name</label>
                <input
                  type="text"
                  value={formData.examName}
                  onChange={(e) => setFormData({ ...formData, examName: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                  placeholder="e.g., Final Exam, Mid-term"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Subject</label>
                <input
                  type="text"
                  value={formData.subject}
                  onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                  placeholder="e.g., Mathematics, English"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Class</label>
                <input
                  type="text"
                  value={formData.class}
                  onChange={(e) => setFormData({ ...formData, class: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                  placeholder="e.g., Class 10, JSC"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Exam Date</label>
                <input
                  type="datetime-local"
                  value={formData.examDate}
                  onChange={(e) => setFormData({ ...formData, examDate: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                  required
                />
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
                  className="flex-1 py-2 px-4 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700"
                >
                  Add Exam
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Next Exam Alert */}
      {nextExam && (
        <div className="bg-gradient-to-r from-indigo-500 to-purple-600 text-white rounded-lg p-6 mb-8">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-xl font-bold mb-2">Next Exam</h3>
              <p className="text-indigo-100">
                {nextExam.examName} - {nextExam.subject}
              </p>
              <p className="text-indigo-100">
                Class: {nextExam.class}
              </p>
            </div>
            <div className="text-center">
              <div className="bg-white bg-opacity-20 rounded-lg p-4">
                <Clock className="h-8 w-8 mx-auto mb-2" />
                <div className="text-2xl font-bold">
                  {getDaysUntilExam(nextExam.examDate)}
                </div>
                <div className="text-sm text-indigo-100">
                  days left
                </div>
              </div>
            </div>
          </div>
          <div className="mt-4 pt-4 border-t border-indigo-300">
            <p className="text-indigo-100">
              📅 {new Date(nextExam.examDate).toLocaleDateString()} at {new Date(nextExam.examDate).toLocaleTimeString()}
            </p>
          </div>
        </div>
      )}

      {/* Upcoming Exams */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
        {upcomingExams.map((reminder) => {
          const daysLeft = getDaysUntilExam(reminder.examDate);
          const isUrgent = daysLeft <= 3;
          
          return (
            <div key={reminder.id} className={`bg-white rounded-lg shadow-sm border-l-4 ${
              isUrgent ? 'border-red-500' : 'border-indigo-500'
            } p-6`}>
              <div className="flex items-start justify-between mb-4">
                <div className={`p-2 rounded-lg ${isUrgent ? 'bg-red-100' : 'bg-indigo-100'}`}>
                  {isUrgent ? (
                    <AlertCircle className={`h-6 w-6 ${isUrgent ? 'text-red-600' : 'text-indigo-600'}`} />
                  ) : (
                    <Calendar className={`h-6 w-6 ${isUrgent ? 'text-red-600' : 'text-indigo-600'}`} />
                  )}
                </div>
                <div className={`px-3 py-1 rounded-full text-sm font-medium ${
                  isUrgent ? 'bg-red-100 text-red-800' : 
                  daysLeft <= 7 ? 'bg-yellow-100 text-yellow-800' :
                  'bg-green-100 text-green-800'
                }`}>
                  {daysLeft === 0 ? 'Today' : 
                   daysLeft === 1 ? 'Tomorrow' : 
                   `${daysLeft} days`}
                </div>
              </div>
              
              <h3 className="font-semibold text-gray-900 mb-1">{reminder.examName}</h3>
              <p className="text-gray-600 mb-2">{reminder.subject}</p>
              <p className="text-sm text-gray-500 mb-3">Class: {reminder.class}</p>
              
              <div className="flex items-center text-sm text-gray-600">
                <Calendar className="h-4 w-4 mr-2" />
                <span>{new Date(reminder.examDate).toLocaleDateString()}</span>
              </div>
              <div className="flex items-center text-sm text-gray-600 mt-1">
                <Clock className="h-4 w-4 mr-2" />
                <span>{new Date(reminder.examDate).toLocaleTimeString()}</span>
              </div>
            </div>
          );
        })}
      </div>

      {/* All Exams Table */}
      {reminders.length > 0 && (
        <div className="bg-white rounded-lg shadow-sm">
          <div className="px-6 py-4 border-b border-gray-200">
            <h3 className="text-lg font-semibold text-gray-900">All Scheduled Exams</h3>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Exam Name</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Subject</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Class</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Date</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Time</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {reminders
                  .sort((a, b) => new Date(a.examDate).getTime() - new Date(b.examDate).getTime())
                  .map((reminder) => {
                    const isUpcoming = new Date(reminder.examDate) > new Date();
                    const daysLeft = getDaysUntilExam(reminder.examDate);
                    
                    return (
                      <tr key={reminder.id} className="hover:bg-gray-50">
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                          {reminder.examName}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                          {reminder.subject}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                          {reminder.class}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                          {new Date(reminder.examDate).toLocaleDateString()}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                          {new Date(reminder.examDate).toLocaleTimeString()}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span className={`px-2 py-1 text-xs font-medium rounded-full ${
                            !isUpcoming ? 'bg-gray-100 text-gray-800' :
                            daysLeft <= 3 ? 'bg-red-100 text-red-800' :
                            daysLeft <= 7 ? 'bg-yellow-100 text-yellow-800' :
                            'bg-green-100 text-green-800'
                          }`}>
                            {!isUpcoming ? 'Completed' :
                             daysLeft === 0 ? 'Today' :
                             daysLeft === 1 ? 'Tomorrow' :
                             `${daysLeft} days left`}
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

      {reminders.length === 0 && (
        <div className="text-center py-12 text-gray-500">
          <Clock className="h-16 w-16 mx-auto mb-4 text-gray-300" />
          <p className="text-lg">No exam reminders found</p>
          {isTeacher && <p className="text-sm">Add exam schedules to help students prepare</p>}
        </div>
      )}
    </div>
  );
};

export default SubjectReminderClock;