import React, { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { useLocalStorage } from '../../hooks/useLocalStorage';
import { DictionaryEntry } from '../../types';
import { Plus, Search, Book, Edit2, Trash2 } from 'lucide-react';

const MiniDictionary: React.FC = () => {
  const { user } = useAuth();
  const [dictionary, setDictionary] = useLocalStorage<DictionaryEntry[]>('dictionary', []);
  const [showForm, setShowForm] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [editingEntry, setEditingEntry] = useState<DictionaryEntry | null>(null);
  const [formData, setFormData] = useState({
    english: '',
    bangla: ''
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const newEntry: DictionaryEntry = {
      id: editingEntry?.id || Date.now().toString(),
      english: formData.english.toLowerCase().trim(),
      bangla: formData.bangla.trim(),
      addedBy: user?.name || 'Unknown',
      timestamp: new Date()
    };

    if (editingEntry) {
      setDictionary(dictionary.map(entry => 
        entry.id === editingEntry.id ? newEntry : entry
      ));
    } else {
      setDictionary([...dictionary, newEntry]);
    }

    setFormData({ english: '', bangla: '' });
    setShowForm(false);
    setEditingEntry(null);
  };

  const handleEdit = (entry: DictionaryEntry) => {
    setEditingEntry(entry);
    setFormData({
      english: entry.english,
      bangla: entry.bangla
    });
    setShowForm(true);
  };

  const handleDelete = (id: string) => {
    if (confirm('Are you sure you want to delete this dictionary entry?')) {
      setDictionary(dictionary.filter(entry => entry.id !== id));
    }
  };

  const filteredEntries = dictionary.filter(entry =>
    entry.english.toLowerCase().includes(searchTerm.toLowerCase()) ||
    entry.bangla.includes(searchTerm)
  );

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Mini Dictionary</h2>
          <p className="text-gray-600 mt-1">English to Bangla translation dictionary</p>
        </div>
        <button
          onClick={() => setShowForm(true)}
          className="bg-teal-600 text-white px-4 py-2 rounded-lg hover:bg-teal-700 transition-colors flex items-center space-x-2"
        >
          <Plus className="h-4 w-4" />
          <span>Add Word</span>
        </button>
      </div>

      {/* Add/Edit Word Form */}
      {showForm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-md">
            <h3 className="text-lg font-bold mb-4">
              {editingEntry ? 'Edit Dictionary Entry' : 'Add New Word'}
            </h3>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">English Word</label>
                <input
                  type="text"
                  value={formData.english}
                  onChange={(e) => setFormData({ ...formData, english: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent"
                  placeholder="Enter English word"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Bangla Translation</label>
                <input
                  type="text"
                  value={formData.bangla}
                  onChange={(e) => setFormData({ ...formData, bangla: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent"
                  placeholder="বাংলা অর্থ লিখুন"
                  required
                />
              </div>
              <div className="flex space-x-3 pt-4">
                <button
                  type="button"
                  onClick={() => {
                    setShowForm(false);
                    setEditingEntry(null);
                    setFormData({ english: '', bangla: '' });
                  }}
                  className="flex-1 py-2 px-4 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="flex-1 py-2 px-4 bg-teal-600 text-white rounded-lg hover:bg-teal-700"
                >
                  {editingEntry ? 'Update' : 'Add'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Search Bar */}
      <div className="bg-white rounded-lg shadow-sm p-4 mb-6">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent"
            placeholder="Search English or Bangla words..."
          />
        </div>
      </div>

      {/* Dictionary Entries */}
      <div className="space-y-4">
        {filteredEntries
          .sort((a, b) => a.english.localeCompare(b.english))
          .map((entry) => (
            <div key={entry.id} className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
              <div className="flex justify-between items-start">
                <div className="flex-1">
                  <div className="flex items-center space-x-4 mb-2">
                    <h3 className="text-lg font-semibold text-gray-900 capitalize">
                      {entry.english}
                    </h3>
                    <span className="text-gray-400">→</span>
                    <h3 className="text-lg font-semibold text-teal-600">
                      {entry.bangla}
                    </h3>
                  </div>
                  <div className="flex items-center space-x-4 text-sm text-gray-500">
                    <span>Added by: {entry.addedBy}</span>
                    <span>•</span>
                    <span>{new Date(entry.timestamp).toLocaleDateString()}</span>
                  </div>
                </div>
                <div className="flex space-x-2">
                  <button
                    onClick={() => handleEdit(entry)}
                    className="text-teal-600 hover:text-teal-800 p-1"
                  >
                    <Edit2 className="h-4 w-4" />
                  </button>
                  <button
                    onClick={() => handleDelete(entry.id)}
                    className="text-red-600 hover:text-red-800 p-1"
                  >
                    <Trash2 className="h-4 w-4" />
                  </button>
                </div>
              </div>
            </div>
          ))}
      </div>

      {/* Empty State */}
      {dictionary.length === 0 && (
        <div className="text-center py-12 text-gray-500">
          <Book className="h-16 w-16 mx-auto mb-4 text-gray-300" />
          <p className="text-lg">Dictionary is empty</p>
          <p className="text-sm">Add English words with Bangla translations to get started</p>
        </div>
      )}

      {/* No Search Results */}
      {dictionary.length > 0 && filteredEntries.length === 0 && (
        <div className="text-center py-12 text-gray-500">
          <Search className="h-16 w-16 mx-auto mb-4 text-gray-300" />
          <p className="text-lg">No words found</p>
          <p className="text-sm">Try searching with different keywords</p>
        </div>
      )}

      {/* Dictionary Stats */}
      {dictionary.length > 0 && (
        <div className="mt-8 bg-white rounded-lg shadow-sm p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Dictionary Statistics</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="text-center">
              <div className="text-2xl font-bold text-teal-600">{dictionary.length}</div>
              <div className="text-sm text-gray-600">Total Words</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-blue-600">
                {new Set(dictionary.map(entry => entry.addedBy)).size}
              </div>
              <div className="text-sm text-gray-600">Contributors</div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default MiniDictionary;