import { LogOut, User, Users } from 'lucide-react';
import { useState } from 'react';
import './App.css';
import { useAuth } from './auth/AuthProvider';
import CandidateDetails from './components/CandidateDetails';
import CandidatesList from './components/CandidatesList';
import FeedbackHistory from './components/FeedbackHistory';
import Login from './components/Login';
import FeedbackForm from './components/FeedbackForm';
import CandidateForm from './components/CandidateForm';

type ViewState =
  | { view: "candidates" }
  | { view: "add-candidate" }
  | { view: "candidate-details"; candidateId: string }
  | { view: "feedback-history"; candidateId: string }
  | { view: "add-feedback"; candidateId: string };

function App() {
  const { user, isLoggedIn, logout } = useAuth();
  const [currentView, setCurrentView] = useState<ViewState>({ view: "candidates" });
  const [selectedCandidateId, setSelectedCandidateId] = useState<string | null>(null);

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
                onClick={() => setCurrentView({ view: "candidates" })}
                className={`px-3 py-2 rounded-md text-sm font-medium ${currentView.view === "candidates"
                  ? "bg-blue-100 text-blue-700"
                  : "text-gray-500 hover:text-gray-700"
                  }`}
              >
                Candidates
              </button>
              <button
                onClick={() => { setCurrentView({ view: "add-candidate" }); console.log("Add Candidate clicked") }}
                className={`px-3 py-2 rounded-md text-sm font-medium ${currentView.view === "add-candidate"
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
      </header >

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {(() => {
          switch (currentView.view) {
            case "candidates":
              return <CandidatesList onViewDetails={(id) => {
                setSelectedCandidateId(id);
                setCurrentView({ view: 'candidate-details', candidateId: id });
              }}
                onViewFeedback={(id) => {
                  setSelectedCandidateId(id);
                  setCurrentView({ view: 'feedback-history', candidateId: id });
                }} />;

            case "add-candidate":
              return <CandidateForm />

            case "candidate-details":
              if (!selectedCandidateId) {
                setCurrentView({ view: "candidates" });
                return null; // render nothing this frame
              }
              return (
                <CandidateDetails
                  candidateId={selectedCandidateId}
                  onBack={() => setCurrentView({ view: "candidates" })}
                  onViewFeedback={(id) => {
                    setSelectedCandidateId(id);
                    setCurrentView({ view: "feedback-history", candidateId: id });
                  }}
                />
              );

            case "feedback-history":
              if (!selectedCandidateId) {
                setCurrentView({ view: "candidates" });
                return null;
              }
              return (
                <FeedbackHistory
                  candidateId={selectedCandidateId}
                  onAddFeedback={(id) => {
                    setSelectedCandidateId(id);
                    setCurrentView({
                      view: "add-feedback",
                      candidateId: selectedCandidateId,
                    })
                  }}
                  onBack={() =>
                    setCurrentView({
                      view: "candidate-details",
                      candidateId: selectedCandidateId,
                    })
                  }
                />
              );

            case "add-feedback":
              if (!selectedCandidateId) {
                setCurrentView({ view: "candidates" });
                return null;
              }
              return <FeedbackForm onViewFeedback={(id) => {
                setSelectedCandidateId(id);
                setCurrentView({ view: "feedback-history", candidateId: id });
              }}
                candidateId={selectedCandidateId} />

            default:
              return <CandidatesList onViewDetails={(id) => {
                setSelectedCandidateId(id);
                setCurrentView({ view: 'candidate-details', candidateId: id });
              }}
                onViewFeedback={(id) => {
                  setSelectedCandidateId(id);
                  setCurrentView({ view: 'feedback-history', candidateId: id });
                }} />;
          }
        })()}
      </main>
    </div >
  )
}

export default App
