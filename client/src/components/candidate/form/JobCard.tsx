import { Edit, Trash2, Check } from 'lucide-react';
import type { JobData } from '../../../types/candidate';

interface JobCardProps {
    job: JobData;
    index: number;
    onEdit: (index: number) => void;
    onDelete: (index: number) => void;
}

export function JobCard({ job, index, onEdit, onDelete }: JobCardProps) {
    // Format the applied job type for display
    const formatJobType = (appliedJob?: string) => {
        if (!appliedJob) return '';
        return appliedJob.charAt(0).toUpperCase() + appliedJob.slice(1).toLowerCase();
    };

    return (
        <div className="border border-gray-200 rounded-lg p-4">
            <div className="flex justify-between items-start mb-2">
                <div className="flex-1">
                    <h4 className="font-medium text-gray-900">{job.title}</h4>
                    <p className="text-sm text-gray-600">{job.department}</p>
                    <div className="mt-2">
                        {job.appliedJob && (
                            <span className="inline-flex items-center px-2 py-1 rounded-full bg-indigo-100 text-indigo-800 text-xs mr-2">
                                {formatJobType(job.appliedJob)}
                            </span>
                        )}
                        {job.isActive && (
                            <span className="inline-flex items-center px-2 py-1 rounded-full bg-green-100 text-green-800 text-xs">
                                <Check className="h-3 w-3 mr-1" />
                                Active
                            </span>
                        )}
                    </div>
                    {job.requirements && (
                        <p className="text-xs text-gray-500 mt-1 line-clamp-2">
                            {job.requirements}
                        </p>
                    )}
                </div>
                <div className="flex space-x-1">
                    <button
                        type="button"
                        onClick={() => onEdit(index)}
                        className="text-blue-600 hover:text-blue-800"
                    >
                        <Edit className="h-4 w-4" />
                    </button>
                    <button
                        type="button"
                        onClick={() => onDelete(index)}
                        className="text-red-600 hover:text-red-800"
                    >
                        <Trash2 className="h-4 w-4" />
                    </button>
                </div>
            </div>
        </div>
    );
}