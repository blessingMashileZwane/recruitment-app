import { LogOut, User, Users } from 'lucide-react';
import { useState } from 'react';
import { Toaster } from 'sonner';
import './App.css';
import { useAuth } from './auth/AuthProvider';
import CandidatesList from './components/candidate/CandidatesList';
import CandidateDetails from './components/candidate/detail/CandidateDetails';
import { CandidateEdit } from './components/candidate/detail/CandidateEdit';
import CandidateForm from './components/candidate/form/CandidateForm';
import FeedbackEdit from './components/feedback/FeedbackEdit';
import FeedbackForm from './components/feedback/FeedbackForm';
import FeedbackHistory from './components/feedback/FeedbackHistory';
import { JobApplicationEdit } from './components/jobApplication/JobApplicationEdit';
import Login from './components/Login';
import { SkillEdit } from './components/skill/SkillEdit';


type ViewState =
  | { view: "candidates" }
  | { view: "add-candidate" }
  | { view: "edit-candidate"; candidateId: string }
  | { view: "candidate-details"; candidateId: string }
  | { view: "feedback-history"; candidateId: string }
  | { view: "add-feedback"; candidateId: string; jobId: string }
  | { view: "edit-feedback"; feedbackId: string }
  | { view: "edit-skill"; candidateId: string }
  | { view: "edit-job-application"; candidateId: string };


function App() {
  const { user, isLoggedIn, logout } = useAuth();
  const [currentView, setCurrentView] = useState<ViewState>({ view: "candidates" });
  const [selectedCandidateId, setSelectedCandidateId] = useState<string | null>(null);
  const [selectedInterviewStageId, setSelectedInterviewStageId] = useState<string | null>(null);
  const [selectedJobApplicationId, setSelectedJobApplicationId] = useState<string | null>(null);
  const [selectedSkillId, setSelectedSkillId] = useState<string | null>(null);

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
                  className={`cursor-pointer px-3 py-2 rounded-md text-sm font-medium ${currentView.view !== "add-candidate"
                    ? "bg-blue-100 text-blue-700"
                    : "text-gray-500 hover:text-gray-700"
                    }`}
                >
                  Candidates
                </button>
                <button
                  onClick={() => { setCurrentView({ view: "add-candidate" }) }}
                  className={`cursor-pointer px-3 py-2 rounded-md text-sm font-medium ${currentView.view === "add-candidate"
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
                  <LogOut className="cursor-pointer h-5 w-5" />
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
                }} />;

              case "add-candidate":
                return <CandidateForm />

              case "edit-candidate":
                if (!selectedCandidateId) {
                  setCurrentView({ view: "candidates" });
                  return null;
                }
                return <CandidateEdit candidateId={selectedCandidateId} onCancel={(id: string) => {
                  setCurrentView({ view: 'candidate-details', candidateId: id })
                }} onUpdated={(candidateId: string) => {
                  setCurrentView({ view: 'candidate-details', candidateId })
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
                      setSelectedJobApplicationId(id);
                      setCurrentView({ view: "edit-job-application", candidateId: id });
                    }}
                    onEditSkill={(id) => {
                      setSelectedSkillId(id);
                      setCurrentView({ view: "edit-skill", candidateId: id });
                    }}
                  />
                );

              case "feedback-history":
                if (!selectedJobApplicationId || !selectedCandidateId) {
                  setCurrentView({ view: "candidates" });
                  return null;
                }
                return (
                  <FeedbackHistory
                    candidateId={selectedCandidateId}
                    jobId={selectedJobApplicationId}
                    onAddFeedback={(id) => {
                      id !== undefined ? setSelectedJobApplicationId(id) : null;
                      setCurrentView({
                        view: "add-feedback",
                        candidateId: selectedCandidateId,
                        jobId: id,
                      })
                    }}
                    onBack={() => {
                      setCurrentView({
                        view: "candidate-details",
                        candidateId: selectedCandidateId,
                      })
                    }
                    }
                    onEditFeedback={(id) => {
                      setSelectedInterviewStageId(id)
                      setCurrentView({
                        view: "edit-feedback",
                        feedbackId: id,
                      })
                    }
                    }
                  />
                );

              case "add-feedback":
                if (!selectedCandidateId || !selectedJobApplicationId) {
                  setCurrentView({ view: "candidates" });
                  return null;
                }
                return <FeedbackForm onViewFeedback={(id) => {
                  setSelectedCandidateId(id);
                  setCurrentView({ view: "feedback-history", candidateId: id });
                }}
                  jobId={selectedJobApplicationId}
                  candidateId={selectedCandidateId} />

              case "edit-feedback":
                if (!selectedCandidateId || !selectedJobApplicationId || !selectedInterviewStageId) {
                  setCurrentView({ view: "candidates" });
                  return null;
                }
                return <FeedbackEdit candidateId={selectedCandidateId} interviewStageId={selectedInterviewStageId} onCancel={() => setCurrentView({ view: 'feedback-history', candidateId: selectedCandidateId })} onSubmit={() => setCurrentView({ view: 'feedback-history', candidateId: selectedCandidateId })} />

              case "edit-skill":
                if (!selectedCandidateId || !selectedSkillId) {
                  setCurrentView({ view: "candidates" });
                  return null;
                }
                return <SkillEdit
                  skillId={selectedSkillId}
                  candidateId={selectedCandidateId}
                  onCancel={() => setCurrentView({ view: 'candidate-details', candidateId: selectedCandidateId })}
                  onSave={() => setCurrentView({ view: 'candidate-details', candidateId: selectedCandidateId })}
                />

              case "edit-job-application":
                if (!selectedCandidateId || !selectedJobApplicationId) {
                  setCurrentView({ view: "candidates" });
                  return null;
                }
                return <JobApplicationEdit
                  jobApplicationId={selectedJobApplicationId}
                  candidateId={selectedCandidateId}
                  onCancel={() => setCurrentView({ view: 'candidate-details', candidateId: selectedCandidateId })}
                  onSave={() => setCurrentView({ view: 'candidate-details', candidateId: selectedCandidateId })}
                />
              default:
                return <CandidatesList onViewDetails={(id) => {
                  setSelectedCandidateId(id);
                  setCurrentView({ view: 'candidate-details', candidateId: id });
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
