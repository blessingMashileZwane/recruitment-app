import { LogOut, User, Users } from 'lucide-react';
import { useEffect, useState } from 'react';
import './App.css';
import { useAuth } from './auth/AuthProvider';
import CandidateForm from './components/CandidateForm';
import CandidatesList from './components/CandidatesList';
import FeedbackHistory from './components/FeedbackHistory';
import Login from './components/Login';
import { mockGraphQL } from './mock/mockData';
import type { Candidate } from './types';

function App() {
  const { user, isLoggedIn, logout } = useAuth();
  const [candidates, setCandidates] = useState<Candidate[]>([]);
  const [currentView, setCurrentView] = useState<
    "candidates" | "add-candidate" | "candidate-detail" | "feedback"
  >("feedback");
  const [loading, setLoading] = useState(false);

  const [feedbackForm, setFeedbackForm] = useState({
    candidateId: "",
    interviewerName: user?.name || "",
    interviewStep: "",
    rating: 3,
    comments: "",
    nextStepNotes: "",
  });

  const loadCandidates = async () => {
    setLoading(true);
    try {
      const data = await mockGraphQL.getCandidates();
      console.log("Loaded candidates:", data);
      setCandidates(data);
    } catch (error) {
      console.error("Failed to load candidates:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (isLoggedIn && candidates.length === 0) {
      loadCandidates();
    }
  }, [isLoggedIn]);

  useEffect(() => {
    if (user) {
      setFeedbackForm((prev) => ({ ...prev, interviewerName: user.name }));
    }
  }, [user]);

  if (!isLoggedIn) {
    return <Login />;
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center">
              <Users className="h-8 w-8 text-blue-600" />
              <h1 className="ml-3 text-xl font-semibold text-gray-900">
                Recruitment Portal
              </h1>
            </div>

            <nav className="flex space-x-4">
              <button
                onClick={() => setCurrentView("candidates")}
                className={`px-3 py-2 rounded-md text-sm font-medium ${currentView === "candidates"
                  ? "bg-blue-100 text-blue-700"
                  : "text-gray-500 hover:text-gray-700"
                  }`}
              >
                Candidates
              </button>
              <button
                onClick={() => setCurrentView("add-candidate")}
                className={`px-3 py-2 rounded-md text-sm font-medium ${currentView === "add-candidate"
                  ? "bg-blue-100 text-blue-700"
                  : "text-gray-500 hover:text-gray-700"
                  }`}
              >
                Add Candidate
              </button>
            </nav>

            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-2">
                <User className="h-5 w-5 text-gray-400" />
                <div className="text-sm">
                  <div className="text-gray-700">{user?.name}</div>
                  <div className="text-gray-500 text-xs">{user?.role}</div>
                </div>
              </div>
              <button
                onClick={logout}
                className="text-gray-400 hover:text-gray-600"
              >
                <LogOut className="h-5 w-5" />
              </button>
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {loading && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white rounded-lg p-6 flex items-center space-x-3">
              <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-blue-600"></div>
              <span>Loading...</span>
            </div>
          </div>
        )}
        {currentView === "candidates" && <CandidatesList currentCandidates={candidates} />}
        {currentView === "add-candidate" && <CandidateForm />}
        {currentView === "feedback" && <FeedbackHistory />}
      </main>
    </div>
  )
}

export default App
