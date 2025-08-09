import { Eye, MessageSquare, User } from "lucide-react";
import type { Candidate } from "../../types";

function CandidateItem({
    candidate,
    onViewDetails,
    onViewFeedback
}: {
    candidate: Candidate;
    onViewDetails: (id: string) => void;
    onViewFeedback: (id: string) => void;
}) {
    const getStatusColor = (status: Candidate['status']) => {
        const colors = {
            screening: 'bg-yellow-100 text-yellow-800',
            technical: 'bg-blue-100 text-blue-800',
            final: 'bg-purple-100 text-purple-800',
            hired: 'bg-green-100 text-green-800',
            rejected: 'bg-red-100 text-red-800'
        };
        return colors[status];
    };

    return (
        <li className="px-6 py-4 hover:bg-gray-50">
            <div className="flex items-center justify-between">
                <div className="flex items-center">
                    <div className="flex-shrink-0 h-10 w-10">
                        <div className="h-10 w-10 rounded-full bg-gray-200 flex items-center justify-center">
                            <User className="h-6 w-6 text-gray-500" />
                        </div>
                    </div>
                    <div className="ml-4">
                        <div className="flex items-center">
                            <p className="text-sm font-medium text-gray-900">{candidate.name}</p>
                            <span className={`ml-2 inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusColor(candidate.status)}`}>
                                {candidate.status}
                            </span>
                        </div>
                        <div className="mt-1">
                            <p className="text-sm text-gray-600">{candidate.position}</p>
                            <p className="text-xs text-gray-500">{candidate.email} • {candidate.experience} years exp</p>
                        </div>
                        <div className="mt-1 flex flex-wrap gap-1">
                            {candidate.skills.slice(0, 3).map((skill, index) => (
                                <span key={index} className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-gray-100 text-gray-700">
                                    {skill}
                                </span>
                            ))}
                            {candidate.skills.length > 3 && (
                                <span className="text-xs text-gray-500">+{candidate.skills.length - 3} more</span>
                            )}
                        </div>
                    </div>
                </div>
                <div className="flex items-center space-x-2">
                    <button
                        onClick={() => onViewDetails(candidate.id)}
                        className="inline-flex items-center px-3 py-2 border border-gray-300 shadow-sm text-xs font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50"
                    >
                        <Eye className="h-3 w-3 mr-1" />
                        View
                    </button>
                    <button
                        onClick={() => onViewFeedback(candidate.id)}
                        className="inline-flex items-center px-3 py-2 border border-gray-300 shadow-sm text-xs font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50"
                    >
                        <MessageSquare className="h-3 w-3 mr-1" />
                        Feedback
                    </button>
                </div>
            </div>
        </li>
    );
}

export default CandidateItem;
