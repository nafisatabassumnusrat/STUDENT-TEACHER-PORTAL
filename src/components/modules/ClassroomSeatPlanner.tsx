import React, { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { useLocalStorage } from '../../hooks/useLocalStorage';
import { SeatPlan } from '../../types';
import { Plus, Edit2, Trash2, Users } from 'lucide-react';

const ClassroomSeatPlanner: React.FC = () => {
  const { user } = useAuth();
  const [seatPlans, setSeatPlans] = useLocalStorage<SeatPlan[]>('seatPlans', []);
  const [showForm, setShowForm] = useState(false);
  const [editingPlan, setEditingPlan] = useState<SeatPlan | null>(null);
  const [formData, setFormData] = useState({
    class: '',
    branch: '',
    rows: 5,
    cols: 6
  });
  const [seatAssignments, setSeatAssignments] = useState<{ [key: string]: string }>({});

  const isTeacher = user?.role === 'teacher';

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const newPlan: SeatPlan = {
      id: editingPlan?.id || Date.now().toString(),
      class: formData.class,
      branch: formData.branch,
      seats: seatAssignments
    };

    if (editingPlan) {
      setSeatPlans(seatPlans.map(p => p.id === editingPlan.id ? newPlan : p));
    } else {
      setSeatPlans([...seatPlans, newPlan]);
    }

    setFormData({ class: '', branch: '', rows: 5, cols: 6 });
    setSeatAssignments({});
    setShowForm(false);
    setEditingPlan(null);
  };

  const handleEdit = (plan: SeatPlan) => {
    setEditingPlan(plan);
    setFormData({
      class: plan.class,
      branch: plan.branch,
      rows: 5,
      cols: 6
    });
    setSeatAssignments(plan.seats);
    setShowForm(true);
  };

  const handleDelete = (id: string) => {
    if (confirm('Are you sure you want to delete this seat plan?')) {
      setSeatPlans(seatPlans.filter(p => p.id !== id));
    }
  };

  const handleSeatChange = (position: string, studentName: string) => {
    setSeatAssignments(prev => ({
      ...prev,
      [position]: studentName
    }));
  };

  const renderSeatGrid = (plan?: SeatPlan) => {
    const rows = 5;
    const cols = 6;
    const seats = plan?.seats || seatAssignments;

    return (
      <div className="grid grid-cols-6 gap-2 max-w-2xl mx-auto">
        {Array.from({ length: rows * cols }, (_, index) => {
          const row = Math.floor(index / cols);
          const col = index % cols;
          const position = `${row}-${col}`;
          const studentName = seats[position] || '';

          return (
            <div key={position} className="relative">
              {showForm && isTeacher ? (
                <input
                  type="text"
                  value={studentName}
                  onChange={(e) => handleSeatChange(position, e.target.value)}
                  className="w-full p-2 border border-gray-300 rounded text-xs text-center"
                  placeholder={`R${row + 1}S${col + 1}`}
                />
              ) : (
                <div className={`w-full h-12 border-2 rounded flex items-center justify-center text-xs ${
                  studentName ? 'bg-blue-100 border-blue-300 text-blue-800' : 'bg-gray-50 border-gray-200 text-gray-400'
                }`}>
                  {studentName || `R${row + 1}S${col + 1}`}
                </div>
              )}
            </div>
          );
        })}
        <div className="col-span-6 text-center mt-4">
          <div className="bg-gray-800 text-white py-2 px-4 rounded">
            Whiteboard / Teacher's Desk
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Classroom Seat Planner</h2>
          <p className="text-gray-600 mt-1">
            {isTeacher ? 'Manage classroom seating arrangements' : 'View seating plans'}
          </p>
        </div>
        {isTeacher && (
          <button
            onClick={() => setShowForm(true)}
            className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition-colors flex items-center space-x-2"
          >
            <Plus className="h-4 w-4" />
            <span>Create Seat Plan</span>
          </button>
        )}
      </div>

      {showForm && isTeacher && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg p-6 w-full max-w-4xl max-h-[90vh] overflow-y-auto">
            <h3 className="text-lg font-bold mb-4">
              {editingPlan ? 'Edit Seat Plan' : 'Create New Seat Plan'}
            </h3>
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Class</label>
                  <input
                    type="text"
                    value={formData.class}
                    onChange={(e) => setFormData({ ...formData, class: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Branch</label>
                  <input
                    type="text"
                    value={formData.branch}
                    onChange={(e) => setFormData({ ...formData, branch: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                    required
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Seat Arrangement</label>
                <p className="text-sm text-gray-600 mb-4">Click on seats to assign students (leave empty for unassigned)</p>
                {renderSeatGrid()}
              </div>

              <div className="flex space-x-3 pt-4">
                <button
                  type="button"
                  onClick={() => {
                    setShowForm(false);
                    setEditingPlan(null);
                    setFormData({ class: '', branch: '', rows: 5, cols: 6 });
                    setSeatAssignments({});
                  }}
                  className="flex-1 py-2 px-4 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="flex-1 py-2 px-4 bg-green-600 text-white rounded-lg hover:bg-green-700"
                >
                  {editingPlan ? 'Update' : 'Create'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      <div className="space-y-6">
        {seatPlans.map((plan) => (
          <div key={plan.id} className="bg-white rounded-lg shadow-sm p-6">
            <div className="flex justify-between items-center mb-4">
              <div>
                <h3 className="text-lg font-semibold text-gray-900">
                  Class {plan.class} - {plan.branch}
                </h3>
                <p className="text-sm text-gray-600">
                  {Object.values(plan.seats).filter(s => s).length} students assigned
                </p>
              </div>
              {isTeacher && (
                <div className="flex space-x-2">
                  <button
                    onClick={() => handleEdit(plan)}
                    className="text-green-600 hover:text-green-800"
                  >
                    <Edit2 className="h-5 w-5" />
                  </button>
                  <button
                    onClick={() => handleDelete(plan.id)}
                    className="text-red-600 hover:text-red-800"
                  >
                    <Trash2 className="h-5 w-5" />
                  </button>
                </div>
              )}
            </div>
            {renderSeatGrid(plan)}
          </div>
        ))}
      </div>

      {seatPlans.length === 0 && (
        <div className="text-center py-12 text-gray-500">
          <Users className="h-16 w-16 mx-auto mb-4 text-gray-300" />
          <p className="text-lg">No seat plans found</p>
          {isTeacher && <p className="text-sm">Click "Create Seat Plan" to get started</p>}
        </div>
      )}
    </div>
  );
};

export default ClassroomSeatPlanner;