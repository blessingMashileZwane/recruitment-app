import { AlertCircle } from 'lucide-react';
import { useEffect, useState } from 'react';
import { toast } from 'sonner';
import { graphqlService } from '../../../services/graphql.service';
import { AppliedJob, AppliedJobStatus } from '../../../types/enums';
import type { CreateJobApplicationInput, UpdateJobApplicationInput } from '../../../types/inputs';
import { LoadingOverlay } from '../../ui/LoadingOverlay';
import { JobModal } from '../form/JobModal';

interface JobApplicationEditProps {
    jobApplicationId: string;
    candidateId: string;
    onCancel: () => void;
    onSave: (candidateId: string) => void;
}

export function JobApplicationEdit({ jobApplicationId, candidateId, onCancel, onSave }: JobApplicationEditProps) {
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [currentJob, setCurrentJob] = useState<CreateJobApplicationInput>({
        appliedJob: AppliedJob.TECH,
        applicationStatus: AppliedJobStatus.ACTIVE,
        appliedJobOther: "",
        isActive: true,
    });

    useEffect(() => {
        loadJobApplication();
    }, [jobApplicationId]);

    const loadJobApplication = async () => {
        setLoading(true);
        setError(null);
        try {
            const jobApplication = await graphqlService.getJobApplicationById(jobApplicationId);
            if (jobApplication) {
                setCurrentJob({
                    appliedJob: jobApplication.appliedJob || AppliedJob.TECH,
                    applicationStatus: jobApplication.applicationStatus || AppliedJobStatus.ACTIVE,
                    appliedJobOther: jobApplication.appliedJobOther || "",
                    isActive: jobApplication.isActive ?? true,
                });
            } else {
                setError("Job application not found");
            }
        } catch (error) {
            setError("Failed to load job application data");
            console.error("Failed to load job application:", error);
        } finally {
            setLoading(false);
        }
    };

    const handleSubmit = async (job: CreateJobApplicationInput) => {
        setSaving(true);
        setError(null);
        try {
            const updateInput: UpdateJobApplicationInput = {
                id: jobApplicationId,
                ...job
            };

            await graphqlService.updateJobApplication(updateInput);
            toast.success("Job application updated successfully");
            onSave(candidateId);
        } catch (error) {
            setError("Failed to update job application");
            console.error("Failed to update job application:", error);
            toast.error("Failed to update job application");
        } finally {
            setSaving(false);
        }
    };

    if (loading) {
        return <LoadingOverlay isVisible={true} />;
    }

    return (
        <>
            <LoadingOverlay isVisible={saving} />

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
                                onClick={() => setError(null)}
                                className="py-2 px-4 border border-gray-300 rounded-md text-sm font-medium text-gray-700 bg-white hover:bg-gray-50"
                            >
                                Close
                            </button>
                            <button
                                onClick={() => {
                                    setError(null);
                                    loadJobApplication();
                                }}
                                className="py-2 px-4 border border-transparent rounded-md text-sm font-medium text-white bg-blue-600 hover:bg-blue-700"
                            >
                                Try Again
                            </button>
                        </div>
                    </div>
                </div>
            )}

            <JobModal
                isOpen={true}
                job={currentJob}
                isEditing={true}
                onClose={onCancel}
                onSubmit={handleSubmit}
                onJobChange={setCurrentJob}
            />
        </>
    );
}