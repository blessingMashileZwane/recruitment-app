import { LogOut, User, Users } from 'lucide-react';
import { useState } from 'react';
import './App.css';
import { useAuth } from './auth/AuthProvider';
import CandidatesList from './components/candidate/CandidatesList';
import CandidateDetails from './components/candidate/detail/CandidateDetails';
import CandidateEdit from './components/candidate/detail/CandidateEdit';
import CandidateForm from './components/candidate/form/CandidateForm';
import FeedbackForm from './components/feedback/FeedbackForm';
import FeedbackHistory from './components/feedback/FeedbackHistory';
import Login from './components/Login';
import FeedbackEdit from './components/feedback/FeedbackEdit';
import { Toaster } from 'sonner';


type ViewState =
  | { view: "candidates" }
  | { view: "add-candidate" }
  | { view: "edit-candidate"; candidateId: string }
  | { view: "candidate-details"; candidateId: string }
  | { view: "feedback-history"; candidateId: string }
  | { view: "add-feedback"; candidateId: string }
  | { view: "edit-feedback"; feedbackId: string }
  | { view: "edit-skill"; candidateId: string }
  | { view: "edit-job-application"; candidateId: string };


function App() {
  const { user, isLoggedIn, logout } = useAuth();
  const [currentView, setCurrentView] = useState<ViewState>({ view: "candidates" });
  const [selectedCandidateId, setSelectedCandidateId] = useState<string | null>(null);
  const [selectedFeedbackId, setSelectedFeedbackId] = useState<string | null>(null);
  const [selectedJobApplicationId, setSelectedJobApplicationId] = useState<string | null>(null);

  if (!isLoggedIn) {
    return <Login />;
  }

  return (
    <>
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
                  className={`px-3 py-2 rounded-md text-sm font-medium ${currentView.view !== "add-candidate"
                    ? "bg-blue-100 text-blue-700"
                    : "text-gray-500 hover:text-gray-700"
                    }`}
                >
                  Candidates
                </button>
                <button
                  onClick={() => { setCurrentView({ view: "add-candidate" }) }}
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

              case "edit-candidate":
                if (!selectedCandidateId) {
                  setCurrentView({ view: "candidates" });
                  return null;
                }
                return <CandidateEdit candidateId={selectedCandidateId} onCancel={(id) => {
                  setCurrentView({ view: 'candidate-details', candidateId: id })
                }} onSave={(updatedCandidate) => {
                  setCurrentView({ view: 'candidate-details', candidateId: updatedCandidate.id })
                }} />

              case "candidate-details":
                if (!selectedCandidateId) {
                  setCurrentView({ view: "candidates" });
                  return null;
                }
                return (
                  <CandidateDetails
                    candidateId={selectedCandidateId}
                    onBack={() => setCurrentView({ view: "candidates" })}
                    onViewFeedback={(id) => {
                      setSelectedJobApplicationId(id);
                      setCurrentView({ view: "feedback-history", candidateId: id });
                    }}
                    onViewEdit={(id) => {
                      console.log("Edit Candidate:", id);
                      setSelectedCandidateId(id);
                      setCurrentView({ view: "edit-candidate", candidateId: id });
                    }}
                    onEditJobApplication={(id) => {
                      setSelectedCandidateId(id);
                      setCurrentView({ view: "edit-job-application", candidateId: id });
                    }}
                    onEditSkill={(id) => {
                      setSelectedCandidateId(id);
                      setCurrentView({ view: "edit-skill", candidateId: id });
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
                      id !== undefined ? setSelectedCandidateId(id) : null;
                      setCurrentView({
                        view: "add-feedback",
                        candidateId: selectedCandidateId,
                      })
                    }}
                    onBack={() => {
                      console.log("Back to Candidates", selectedCandidateId);
                      setCurrentView({
                        view: "candidate-details",
                        candidateId: selectedCandidateId,
                      })
                    }
                    }
                    onEditFeedback={(id) => {
                      setSelectedFeedbackId(id)
                      setCurrentView({
                        view: "edit-feedback",
                        feedbackId: id,
                      })
                    }
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

              case "edit-feedback":
                if (!selectedCandidateId || !selectedFeedbackId) {
                  setCurrentView({ view: "candidates" });
                  return null;
                }
                return <FeedbackEdit feedbackId={selectedFeedbackId} candidateId={selectedCandidateId} onCancel={() => setCurrentView({ view: 'feedback-history', candidateId: selectedCandidateId })} onSave={() => setCurrentView({ view: 'feedback-history', candidateId: selectedCandidateId })} />

              case "edit-skill":
                if (!selectedCandidateId) {
                  setCurrentView({ view: "candidates" });
                  return null;
                }
                return <SkillEdit skillId={selectedSkillId} candidateId={selectedCandidateId} onCancel={() => setCurrentView({ view: 'candidate-details', candidateId: selectedCandidateId })} onSave={() => setCurrentView({ view: 'candidate-details', candidateId: selectedCandidateId })} />

              case "edit-job-application":
                if (!selectedCandidateId) {
                  setCurrentView({ view: "candidates" });
                  return null;
                }
                return <JobApplicationEdit jobApplicationId={selectedJobApplicationId} candidateId={selectedCandidateId} onCancel={() => setCurrentView({ view: 'candidate-details', candidateId: selectedCandidateId })} onSave={() => setCurrentView({ view: 'candidate-details', candidateId: selectedCandidateId })} />

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
      <Toaster richColors closeButton />
    </>
  )
}

export default App
