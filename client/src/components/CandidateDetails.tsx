import { useState } from "react";
import type { Candidate } from "../types";

function CandidateDetails() {
    const [currentView, setCurrentView] = useState<
        "candidates" | "add-candidate" | "candidate-detail" | "feedback"
    >("candidates");
    const [selectedCandidate, setSelectedCandidate] = useState<Candidate | null>(
        null
    );

    const getStatusColor = (status: Candidate["status"]) => {
        const colors = {
            screening: "bg-yellow-100 text-yellow-800",
            technical: "bg-blue-100 text-blue-800",
            final: "bg-purple-100 text-purple-800",
            hired: "bg-green-100 text-green-800",
            rejected: "bg-red-100 text-red-800",
        };
        return colors[status];
    };

    return (
        <div>
            <div className="mb-6">
                <button
                    onClick={() => setCurrentView('candidates')}
                    className="text-blue-600 hover:text-blue-700 text-sm font-medium mb-4"
                >
                    ← Back to candidates
                </button>
                <h2 className="text-2xl font-bold text-gray-900">{selectedCandidate?.name}</h2>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                <div className="lg:col-span-2">
                    <div className="bg-white shadow rounded-lg p-6 mb-6">
                        <h3 className="text-lg font-medium text-gray-900 mb-4">Candidate Information</h3>
                        <dl className="grid grid-cols-1 gap-x-4 gap-y-6 sm:grid-cols-2">
                            <div>
                                <dt className="text-sm font-medium text-gray-500">Email</dt>
                                <dd className="mt-1 text-sm text-gray-900">{selectedCandidate?.email}</dd>
                            </div>
                            <div>
                                <dt className="text-sm font-medium text-gray-500">Position</dt>
                                <dd className="mt-1 text-sm text-gray-900">{selectedCandidate?.position}</dd>
                            </div>
                            <div>
                                <dt className="text-sm font-medium text-gray-500">Experience</dt>
                                <dd className="mt-1 text-sm text-gray-900">{selectedCandidate?.experience} years</dd>
                            </div>
                            <div>
                                <dt className="text-sm font-medium text-gray-500">Status</dt>
                                <dd className="mt-1">
                                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${selectedCandidate && getStatusColor(selectedCandidate?.status)}`}>
                                        {selectedCandidate?.status}
                                    </span>
                                </dd>
                            </div>
                            <div className="sm:col-span-2">
                                <dt className="text-sm font-medium text-gray-500">Skills</dt>
                                <dd className="mt-1 text-sm text-gray-900">
                                    <div className="flex flex-wrap gap-2 mt-2">
                                        {selectedCandidate?.skills.map((skill, index) => (
                                            <span
                                                key={index}
                                                className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800"
                                            >
                                                {skill}
                                            </span>
                                        ))}
                                    </div>
                                </dd>
                            </div>
                        </dl>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default CandidateDetails;
