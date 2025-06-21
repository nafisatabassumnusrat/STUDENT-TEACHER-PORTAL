import React, { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { useLocalStorage } from '../../hooks/useLocalStorage';
import { Candidate, Vote } from '../../types';
import { Plus, Vote as VoteIcon, Trophy, History } from 'lucide-react';

const VotingSystem: React.FC = () => {
  const { user } = useAuth();
  const [candidates, setCandidates] = useLocalStorage<Candidate[]>('candidates', []);
  const [votes, setVotes] = useLocalStorage<Vote[]>('votes', []);
  const [showAddCandidate, setShowAddCandidate] = useState(false);
  const [showVoteHistory, setShowVoteHistory] = useState(false);
  const [candidateForm, setCandidateForm] = useState({
    name: '',
    rollNumber: ''
  });

  const isTeacher = user?.role === 'teacher';
  const hasVoted = votes.some(vote => vote.voterRoll === user?.rollNumber);

  const handleAddCandidate = (e: React.FormEvent) => {
    e.preventDefault();
    const newCandidate: Candidate = {
      id: Date.now().toString(),
      name: candidateForm.name,
      rollNumber: candidateForm.rollNumber,
      votes: 0
    };
    setCandidates([...candidates, newCandidate]);
    setCandidateForm({ name: '', rollNumber: '' });
    setShowAddCandidate(false);
  };

  const handleVote = (candidateId: string) => {
    if (hasVoted || !user?.rollNumber) return;

    const newVote: Vote = {
      id: Date.now().toString(),
      candidateName: candidates.find(c => c.id === candidateId)?.name || '',
      voterRoll: user.rollNumber,
      timestamp: new Date()
    };

    setVotes([...votes, newVote]);
    setCandidates(candidates.map(c => 
      c.id === candidateId ? { ...c, votes: c.votes + 1 } : c
    ));
  };

  const getVoteCount = (candidateId: string) => {
    return votes.filter(vote => 
      candidates.find(c => c.name === vote.candidateName)?.id === candidateId
    ).length;
  };

  const sortedCandidates = [...candidates].sort((a, b) => getVoteCount(b.id) - getVoteCount(a.id));

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Class Representative Voting</h2>
          <p className="text-gray-600 mt-1">
            {isTeacher ? 'Manage candidates and view voting results' : 'Vote for your class representative'}
          </p>
        </div>
        <div className="flex space-x-3">
          {isTeacher && (
            <>
              <button
                onClick={() => setShowVoteHistory(true)}
                className="bg-gray-600 text-white px-4 py-2 rounded-lg hover:bg-gray-700 transition-colors flex items-center space-x-2"
              >
                <History className="h-4 w-4" />
                <span>Vote History</span>
              </button>
              <button
                onClick={() => setShowAddCandidate(true)}
                className="bg-purple-600 text-white px-4 py-2 rounded-lg hover:bg-purple-700 transition-colors flex items-center space-x-2"
              >
                <Plus className="h-4 w-4" />
                <span>Add Candidate</span>
              </button>
            </>
          )}
        </div>
      </div>

      {/* Add Candidate Modal */}
      {showAddCandidate && isTeacher && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-md">
            <h3 className="text-lg font-bold mb-4">Add New Candidate</h3>
            <form onSubmit={handleAddCandidate} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Name</label>
                <input
                  type="text"
                  value={candidateForm.name}
                  onChange={(e) => setCandidateForm({ ...candidateForm, name: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Roll Number</label>
                <input
                  type="text"
                  value={candidateForm.rollNumber}
                  onChange={(e) => setCandidateForm({ ...candidateForm, rollNumber: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                  required
                />
              </div>
              <div className="flex space-x-3 pt-4">
                <button
                  type="button"
                  onClick={() => setShowAddCandidate(false)}
                  className="flex-1 py-2 px-4 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="flex-1 py-2 px-4 bg-purple-600 text-white rounded-lg hover:bg-purple-700"
                >
                  Add Candidate
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Vote History Modal */}
      {showVoteHistory && isTeacher && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-2xl max-h-[80vh] overflow-y-auto">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-bold">Vote History</h3>
              <button
                onClick={() => setShowVoteHistory(false)}
                className="text-gray-500 hover:text-gray-700"
              >
                ×
              </button>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">Voter Roll</th>
                    <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">Candidate</th>
                    <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">Time</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  {votes.map((vote) => (
                    <tr key={vote.id}>
                      <td className="px-4 py-2 text-sm text-gray-900">{vote.voterRoll}</td>
                      <td className="px-4 py-2 text-sm text-gray-900">{vote.candidateName}</td>
                      <td className="px-4 py-2 text-sm text-gray-600">
                        {new Date(vote.timestamp).toLocaleString()}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* Voting Status */}
      {!isTeacher && (
        <div className={`p-4 rounded-lg mb-6 ${hasVoted ? 'bg-green-50 border border-green-200' : 'bg-blue-50 border border-blue-200'}`}>
          <p className={`font-medium ${hasVoted ? 'text-green-800' : 'text-blue-800'}`}>
            {hasVoted ? '✓ You have already voted' : 'You can vote once. Choose wisely!'}
          </p>
        </div>
      )}

      {/* Candidates */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
        {sortedCandidates.map((candidate, index) => {
          const voteCount = getVoteCount(candidate.id);
          const totalVotes = votes.length;
          const percentage = totalVotes > 0 ? (voteCount / totalVotes) * 100 : 0;

          return (
            <div key={candidate.id} className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center space-x-3">
                  {index < 3 && (
                    <div className={`w-6 h-6 rounded-full flex items-center justify-center text-white text-xs font-bold ${
                      index === 0 ? 'bg-yellow-500' : index === 1 ? 'bg-gray-400' : 'bg-orange-600'
                    }`}>
                      {index + 1}
                    </div>
                  )}
                  <div>
                    <h3 className="font-semibold text-gray-900">{candidate.name}</h3>
                    <p className="text-sm text-gray-600">Roll: {candidate.rollNumber}</p>
                  </div>
                </div>
                {index === 0 && voteCount > 0 && (
                  <Trophy className="h-6 w-6 text-yellow-500" />
                )}
              </div>

              <div className="mb-4">
                <div className="flex justify-between text-sm mb-1">
                  <span className="text-gray-600">Votes</span>
                  <span className="font-medium">{voteCount} ({percentage.toFixed(1)}%)</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div
                    className="bg-purple-600 h-2 rounded-full transition-all duration-300"
                    style={{ width: `${percentage}%` }}
                  />
                </div>
              </div>

              {!isTeacher && !hasVoted && (
                <button
                  onClick={() => handleVote(candidate.id)}
                  className="w-full bg-purple-600 text-white py-2 rounded-lg hover:bg-purple-700 transition-colors flex items-center justify-center space-x-2"
                >
                  <VoteIcon className="h-4 w-4" />
                  <span>Vote</span>
                </button>
              )}
            </div>
          );
        })}
      </div>

      {candidates.length === 0 && (
        <div className="text-center py-12 text-gray-500">
          <VoteIcon className="h-16 w-16 mx-auto mb-4 text-gray-300" />
          <p className="text-lg">No candidates added yet</p>
          {isTeacher && <p className="text-sm">Add candidates to start the voting process</p>}
        </div>
      )}

      {/* Vote Summary */}
      {votes.length > 0 && (
        <div className="bg-white rounded-lg shadow-sm p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Voting Summary</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="text-center">
              <div className="text-2xl font-bold text-purple-600">{candidates.length}</div>
              <div className="text-sm text-gray-600">Candidates</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-blue-600">{votes.length}</div>
              <div className="text-sm text-gray-600">Total Votes</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-green-600">
                {sortedCandidates.length > 0 ? sortedCandidates[0].name : 'N/A'}
              </div>
              <div className="text-sm text-gray-600">Leading Candidate</div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default VotingSystem;