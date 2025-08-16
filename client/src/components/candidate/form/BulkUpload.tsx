import { useState } from 'react';
import { toast } from 'sonner';
import { candidateService } from '../../../services/candidateService';
import type { BulkCreateCandidatesOutput } from '../../../types';

interface BulkUploadProps {
    onUploadComplete?: () => void;
    onLoading?: (isLoading: boolean) => void;
}

interface UploadProgress {
    isVisible: boolean;
    fileName: string;
    processed: number;
    total: number;
    successCount: number;
    failureCount: number;
}

export function BulkUpload({ onUploadComplete, onLoading }: BulkUploadProps) {
    const [isLoading, setIsLoading] = useState(false);
    const [progress, setProgress] = useState<UploadProgress>({
        isVisible: false,
        fileName: '',
        processed: 0,
        total: 0,
        successCount: 0,
        failureCount: 0
    });

    const handleBulkUpload = async (file: File) => {
        if (!file) {
            toast.error("No file selected");
            return;
        }

        setIsLoading(true);
        onLoading?.(true);

        // Initialize progress
        setProgress({
            isVisible: true,
            fileName: file.name,
            processed: 0,
            total: 0,
            successCount: 0,
            failureCount: 0
        });

        try {
            const result: BulkCreateCandidatesOutput = await candidateService.processBulkUpload(
                file,
                (progressData) => {
                    setProgress(prev => ({
                        ...prev,
                        processed: progressData.processed,
                        total: progressData.total,
                        successCount: progressData.successCount,
                        failureCount: progressData.failureCount
                    }));
                }
            );

            // Show final results
            if (result.successCount > 0) {
                toast.success(
                    `Successfully uploaded ${result.successCount} candidates` +
                    (result.failureCount > 0 ? ` (${result.failureCount} failed)` : ""),
                    { duration: 5000 }
                );
            }

            if (result.failureCount > 0) {
                toast.warning(
                    `${result.failureCount} candidates failed to upload. Check console for details.`,
                    { duration: 7000 }
                );
                console.log("Failed uploads:", result.failed);
            }

            onUploadComplete?.();

        } catch (error) {
            console.error('Error processing bulk upload:', error);
            toast.error("Failed to process bulk upload");
        } finally {
            setIsLoading(false);
            onLoading?.(false);

            // Keep progress visible for 3 seconds after completion
            setTimeout(() => {
                setProgress(prev => ({ ...prev, isVisible: false }));
            }, 3000);
        }
    };

    const progressPercentage = progress.total > 0
        ? Math.round((progress.processed / progress.total) * 100)
        : 0;

    return (
        <>
            <div className={`cursor-pointer m-2 py-2 px-4 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 ${isLoading ? 'opacity-50 cursor-not-allowed' : ''
                }`}>
                <label className={isLoading ? 'cursor-not-allowed' : 'cursor-pointer'}>
                    {isLoading ? (
                        <span className="flex items-center">
                            <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-gray-700" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                            </svg>
                            Uploading...
                        </span>
                    ) : (
                        "Bulk Upload CSV/Excel"
                    )}
                    <input
                        type="file"
                        accept=".csv, application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
                        className="hidden"
                        disabled={isLoading}
                        onChange={(e) => {
                            if (e.target.files?.[0] && !isLoading) {
                                handleBulkUpload(e.target.files[0]);
                            }
                        }}
                    />
                </label>
            </div>

            {/* Progress Modal */}
            {progress.isVisible && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
                    <div className="bg-white rounded-lg p-6 max-w-md w-full mx-4">
                        <h3 className="text-lg font-semibold mb-4">Uploading Candidates</h3>

                        <div className="mb-4">
                            <p className="text-sm text-gray-600 mb-2">File: {progress.fileName}</p>

                            {/* Progress Bar */}
                            <div className="w-full bg-gray-200 rounded-full h-2.5">
                                <div
                                    className="bg-blue-600 h-2.5 rounded-full transition-all duration-300"
                                    style={{ width: `${progressPercentage}%` }}
                                ></div>
                            </div>

                            <div className="flex justify-between text-sm text-gray-600 mt-2">
                                <span>{progress.processed} / {progress.total}</span>
                                <span>{progressPercentage}%</span>
                            </div>
                        </div>

                        {/* Stats */}
                        <div className="grid grid-cols-2 gap-4 text-sm">
                            <div className="text-center">
                                <div className="text-green-600 font-semibold text-lg">{progress.successCount}</div>
                                <div className="text-gray-600">Successful</div>
                            </div>
                            <div className="text-center">
                                <div className="text-red-600 font-semibold text-lg">{progress.failureCount}</div>
                                <div className="text-gray-600">Failed</div>
                            </div>
                        </div>

                        {!isLoading && (
                            <button
                                onClick={() => setProgress(prev => ({ ...prev, isVisible: false }))}
                                className="mt-4 w-full py-2 px-4 bg-blue-600 text-white rounded hover:bg-blue-700"
                            >
                                Close
                            </button>
                        )}
                    </div>
                </div>
            )}
        </>
    );
}