export interface User {
  id: string;
  role: 'teacher' | 'student';
  name: string;
  rollNumber?: string;
}

export interface Student {
  id: string;
  name: string;
  rollNumber: string;
  section: string;
  class: string;
  contactInfo?: ContactInfo;
}

export interface ContactInfo {
  whatsapp?: string;
  gmail?: string;
  parentWhatsapp?: string;
  parentGmail?: string;
}

export interface SeatPlan {
  id: string;
  class: string;
  branch: string;
  seats: { [key: string]: string }; // position -> student name
}

export interface Vote {
  id: string;
  candidateName: string;
  voterRoll: string;
  timestamp: Date;
}

export interface Candidate {
  id: string;
  name: string;
  rollNumber: string;
  votes: number;
}

export interface Result {
  id: string;
  studentRoll: string;
  studentName: string;
  subjects: { [subject: string]: number };
  totalMarks: number;
  grade: string;
  rank?: number;
}

export interface BookLending {
  id: string;
  bookId: string;
  bookName: string;
  borrowerName: string;
  borrowerRoll: string;
  borrowDate: Date;
  returnDate?: Date;
}

export interface ExamReminder {
  id: string;
  examName: string;
  subject: string;
  examDate: Date;
  class: string;
}

export interface DictionaryEntry {
  id: string;
  english: string;
  bangla: string;
  addedBy: string;
  timestamp: Date;
}

export interface BudgetEntry {
  id: string;
  studentRoll: string;
  category: 'tuition' | 'transport' | 'food' | 'personal' | 'fees';
  description: string;
  amount: number;
  date: Date;
  addedBy: string;
}

export interface CareerGoal {
  id: string;
  studentRoll: string;
  studentName: string;
  assignedGoal: string;
  description: string;
  basedOnResults: boolean;
}