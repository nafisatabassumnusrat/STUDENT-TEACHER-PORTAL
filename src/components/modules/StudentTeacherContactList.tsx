import React, { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { useLocalStorage } from '../../hooks/useLocalStorage';
import { ContactInfo } from '../../types';
import { Plus, Phone, Mail, Edit2, Users, User } from 'lucide-react';

interface Contact {
  id: string;
  name: string;
  role: 'teacher' | 'student';
  rollNumber?: string;
  whatsapp?: string;
  gmail?: string;
  parentWhatsapp?: string;
  parentGmail?: string;
  addedBy: string;
}

const StudentTeacherContactList: React.FC = () => {
  const { user } = useAuth();
  const [contacts, setContacts] = useLocalStorage<Contact[]>('contacts', []);
  const [showForm, setShowForm] = useState(false);
  const [editingContact, setEditingContact] = useState<Contact | null>(null);
  const [formData, setFormData] = useState({
    name: '',
    role: 'student' as 'teacher' | 'student',
    rollNumber: '',
    whatsapp: '',
    gmail: '',
    parentWhatsapp: '',
    parentGmail: ''
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const newContact: Contact = {
      id: editingContact?.id || Date.now().toString(),
      name: formData.name,
      role: formData.role,
      rollNumber: formData.role === 'student' ? formData.rollNumber : undefined,
      whatsapp: formData.whatsapp,
      gmail: formData.gmail,
      parentWhatsapp: formData.role === 'student' ? formData.parentWhatsapp : undefined,
      parentGmail: formData.role === 'student' ? formData.parentGmail : undefined,
      addedBy: user?.name || 'Unknown'
    };

    if (editingContact) {
      setContacts(contacts.map(contact => 
        contact.id === editingContact.id ? newContact : contact
      ));
    } else {
      setContacts([...contacts, newContact]);
    }

    setFormData({
      name: '',
      role: 'student',
      rollNumber: '',
      whatsapp: '',
      gmail: '',
      parentWhatsapp: '',
      parentGmail: ''
    });
    setShowForm(false);
    setEditingContact(null);
  };

  const handleEdit = (contact: Contact) => {
    setEditingContact(contact);
    setFormData({
      name: contact.name,
      role: contact.role,
      rollNumber: contact.rollNumber || '',
      whatsapp: contact.whatsapp || '',
      gmail: contact.gmail || '',
      parentWhatsapp: contact.parentWhatsapp || '',
      parentGmail: contact.parentGmail || ''
    });
    setShowForm(true);
  };

  const teachers = contacts.filter(contact => contact.role === 'teacher');
  const students = contacts.filter(contact => contact.role === 'student');

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Contact Directory</h2>
          <p className="text-gray-600 mt-1">Student and teacher contact information</p>
        </div>
        <button
          onClick={() => setShowForm(true)}
          className="bg-pink-600 text-white px-4 py-2 rounded-lg hover:bg-pink-700 transition-colors flex items-center space-x-2"
        >
          <Plus className="h-4 w-4" />
          <span>Add Contact</span>
        </button>
      </div>

      {/* Add/Edit Contact Form */}
      {showForm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-md max-h-[90vh] overflow-y-auto">
            <h3 className="text-lg font-bold mb-4">
              {editingContact ? 'Edit Contact' : 'Add New Contact'}
            </h3>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Name</label>
                <input
                  type="text"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-pink-500 focus:border-transparent"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Role</label>
                <select
                  value={formData.role}
                  onChange={(e) => setFormData({ ...formData, role: e.target.value as 'teacher' | 'student' })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-pink-500 focus:border-transparent"
                >
                  <option value="student">Student</option>
                  <option value="teacher">Teacher</option>
                </select>
              </div>
              {formData.role === 'student' && (
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Roll Number</label>
                  <input
                    type="text"
                    value={formData.rollNumber}
                    onChange={(e) => setFormData({ ...formData, rollNumber: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-pink-500 focus:border-transparent"
                    required
                  />
                </div>
              )}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">WhatsApp</label>
                <input
                  type="tel"
                  value={formData.whatsapp}
                  onChange={(e) => setFormData({ ...formData, whatsapp: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-pink-500 focus:border-transparent"
                  placeholder="+880XXXXXXXXX"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Gmail</label>
                <input
                  type="email"
                  value={formData.gmail}
                  onChange={(e) => setFormData({ ...formData, gmail: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-pink-500 focus:border-transparent"
                  placeholder="example@gmail.com"
                />
              </div>
              {formData.role === 'student' && (
                <>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Parent's WhatsApp</label>
                    <input
                      type="tel"
                      value={formData.parentWhatsapp}
                      onChange={(e) => setFormData({ ...formData, parentWhatsapp: e.target.value })}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-pink-500 focus:border-transparent"
                      placeholder="+880XXXXXXXXX"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Parent's Gmail</label>
                    <input
                      type="email"
                      value={formData.parentGmail}
                      onChange={(e) => setFormData({ ...formData, parentGmail: e.target.value })}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-pink-500 focus:border-transparent"
                      placeholder="parent@gmail.com"
                    />
                  </div>
                </>
              )}
              <div className="flex space-x-3 pt-4">
                <button
                  type="button"
                  onClick={() => {
                    setShowForm(false);
                    setEditingContact(null);
                    setFormData({
                      name: '',
                      role: 'student',
                      rollNumber: '',
                      whatsapp: '',
                      gmail: '',
                      parentWhatsapp: '',
                      parentGmail: ''
                    });
                  }}
                  className="flex-1 py-2 px-4 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="flex-1 py-2 px-4 bg-pink-600 text-white rounded-lg hover:bg-pink-700"
                >
                  {editingContact ? 'Update' : 'Add'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Statistics */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
        <div className="bg-white rounded-lg shadow-sm p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Teachers</p>
              <p className="text-2xl font-bold text-pink-600">{teachers.length}</p>
            </div>
            <Users className="h-10 w-10 text-pink-600" />
          </div>
        </div>
        <div className="bg-white rounded-lg shadow-sm p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Students</p>
              <p className="text-2xl font-bold text-blue-600">{students.length}</p>
            </div>
            <User className="h-10 w-10 text-blue-600" />
          </div>
        </div>
      </div>

      {/* Teachers Section */}
      {teachers.length > 0 && (
        <div className="mb-8">
          <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center space-x-2">
            <Users className="h-5 w-5 text-pink-600" />
            <span>Teachers</span>
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {teachers.map((contact) => (
              <div key={contact.id} className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                <div className="flex justify-between items-start mb-4">
                  <div>
                    <h4 className="font-semibold text-gray-900">{contact.name}</h4>
                    <p className="text-sm text-pink-600">Teacher</p>
                  </div>
                  <button
                    onClick={() => handleEdit(contact)}
                    className="text-gray-400 hover:text-gray-600"
                  >
                    <Edit2 className="h-4 w-4" />
                  </button>
                </div>
                <div className="space-y-2">
                  {contact.whatsapp && (
                    <div className="flex items-center space-x-2 text-sm text-gray-600">
                      <Phone className="h-4 w-4 text-green-600" />
                      <a 
                        href={`https://wa.me/${contact.whatsapp.replace(/[^0-9]/g, '')}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="hover:text-green-600"
                      >
                        {contact.whatsapp}
                      </a>
                    </div>
                  )}
                  {contact.gmail && (
                    <div className="flex items-center space-x-2 text-sm text-gray-600">
                      <Mail className="h-4 w-4 text-red-600" />
                      <a 
                        href={`mailto:${contact.gmail}`}
                        className="hover:text-red-600"
                      >
                        {contact.gmail}
                      </a>
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Students Section */}
      {students.length > 0 && (
        <div className="mb-8">
          <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center space-x-2">
            <User className="h-5 w-5 text-blue-600" />
            <span>Students</span>
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {students.map((contact) => (
              <div key={contact.id} className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                <div className="flex justify-between items-start mb-4">
                  <div>
                    <h4 className="font-semibold text-gray-900">{contact.name}</h4>
                    <p className="text-sm text-blue-600">Roll: {contact.rollNumber}</p>
                  </div>
                  <button
                    onClick={() => handleEdit(contact)}
                    className="text-gray-400 hover:text-gray-600"
                  >
                    <Edit2 className="h-4 w-4" />
                  </button>
                </div>
                <div className="space-y-3">
                  <div>
                    <p className="text-xs font-medium text-gray-500 uppercase mb-1">Student</p>
                    <div className="space-y-1">
                      {contact.whatsapp && (
                        <div className="flex items-center space-x-2 text-sm text-gray-600">
                          <Phone className="h-4 w-4 text-green-600" />
                          <a 
                            href={`https://wa.me/${contact.whatsapp.replace(/[^0-9]/g, '')}`}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="hover:text-green-600"
                          >
                            {contact.whatsapp}
                          </a>
                        </div>
                      )}
                      {contact.gmail && (
                        <div className="flex items-center space-x-2 text-sm text-gray-600">
                          <Mail className="h-4 w-4 text-red-600" />
                          <a 
                            href={`mailto:${contact.gmail}`}
                            className="hover:text-red-600"
                          >
                            {contact.gmail}
                          </a>
                        </div>
                      )}
                    </div>
                  </div>
                  {(contact.parentWhatsapp || contact.parentGmail) && (
                    <div>
                      <p className="text-xs font-medium text-gray-500 uppercase mb-1">Parent</p>
                      <div className="space-y-1">
                        {contact.parentWhatsapp && (
                          <div className="flex items-center space-x-2 text-sm text-gray-600">
                            <Phone className="h-4 w-4 text-green-600" />
                            <a 
                              href={`https://wa.me/${contact.parentWhatsapp.replace(/[^0-9]/g, '')}`}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="hover:text-green-600"
                            >
                              {contact.parentWhatsapp}
                            </a>
                          </div>
                        )}
                        {contact.parentGmail && (
                          <div className="flex items-center space-x-2 text-sm text-gray-600">
                            <Mail className="h-4 w-4 text-red-600" />
                            <a 
                              href={`mailto:${contact.parentGmail}`}
                              className="hover:text-red-600"
                            >
                              {contact.parentGmail}
                            </a>
                          </div>
                        )}
                      </div>
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Empty State */}
      {contacts.length === 0 && (
        <div className="text-center py-12 text-gray-500">
          <Phone className="h-16 w-16 mx-auto mb-4 text-gray-300" />
          <p className="text-lg">No contacts found</p>
          <p className="text-sm">Add teacher and student contact information to get started</p>
        </div>
      )}
    </div>
  );
};

export default StudentTeacherContactList;