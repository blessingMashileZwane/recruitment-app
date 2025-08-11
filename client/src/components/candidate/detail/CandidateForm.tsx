import Papa from "papaparse";
import { useState } from 'react';
import { toast } from 'sonner';
import { graphqlService } from '../../../services/graphql.service';
import { AppliedJob, CandidateStatus } from "../../../types/enums";
import type { CreateCandidateInput } from "../../../types/inputs";
import { FormField } from '../../ui/FormField';

type CsvRow = {
    firstName?: string;
    lastName?: string;
    email?: string;
    phone?: string;
    resumeUrl?: string;
    currentLocation?: string;
    citizenship?: string;
    university?: string;
    qualification?: string;
    proficiencyLevel?: string;
    jobTitle?: string;
    department?: string;
    status?: string;
    title?: string;
    description?: string;
    isActive?: string | boolean;
};

function CandidateForm() {
    const [loading, setLoading] = useState(false);

    const [candidateForm, setCandidateForm] = useState<CreateCandidateInput>({
        firstName: "",
        lastName: "",
        email: "",
        phone: "",
        currentLocation: "",
        citizenship: "",
        status: CandidateStatus.ACTIVE,
        resumeUrl: "",
        candidateSkill: {
            university: "",
            qualification: "",
            proficiencyLevel: 1
        },
        jobApplication: {
            title: "",
            status: AppliedJob.TECH,
            department: "",
            description: "",
            isActive: true
        }
    });

    const handleAddCandidate = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);

        try {
            await graphqlService.addCandidate(candidateForm);

            setCandidateForm({
                firstName: "",
                lastName: "",
                email: "",
                phone: "",
                currentLocation: "",
                citizenship: "",
                status: CandidateStatus.ACTIVE,
                resumeUrl: "",
                candidateSkill: {
                    university: "",
                    qualification: "",
                    proficiencyLevel: 1
                },
                jobApplication: {
                    title: "",
                    status: AppliedJob.TECH,
                    department: "",
                    description: "",
                    isActive: true
                }
            });
            toast.success("Candidate added successfully");
        } catch (error) {
            console.error("Failed to add candidate:", error);
            toast.error("Failed to add candidate");
        } finally {
            setLoading(false);
        }
    };

    const handleBulkUpload = async (file: File) => {
        if (!file) {
            toast.error("No file selected");
            return;
        }

        Papa.parse<CsvRow>(file, {
            header: true,
            skipEmptyLines: true,
            complete: async (results) => {
                if (results.errors.length) {
                    toast.error(`CSV parsing error: ${results.errors[0].message}`);
                    return;
                }

                // Map and validate parsed data to Candidate[]
                const candidates: CreateCandidateInput[] = [];
                const invalidRows: number[] = [];

                for (const [index, row] of results.data.entries()) {
                    try {
                        const candidate: CreateCandidateInput = {
                            firstName: String(row["firstName"] || "").trim(),
                            lastName: String(row["lastName"] || "").trim(),
                            email: String(row["email"] || "").trim(),
                            phone: String(row["phone"] || "").trim(),
                            currentLocation: String(row["currentLocation"] || "").trim(),
                            citizenship: String(row["citizenship"] || "").trim(),
                            status: String(row["status"] || "active") as CandidateStatus,
                            resumeUrl: String(row["resumeUrl"] || "").trim(),
                            candidateSkill: {
                                university: String(row["university"] || "").trim(),
                                qualification: String(row["qualification"] || "").trim(),
                                proficiencyLevel: Number(row["proficiencyLevel"]) || 1
                            },
                            jobApplication: {
                                title: String(row["title"] || "").trim(),
                                status: String(row["status"] || "applied") as AppliedJob,
                                department: String(row["department"] || "").trim(),
                                description: String(row["description"] || "").trim(),
                                isActive: Boolean(row["isActive"]) || true
                            }
                        };

                        // Basic validation example
                        if (!candidate.firstName || !candidate.email) {
                            invalidRows.push(index + 2); // +2 for header and zero-index
                            continue;
                        }

                        candidates.push(candidate);
                    } catch {
                        invalidRows.push(index + 2);
                    }
                }

                if (invalidRows.length > 0) {
                    toast.error(`Invalid rows at: ${invalidRows.join(", ")}`);
                    return;
                }

                try {
                    // Call your API to save candidates in bulk
                    const { success, failed } = await graphqlService.addCandidatesBulk(candidates);

                    toast.success(
                        `Upload complete. Saved: ${success.length}. Failed: ${failed.length}` +
                        (failed.length > 0 ? `. Failed emails: ${failed.map(f => f.email).join(", ")}` : "")
                    );
                } catch (error) {
                    toast.error("Failed to save candidates: " + (error as Error).message);
                }
            },
            error: (error) => {
                toast.error("Failed to parse file: " + error.message);
            },
        });
    };

    return (
        <>
            {loading && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
                    <div className="bg-white rounded-lg p-6 flex items-center space-x-3">
                        <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-blue-600"></div>
                        <span>Loading...</span>
                    </div>
                </div>
            )}

            <div className="flex justify-center flex-col items-center p-6">
                <h2 className="text-2xl font-bold text-gray-900 mb-6">
                    Add New Candidate
                </h2>

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

                <form
                    onSubmit={handleAddCandidate}
                    className="bg-white shadow rounded-lg p-6 space-y-6 w-full max-w-xl"
                >
                    <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
                        <FormField
                            label="First Name"
                            required
                            value={candidateForm.firstName}
                            onChange={(e) =>
                                setCandidateForm((prev) => ({ ...prev, firstName: e.target.value }))
                            }
                        />

                        <FormField
                            label="Last Name"
                            required
                            value={candidateForm.lastName}
                            onChange={(e) =>
                                setCandidateForm((prev) => ({ ...prev, lastName: e.target.value }))
                            }
                        />

                        <FormField
                            label="Email"
                            type="email"
                            required
                            value={candidateForm.email}
                            onChange={(e) =>
                                setCandidateForm((prev) => ({ ...prev, email: e.target.value }))
                            }
                        />

                        <FormField
                            label="Phone"
                            type="tel"
                            value={candidateForm.phone || ""}
                            onChange={(e) =>
                                setCandidateForm((prev) => ({ ...prev, phone: e.target.value }))
                            }
                        />
                    </div>

                    <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
                        <FormField
                            label="Current Location"
                            value={candidateForm.currentLocation || ""}
                            onChange={(e) =>
                                setCandidateForm((prev) => ({ ...prev, currentLocation: e.target.value }))
                            }
                        />

                        <FormField
                            label="Citizenship"
                            value={candidateForm.citizenship || ""}
                            onChange={(e) =>
                                setCandidateForm((prev) => ({ ...prev, citizenship: e.target.value }))
                            }
                        />
                    </div>

                    <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
                        <FormField
                            label="University"
                            value={candidateForm.candidateSkill.university}
                            onChange={(e) =>
                                setCandidateForm((prev) => ({
                                    ...prev,
                                    candidateSkill: { ...prev.candidateSkill, university: e.target.value }
                                }))
                            }
                        />

                        <FormField
                            label="Qualification"
                            value={candidateForm.candidateSkill.qualification}
                            onChange={(e) =>
                                setCandidateForm((prev) => ({
                                    ...prev,
                                    candidateSkill: { ...prev.candidateSkill, qualification: e.target.value }
                                }))
                            }
                        />
                    </div>

                    <FormField
                        label="Job Title"
                        required
                        value={candidateForm.jobApplication.title}
                        onChange={(e) =>
                            setCandidateForm((prev) => ({
                                ...prev,
                                jobApplication: { ...prev.jobApplication, title: e.target.value }
                            }))
                        }
                    />

                    <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
                        <FormField
                            label="Department"
                            value={candidateForm.jobApplication.department || ""}
                            onChange={(e) =>
                                setCandidateForm((prev) => ({
                                    ...prev,
                                    jobApplication: { ...prev.jobApplication, department: e.target.value }
                                }))
                            }
                        />

                        <FormField
                            label="Status"
                            value={candidateForm.status}
                            onChange={(e) =>
                                setCandidateForm((prev) => ({
                                    ...prev,
                                    status: e.target.value as CandidateStatus
                                }))
                            }
                            options={Object.entries(CandidateStatus).map(([key, value]) => ({
                                value: value,
                                label: key
                            }))}
                        />
                    </div>

                    <FormField
                        label="Resume URL"
                        type="url"
                        placeholder="https://..."
                        value={candidateForm.resumeUrl || ""}
                        onChange={(e) =>
                            setCandidateForm((prev) => ({ ...prev, resumeUrl: e.target.value }))
                        }
                    />

                    <div className="flex justify-end space-x-3">
                        <button
                            type="button"
                            className="py-2 px-4 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50"
                        >
                            Cancel
                        </button>
                        <button
                            type="submit"
                            className="py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700"
                        >
                            Add Candidate
                        </button>
                    </div>
                </form>
            </div>
        </>
    );
}

export default CandidateForm;
