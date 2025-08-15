import { X } from 'lucide-react';
import { toast } from 'sonner';
import type { JobData } from '../../../types/candidate';
import { AppliedJob } from '../../../types/enums';
import { FormField } from '../../ui/FormField';

interface JobModalProps {
    isOpen: boolean;
    job: JobData;
    isEditing: boolean;
    onClose: () => void;
    onSubmit: (job: JobData) => void;
    onJobChange: (updater: (prev: JobData) => JobData) => void;
}

export function JobModal({
    isOpen,
    job,
    isEditing,
    onClose,
    onSubmit,
    onJobChange
}: JobModalProps) {
    if (!isOpen) return null;

    const handleSubmit = () => {
        if (!job.title || !job.department) {
            toast.error("Job title and department are required");
            return;
        }
        onSubmit(job);
    };

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-40">
            <div className="bg-white rounded-lg p-6 w-full max-w-md">
                <div className="flex justify-between items-center mb-4">
                    <h3 className="text-lg font-semibold">
                        {isEditing ? 'Edit Job Application' : 'Add Job Application'}
                    </h3>
                    <button onClick={onClose} className="text-gray-400 hover:text-gray-600">
                        <X className="h-6 w-6" />
                    </button>
                </div>

                <div className="space-y-4">
                    <FormField
                        label="Job Title"
                        required
                        value={job.title}
                        onChange={(e) => onJobChange(prev => ({ ...prev, title: e.target.value }))}
                    />
                    <FormField
                        label="Department"
                        required
                        value={job.department || ""}
                        onChange={(e) => onJobChange(prev => ({ ...prev, department: e.target.value }))}
                    />
                    <FormField
                        label="Applied Job Type"
                        value={job.appliedJob || AppliedJob.TECH}
                        onChange={(e) => onJobChange(prev => ({ ...prev, appliedJob: e.target.value as AppliedJob }))}
                        options={Object.entries(AppliedJob).map(([key, value]) => ({
                            value: value,
                            label: key.charAt(0) + key.slice(1).toLowerCase()
                        }))}
                    />
                    <FormField
                        label="Requirements"
                        value={job.requirements || ""}
                        onChange={(e) => onJobChange(prev => ({ ...prev, requirements: e.target.value }))}
                    />
                    <div className="flex items-center space-x-2">
                        <input
                            type="checkbox"
                            id="isActive"
                            checked={job.isActive}
                            onChange={(e) => onJobChange(prev => ({ ...prev, isActive: e.target.checked }))}
                            className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                        />
                        <label htmlFor="isActive" className="text-sm font-medium text-gray-700">
                            Active Application
                        </label>
                    </div>
                </div>

                <div className="flex justify-end space-x-3 mt-6">
                    <button
                        type="button"
                        onClick={onClose}
                        className="py-2 px-4 border border-gray-300 rounded-md text-sm font-medium text-gray-700 bg-white hover:bg-gray-50"
                    >
                        Cancel
                    </button>
                    <button
                        type="button"
                        onClick={handleSubmit}
                        className="py-2 px-4 border border-transparent rounded-md text-sm font-medium text-white bg-blue-600 hover:bg-blue-700"
                    >
                        {isEditing ? 'Update' : 'Add'} Job
                    </button>
                </div>
            </div>
        </div>
    );
}