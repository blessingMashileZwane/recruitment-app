import { Plus } from 'lucide-react';
import { JobCard } from './JobCard';
import type { JobData } from '../../../types/candidate';

interface JobsSectionProps {
    jobs: JobData[];
    onAddJob: () => void;
    onEditJob: (index: number) => void;
    onDeleteJob: (index: number) => void;
}

export function JobsSection({ jobs, onAddJob, onEditJob, onDeleteJob }: JobsSectionProps) {
    return (
        <div className="bg-white shadow rounded-lg p-6 mb-6">
            <div className="flex justify-between items-center mb-4">
                <h3 className="text-lg font-semibold text-gray-900">Job Applications</h3>
                <button
                    type="button"
                    onClick={onAddJob}
                    className="inline-flex items-center py-2 px-3 border border-transparent rounded-md text-sm font-medium text-white bg-purple-600 hover:bg-purple-700"
                >
                    <Plus className="h-4 w-4 mr-2" />
                    Add Job
                </button>
            </div>

            {jobs.length === 0 ? (
                <p className="text-gray-500 text-center py-8">No job applications added yet</p>
            ) : (
                <div className="grid gap-4 sm:grid-cols-2">
                    {jobs.map((job, index) => (
                        <JobCard
                            key={index}
                            job={job}
                            index={index}
                            onEdit={onEditJob}
                            onDelete={onDeleteJob}
                        />
                    ))}
                </div>
            )}
        </div>
    );
}