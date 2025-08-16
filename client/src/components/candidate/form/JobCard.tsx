import { Check, Edit, Trash2 } from 'lucide-react';
import { AppliedJob, AppliedJobStatus } from '../../../types/enums';
import type { CreateJobApplicationInput } from '../../../types/inputs';

interface JobCardProps {
    job: CreateJobApplicationInput;
    index: number;
    onEdit: (index: number) => void;
    onDelete: (index: number) => void;
}

export function JobCard({ job, index, onEdit, onDelete }: JobCardProps) {
    const formatJobType = (appliedJob?: AppliedJob) => {
        if (!appliedJob) return '';
        return appliedJob.charAt(0).toUpperCase() + appliedJob.slice(1).toLowerCase();
    };

    const formatApplicationStatus = (status?: AppliedJobStatus) => {
        if (!status) return '';
        return status.charAt(0).toUpperCase() + status.slice(1).toLowerCase();
    };

    const getStatusColor = (status?: AppliedJobStatus) => {
        switch (status) {
            case AppliedJobStatus.ACTIVE:
                return 'bg-green-100 text-green-800';
            case AppliedJobStatus.HIRED:
                return 'bg-purple-100 text-purple-800';
            case AppliedJobStatus.REJECTED:
                return 'bg-red-100 text-red-800';
            case AppliedJobStatus.WITHDRAWN:
                return 'bg-gray-100 text-gray-800';
            default:
                return 'bg-gray-100 text-gray-800';
        }
    };

    return (
        <div className="border border-gray-200 rounded-lg p-4">
            <div className="flex justify-between items-start mb-2">
                <div className="flex-1">

                    <div className="mt-2 flex flex-wrap gap-2">
                        {job.appliedJob && (
                            <span className="inline-flex items-center px-2 py-1 rounded-full bg-indigo-100 text-indigo-800 text-xs">
                                {formatJobType(job.appliedJob)}
                            </span>
                        )}

                        {job.appliedJob === AppliedJob.OTHER && job.appliedJobOther && (
                            <span className="inline-flex items-center px-2 py-1 rounded-full bg-gray-100 text-gray-800 text-xs">
                                {job.appliedJobOther}
                            </span>
                        )}

                        {job.applicationStatus && (
                            <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs ${getStatusColor(job.applicationStatus)}`}>
                                {formatApplicationStatus(job.applicationStatus)}
                            </span>
                        )}

                        {job.isActive && (
                            <span className="inline-flex items-center px-2 py-1 rounded-full bg-green-100 text-green-800 text-xs">
                                <Check className="h-3 w-3 mr-1" />
                                Active
                            </span>
                        )}
                    </div>
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