import { useEffect, useState } from "react";
import { graphqlService } from "../../../services/graphql.service";
import type { CandidateOutput } from "../../../types/outputs";
import { CandidateStatus } from "../../../types/enums";

type CandidateDetails = {
    candidateId: string;
    onBack: () => void;
    onViewFeedback: (id: string) => void;
    onViewEdit: (id: string) => void
}

function CandidateDetails({ candidateId, onBack, onViewFeedback, onViewEdit }: CandidateDetails) {
    const [selectedCandidate, setSelectedCandidate] = useState<CandidateOutput | null>(
        null
    );
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const loadCandidateDetails = async () => {
            setLoading(true);
            try {
                const candidate = await graphqlService.getCandidateById(candidateId);
                setSelectedCandidate(candidate);
            } catch (error) {
                console.error("Failed to load candidate details:", error);
            }
            finally {
                setLoading(false);
            }
        };

        loadCandidateDetails();
    }, [candidateId]);

    const getStatusColor = (status: CandidateOutput["status"]) => {
        const colors = {
            [CandidateStatus.OPEN]: "bg-green-100 text-green-800",
            [CandidateStatus.CLOSED]: "bg-red-100 text-red-800",
        };
        return colors[status];
    };

    return (
        <>
            {loading ? (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
                    <div className="bg-white rounded-lg p-6 flex items-center space-x-3">
                        <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-blue-600"></div>
                        <span>Loading...</span>
                    </div>
                </div>
            ) :
                <>
                    <div className="bg-white shadow rounded-lg p-6">
                        <button
                            onClick={onBack}
                            className="text-blue-600 hover:text-blue-700 text-sm font-medium mb-4"
                        >
                            ← Back to Candidates
                        </button>

                        <div className="flex justify-between items-center mb-4">
                            <h1 className="font-bold">{selectedCandidate?.firstName} {selectedCandidate?.lastName}</h1>
                            <button
                                onClick={() => onViewFeedback(candidateId)}
                                className="inline-flex items-center px-3 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700"
                            >
                                View Feedback
                            </button>
                        </div>

                        <div className="grid grid-cols-1 lg:grid">
                            <div className="lg:col-span-2">
                                <div className="">
                                    <h3 className="text-lg font-medium text-gray-900 mb-4">Candidate Information</h3>
                                    <dl className="grid grid-cols-1 gap-x-4 gap-y-6 sm:grid-cols-2">
                                        <div>
                                            <dt className="text-sm font-medium text-gray-500">Email</dt>
                                            <dd className="mt-1 text-sm text-gray-900">{selectedCandidate?.email}</dd>
                                        </div>
                                        <div>
                                            <dt className="text-sm font-medium text-gray-500">Phone</dt>
                                            <dd className="mt-1 text-sm text-gray-900">{selectedCandidate?.phone}</dd>
                                        </div>
                                        <div>
                                            <dt className="text-sm font-medium text-gray-500">Location</dt>
                                            <dd className="mt-1 text-sm text-gray-900">{selectedCandidate?.currentLocation}</dd>
                                        </div>
                                        <div>
                                            <dt className="text-sm font-medium text-gray-500">Citizenship</dt>
                                            <dd className="mt-1 text-sm text-gray-900">{selectedCandidate?.citizenship}</dd>
                                        </div>
                                        <div>
                                            <dt className="text-sm font-medium text-gray-500">Status</dt>
                                            <dd className="mt-1">
                                                <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${selectedCandidate && getStatusColor(selectedCandidate.status)}`}>
                                                    {selectedCandidate?.status}
                                                </span>
                                            </dd>
                                        </div>
                                        <div>
                                            <dt className="text-sm font-medium text-gray-500">Applied Position</dt>
                                            <dd className="mt-1 text-sm text-gray-900">{selectedCandidate?.jobApplication.title}</dd>
                                        </div>
                                        <div>
                                            <dt className="text-sm font-medium text-gray-500">Department</dt>
                                            <dd className="mt-1 text-sm text-gray-900">{selectedCandidate?.jobApplication.department}</dd>
                                        </div>
                                        <div className="sm:col-span-2">
                                            <dt className="text-sm font-medium text-gray-500">Skills</dt>
                                            <dd className="mt-1 text-sm text-gray-900">
                                                <div className="flex flex-wrap gap-2 mt-2">
                                                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                                                        {selectedCandidate?.candidateSkill.qualification}
                                                    </span>
                                                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                                                        Level: {selectedCandidate?.candidateSkill.proficiencyLevel}
                                                    </span>
                                                </div>
                                            </dd>
                                        </div>
                                        <div className="sm:col-span-2">
                                            <dt className="text-sm font-medium text-gray-500">Education</dt>
                                            <dd className="mt-1 text-sm text-gray-900">{selectedCandidate?.candidateSkill.university}</dd>
                                        </div>
                                    </dl>
                                </div>
                            </div>
                        </div>
                        <div className="flex"><button
                            onClick={() => onViewEdit(candidateId)}
                            className="inline-flex items-center px-3 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700"
                        >
                            Edit Candidate
                        </button></div>
                    </div></>}
        </>
    );
}

export default CandidateDetails;
