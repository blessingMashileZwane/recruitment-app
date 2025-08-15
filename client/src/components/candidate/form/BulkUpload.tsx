import { toast } from 'sonner';
import { candidateService } from '../../../services/candidateService';

interface BulkUploadProps {
    onUploadComplete?: () => void;
}

export function BulkUpload({ onUploadComplete }: BulkUploadProps) {
    const handleBulkUpload = async (file: File) => {
        if (!file) {
            toast.error("No file selected");
            return;
        }

        try {
            await candidateService.processBulkUpload(file);
            onUploadComplete?.();
        } catch (error) {
            // Error is already handled in the service
        }
    };

    return (
        <div className="cursor-pointer m-2 py-2 px-4 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50">
            <label>
                Bulk Upload CSV/Excel
                <input
                    type="file"
                    accept=".csv, application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
                    className="hidden"
                    onChange={(e) => {
                        if (e.target.files?.[0]) {
                            handleBulkUpload(e.target.files[0]);
                        }
                    }}
                />
            </label>
        </div>
    );
}