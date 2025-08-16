import { Eye, User } from "lucide-react";
import type { CandidateOutput } from "../../types/outputs";

function CandidateItem({
    candidate,
    onViewDetails,
}: {
    candidate: CandidateOutput;
    onViewDetails: (id: string) => void;
}) {
    const getStatusColor = (status: CandidateOutput['status']) => {
        const colors: Record<CandidateOutput['status'], string> = {
            OPEN: 'bg-green-100 text-green-800',
            CLOSED: 'bg-red-100 text-red-800',
        };
        return colors[status]
    };

    return (
        <li className="px-6 py-4 hover:bg-gray-50">
            <div className="flex items-start justify-between space-x-4">
                <div className="flex-shrink-0 h-10 w-10">
                    <div className="h-10 w-10 rounded-full bg-gray-200 flex items-center justify-center">
                        <User className="h-6 w-6 text-gray-500" />
                    </div>
                </div>

                <div className="flex-shrink-0">
                    <p className="text-sm font-medium text-gray-900">
                        {candidate.firstName} {candidate.lastName}
                    </p>
                    <span
                        className={`inline-flex items-center px-2.5 py-0.5 mt-1 rounded-full text-xs font-medium ${getStatusColor(candidate.status)}`}
                    >
                        {candidate.status}
                    </span>
                </div>

                <div className="flex flex-col text-sm text-gray-600 space-y-1">
                    <p>Email: {candidate.email}</p>
                    {candidate.phone && <p>Phone: {candidate.phone}</p>}
                </div>

                <div className="flex flex-col text-sm text-gray-600 space-y-1">
                    {candidate.currentLocation && <p>Location: {candidate.currentLocation}</p>}
                    {candidate.citizenship && <p>Citizenship: {candidate.citizenship}</p>}
                </div>

                <div className="flex-shrink-0 flex space-x-2">
                    <button
                        onClick={() => onViewDetails(candidate.id)}
                        className="cursor-pointer inline-flex items-center px-3 py-2 border border-gray-300 shadow-sm text-xs font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50"
                    >
                        <Eye className="h-3 w-3 mr-1" />
                        View
                    </button>
                    {/* <button
                        onClick={() => onViewFeedback(candidate.id)}
                        className="inline-flex items-center px-3 py-2 border border-gray-300 shadow-sm text-xs font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50"
                    >
                        <MessageSquare className="h-3 w-3 mr-1" />
                        Feedback
                    </button> */}
                </div>
            </div>

            <div className="flex flex-col mt-2 space-x-6 text-xs text-gray-500">
                {candidate.resumeUrl && (
                    <a
                        href={candidate.resumeUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-blue-600 underline"
                    >
                        View CV
                    </a>
                )}
                {/* <span>
                    Added by: {candidate.createdBy}
                </span>
                <span>
                    Last updated by: {candidate.updatedBy}
                </span> */}
            </div>
        </li>


    );
}

export default CandidateItem;
