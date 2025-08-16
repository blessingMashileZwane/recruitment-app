import { AlertCircle, Award, Clock, Edit, Globe, GraduationCap, Mail, MapPin, MessageSquare, Phone, User } from "lucide-react";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import { graphqlService } from "../../../services/graphql.service";
import { AppliedJob, CandidateStatus } from "../../../types/enums";
import type { CandidateOutput, CandidateSkillOutput, JobApplicationOutput } from "../../../types/outputs";

type CandidateDetailsProps = {
    candidateId: string;
    onBack: () => void;
    onViewFeedback: (jobApplicationId: string) => void;
    onViewEdit: (id: string) => void;
    onEditJobApplication: (jobApplicationId: string) => void;
    onEditSkill: (skillId: string) => void;
}

function CandidateDetails({
    candidateId,
    onBack,
    onViewFeedback,
    onViewEdit,
    onEditJobApplication,
    onEditSkill
}: CandidateDetailsProps) {
    const [selectedCandidate, setSelectedCandidate] = useState<CandidateOutput | null>(null);
    const [selectedCandidateSkill, setSelectedCandidateSkill] = useState<CandidateSkillOutput[] | null>(null);
    const [selectedJobApplication, setSelectedJobApplication] = useState<JobApplicationOutput[] | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        console.log("Loading Candidate Details for ID:", candidateId);
        loadCandidateDetails();
    }, [candidateId]);

    const loadCandidateDetails = async () => {
        setLoading(true);
        setError(null);
        try {
            const [candidate, candidateSkill, jobApplications] = await Promise.all([
                graphqlService.getCandidateById(candidateId),
                graphqlService.getCandidateSkillByCandidateId(candidateId),
                graphqlService.getJobApplicationsByCandidateId(candidateId),
            ]);
            setSelectedCandidate(candidate);
            setSelectedCandidateSkill(candidateSkill);
            setSelectedJobApplication(jobApplications);

            console.log("Candidate Details Loaded: ", {
                candidate,
                candidateSkill,
                jobApplications
            });
        } catch (error) {
            setError("Failed to load candidate details. Please try again.");
            console.error("Failed to load candidate details:", error);
        } finally {
            setLoading(false);
        }
    };

    const handleStatusUpdate = async () => {
        if (!selectedCandidate) return;

        const newStatus = selectedCandidate.status === CandidateStatus.OPEN
            ? CandidateStatus.CLOSED
            : CandidateStatus.OPEN;

        setLoading(true);
        try {
            const { createdAt, updatedAt, ...updateFields } = selectedCandidate;
            await graphqlService.updateCandidate({ ...updateFields, status: newStatus });
            toast.success(`Candidate status updated to ${newStatus}`);
        } catch (error) {
            console.error("Failed to update candidate status:", error);
            toast.error("Failed to update candidate status");
        } finally {
            loadCandidateDetails();
            setLoading(false);
        }
    };

    const getStatusColor = (status: CandidateOutput["status"]) => {
        const colors = {
            [CandidateStatus.OPEN]: "bg-green-100 text-green-800 hover:bg-green-200",
            [CandidateStatus.CLOSED]: "bg-red-100 text-red-800 hover:bg-red-200",
        };
        return colors[status];
    };

    const getNextStatusText = (currentStatus: CandidateOutput["status"]) => {
        return currentStatus === CandidateStatus.OPEN ? "Close" : "Reopen";
    };

    if (loading) {
        return (
            <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
                <div className="bg-white rounded-lg p-6 flex items-center space-x-3">
                    <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-blue-600"></div>
                    <span>Loading...</span>
                </div>
            </div>
        );
    }

    return (
        <div className="space-y-6">
            {/* Error Popup */}
            {error && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
                    <div className="bg-white rounded-lg p-6 w-full max-w-md mx-4">
                        <div className="flex items-center mb-4">
                            <AlertCircle className="h-6 w-6 text-red-600 mr-3" />
                            <h3 className="text-lg font-semibold text-gray-900">Error</h3>
                        </div>
                        <p className="text-gray-700 mb-6">{error}</p>
                        <div className="flex justify-end space-x-3">
                            <button
                                onClick={() => {
                                    setError(null);
                                    onBack();
                                }}
                                className="py-2 px-4 border border-gray-300 rounded-md text-sm font-medium text-gray-700 bg-white hover:bg-gray-50"
                            >
                                Go Back
                            </button>
                            <button
                                onClick={() => {
                                    setError(null);
                                    loadCandidateDetails();
                                }}
                                className="py-2 px-4 border border-transparent rounded-md text-sm font-medium text-white bg-blue-600 hover:bg-blue-700"
                            >
                                Try Again
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {/* Header */}
            <div className="bg-white shadow rounded-lg p-6">
                <button
                    onClick={onBack}
                    className="cursor-pointer text-blue-600 hover:text-blue-700 text-sm font-medium mb-4 flex items-center"
                >
                    ← Back to Candidates
                </button>

                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                    <div className="flex items-center space-x-4">
                        <div className="h-16 w-16 bg-blue-100 rounded-full flex items-center justify-center">
                            <User className="h-8 w-8 text-blue-600" />
                        </div>
                        <div>
                            <h1 className="text-2xl font-bold text-gray-900">
                                {selectedCandidate?.firstName} {selectedCandidate?.lastName}
                            </h1>
                            <div className="flex items-center space-x-2 mt-1">
                                <button
                                    onClick={handleStatusUpdate}
                                    disabled={loading}
                                    className={`cursor-pointer inline-flex items-center px-3 py-1 rounded-full text-sm font-medium transition-colors disabled:opacity-50 disabled:cursor-not-allowed ${selectedCandidate && getStatusColor(selectedCandidate.status)}`}
                                    title={`Click to ${selectedCandidate ? getNextStatusText(selectedCandidate.status).toLowerCase() : ''} candidate`}
                                >
                                    {selectedCandidate?.status}
                                </button>
                                <span className="text-xs text-gray-500">
                                    Click to {selectedCandidate ? getNextStatusText(selectedCandidate.status).toLowerCase() : ''}
                                </span>
                            </div>
                        </div>
                    </div>

                    <div className="flex">
                        <button
                            onClick={() => onViewEdit(candidateId)}
                            className="cursor-pointer inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700"
                        >
                            <Edit className="h-4 w-4 mr-2" />
                            Edit Candidate
                        </button>
                    </div>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Contact Information */}
                <div className="lg:col-span-2">
                    <div className="bg-white shadow rounded-lg p-6">
                        <h3 className="text-lg font-semibold text-gray-900 mb-4">Contact Information</h3>
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                            <div className="flex items-center space-x-3">
                                <Mail className="h-5 w-5 text-gray-400" />
                                <div>
                                    <p className="text-sm text-gray-500">Email</p>
                                    <p className="text-sm font-medium text-gray-900">{selectedCandidate?.email || 'Not provided'}</p>
                                </div>
                            </div>
                            <div className="flex items-center space-x-3">
                                <Phone className="h-5 w-5 text-gray-400" />
                                <div>
                                    <p className="text-sm text-gray-500">Phone</p>
                                    <p className="text-sm font-medium text-gray-900">{selectedCandidate?.phone || 'Not provided'}</p>
                                </div>
                            </div>
                            <div className="flex items-center space-x-3">
                                <MapPin className="h-5 w-5 text-gray-400" />
                                <div>
                                    <p className="text-sm text-gray-500">Location</p>
                                    <p className="text-sm font-medium text-gray-900">{selectedCandidate?.currentLocation || 'Not provided'}</p>
                                </div>
                            </div>
                            <div className="flex items-center space-x-3">
                                <Globe className="h-5 w-5 text-gray-400" />
                                <div>
                                    <p className="text-sm text-gray-500">Citizenship</p>
                                    <p className="text-sm font-medium text-gray-900">{selectedCandidate?.citizenship || 'Not provided'}</p>
                                </div>
                            </div>
                        </div>

                        {selectedCandidate?.resumeUrl && (
                            <div className="cursor-pointer mt-6 pt-6 border-t border-gray-200">
                                <p className="text-sm text-gray-500 mb-2">Resume</p>

                                <a
                                    href={selectedCandidate.resumeUrl}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="text-blue-600 hover:text-blue-700 text-sm font-medium"
                                >
                                    View Resume →
                                </a>
                            </div>
                        )}
                    </div>
                </div>

                {/* Skills & Education - keeping existing code */}
                <div className="space-y-6">
                    {selectedCandidateSkill && selectedCandidateSkill.map((skill, index) => (
                        <div key={skill.id} className="bg-white shadow rounded-lg p-6">
                            <div className="flex items-center justify-between mb-4">
                                <h3 className="text-lg font-semibold text-gray-900 flex items-center">
                                    <GraduationCap className="h-5 w-5 mr-2 text-blue-600" />
                                    Skills & Education {selectedCandidateSkill.length > 1 && `#${index + 1}`}
                                </h3>
                                <button
                                    onClick={() => onEditSkill(skill.id)}
                                    className="cursor-pointer text-gray-400 hover:text-gray-600"
                                >
                                    <Edit className="h-4 w-4" />
                                </button>
                            </div>

                            <div className="space-y-4">
                                <div>
                                    <p className="text-sm text-gray-500">University</p>
                                    <p className="text-sm font-medium text-gray-900">{skill.university}</p>
                                </div>

                                <div>
                                    <p className="text-sm text-gray-500">Qualification</p>
                                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800 mt-1">
                                        {skill.qualification}
                                    </span>
                                </div>

                                <div className="flex items-center justify-between">
                                    <div>
                                        <p className="text-sm text-gray-500">Proficiency Level</p>
                                        <div className="flex items-center mt-1">
                                            <Award className="h-4 w-4 text-green-600 mr-1" />
                                            <span className="text-sm font-medium text-gray-900">Level {skill.proficiencyLevel}</span>
                                        </div>
                                    </div>

                                    <div>
                                        <p className="text-sm text-gray-500">Experience</p>
                                        <div className="flex items-center mt-1">
                                            <Clock className="h-4 w-4 text-orange-600 mr-1" />
                                            <span className="text-sm font-medium text-gray-900">{skill.yearsOfExperience} years</span>
                                        </div>
                                    </div>
                                </div>

                                {skill.possessedSkills && (
                                    <div>
                                        <p className="text-sm text-gray-500">Possessed Skills</p>
                                        <p className="text-sm text-gray-900 mt-1">{skill.possessedSkills}</p>
                                    </div>
                                )}
                            </div>
                        </div>
                    ))}
                </div>
            </div>

            {/* Job Applications - keeping existing code */}
            {
                selectedJobApplication && selectedJobApplication.length > 0 && (
                    <div className="bg-white shadow rounded-lg p-6">
                        <div className="flex items-center justify-between mb-4">
                            <h3 className="text-lg font-semibold text-gray-900">Job Applications</h3>
                        </div>

                        <div className="space-y-4">
                            {selectedJobApplication.map((job) => (
                                <div key={job.id} className="border border-gray-200 rounded-lg p-4">
                                    <div className="flex items-start justify-between">
                                        <div className="flex-1">
                                            <div className="flex flex-wrap gap-2 mb-3">
                                                {job.appliedJob && (
                                                    <span className="inline-flex items-center px-2 py-1 rounded-full bg-indigo-100 text-indigo-800 text-xs">
                                                        {job.appliedJob}
                                                        {job.appliedJob === AppliedJob.OTHER && job.appliedJobOther && `: ${job.appliedJobOther}`}
                                                    </span>
                                                )}
                                                {job.applicationStatus && (
                                                    <span className="inline-flex items-center px-2 py-1 rounded-full bg-yellow-100 text-yellow-800 text-xs">
                                                        {job.applicationStatus}
                                                    </span>
                                                )}
                                            </div>
                                        </div>

                                        <div className="flex space-x-2">
                                            <button
                                                onClick={() => onViewFeedback(job.id)}
                                                className="cursor-pointer inline-flex items-center px-3 py-1.5 text-xs font-medium text-blue-700 bg-blue-100 rounded hover:bg-blue-200"
                                            >
                                                <MessageSquare className="h-3 w-3 mr-1" />
                                                Feedback
                                            </button>
                                            <button
                                                onClick={() => onEditJobApplication(job.id)}
                                                className="cursor-pointer text-gray-400 hover:text-gray-600"
                                            >
                                                <Edit className="h-4 w-4" />
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                )
            }
        </div >
    );
}

export default CandidateDetails;