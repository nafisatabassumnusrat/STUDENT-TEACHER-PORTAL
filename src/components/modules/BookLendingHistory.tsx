import React, { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { useLocalStorage } from '../../hooks/useLocalStorage';
import { BookLending } from '../../types';
import { Plus, BookOpen, Calendar, CheckCircle, Clock } from 'lucide-react';

const BookLendingHistory: React.FC = () => {
  const { user } = useAuth();
  const [bookLendings, setBookLendings] = useLocalStorage<BookLending[]>('bookLendings', []);
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState({
    bookId: '',
    bookName: '',
    borrowerName: '',
    borrowerRoll: '',
    borrowDate: new Date().toISOString().split('T')[0],
    returnDate: ''
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const newLending: BookLending = {
      id: Date.now().toString(),
      bookId: formData.bookId,
      bookName: formData.bookName,
      borrowerName: formData.borrowerName,
      borrowerRoll: formData.borrowerRoll,
      borrowDate: new Date(formData.borrowDate),
      returnDate: formData.returnDate ? new Date(formData.returnDate) : undefined
    };

    setBookLendings([...bookLendings, newLending]);
    setFormData({
      bookId: '',
      bookName: '',
      borrowerName: '',
      borrowerRoll: '',
      borrowDate: new Date().toISOString().split('T')[0],
      returnDate: ''
    });
    setShowForm(false);
  };

  const handleReturn = (id: string) => {
    setBookLendings(bookLendings.map(lending => 
      lending.id === id 
        ? { ...lending, returnDate: new Date() }
        : lending
    ));
  };

  const activeLoans = bookLendings.filter(lending => !lending.returnDate);
  const returnedBooks = bookLendings.filter(lending => lending.returnDate);

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Book Lending History</h2>
          <p className="text-gray-600 mt-1">Track borrowed and returned books</p>
        </div>
        <button
          onClick={() => setShowForm(true)}
          className="bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700 transition-colors flex items-center space-x-2"
        >
          <Plus className="h-4 w-4" />
          <span>Add Lending Record</span>
        </button>
      </div>

      {/* Add Lending Form */}
      {showForm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-md">
            <h3 className="text-lg font-bold mb-4">Add Book Lending Record</h3>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Book ID</label>
                <input
                  type="text"
                  value={formData.bookId}
                  onChange={(e) => setFormData({ ...formData, bookId: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Book Name</label>
                <input
                  type="text"
                  value={formData.bookName}
                  onChange={(e) => setFormData({ ...formData, bookName: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Borrower Name</label>
                <input
                  type="text"
                  value={formData.borrowerName}
                  onChange={(e) => setFormData({ ...formData, borrowerName: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Borrower Roll Number</label>
                <input
                  type="text"
                  value={formData.borrowerRoll}
                  onChange={(e) => setFormData({ ...formData, borrowerRoll: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Borrow Date</label>
                <input
                  type="date"
                  value={formData.borrowDate}
                  onChange={(e) => setFormData({ ...formData, borrowDate: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Return Date (Optional)</label>
                <input
                  type="date"
                  value={formData.returnDate}
                  onChange={(e) => setFormData({ ...formData, returnDate: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent"
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
                  className="flex-1 py-2 px-4 bg-red-600 text-white rounded-lg hover:bg-red-700"
                >
                  Add Record
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Statistics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <div className="bg-white rounded-lg shadow-sm p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Active Loans</p>
              <p className="text-2xl font-bold text-red-600">{activeLoans.length}</p>
            </div>
            <Clock className="h-10 w-10 text-red-600" />
          </div>
        </div>
        <div className="bg-white rounded-lg shadow-sm p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Returned Books</p>
              <p className="text-2xl font-bold text-green-600">{returnedBooks.length}</p>
            </div>
            <CheckCircle className="h-10 w-10 text-green-600" />
          </div>
        </div>
        <div className="bg-white rounded-lg shadow-sm p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Total Records</p>
              <p className="text-2xl font-bold text-blue-600">{bookLendings.length}</p>
            </div>
            <BookOpen className="h-10 w-10 text-blue-600" />
          </div>
        </div>
      </div>

      {/* Active Loans */}
      {activeLoans.length > 0 && (
        <div className="mb-8">
          <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center space-x-2">
            <Clock className="h-5 w-5 text-red-600" />
            <span>Active Loans</span>
          </h3>
          <div className="bg-white rounded-lg shadow-sm overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Book ID</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Book Name</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Borrower</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Roll</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Borrow Date</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  {activeLoans.map((lending) => (
                    <tr key={lending.id} className="hover:bg-gray-50">
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                        {lending.bookId}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {lending.bookName}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                        {lending.borrowerName}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                        {lending.borrowerRoll}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                        {new Date(lending.borrowDate).toLocaleDateString()}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                        <button
                          onClick={() => handleReturn(lending.id)}
                          className="bg-green-600 text-white px-3 py-1 rounded text-xs hover:bg-green-700 transition-colors"
                        >
                          Mark Returned
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* All Records */}
      <div>
        <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center space-x-2">
          <BookOpen className="h-5 w-5 text-blue-600" />
          <span>All Lending Records</span>
        </h3>
        <div className="bg-white rounded-lg shadow-sm overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Book ID</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Book Name</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Borrower</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Roll</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Borrow Date</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Return Date</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {bookLendings.map((lending) => (
                  <tr key={lending.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                      {lending.bookId}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {lending.bookName}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                      {lending.borrowerName}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                      {lending.borrowerRoll}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                      {new Date(lending.borrowDate).toLocaleDateString()}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                      {lending.returnDate ? new Date(lending.returnDate).toLocaleDateString() : '-'}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`px-2 py-1 text-xs font-medium rounded-full ${
                        lending.returnDate 
                          ? 'bg-green-100 text-green-800' 
                          : 'bg-red-100 text-red-800'
                      }`}>
                        {lending.returnDate ? 'Returned' : 'Active'}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {bookLendings.length === 0 && (
        <div className="text-center py-12 text-gray-500">
          <BookOpen className="h-16 w-16 mx-auto mb-4 text-gray-300" />
          <p className="text-lg">No lending records found</p>
          <p className="text-sm">Add a lending record to get started</p>
        </div>
      )}
    </div>
  );
};

export default BookLendingHistory;