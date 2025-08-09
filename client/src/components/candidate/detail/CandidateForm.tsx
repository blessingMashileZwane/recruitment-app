import Papa from "papaparse";
import { useState } from 'react';
import { toast } from 'sonner';
import { mockGraphQL } from '../../../mock/mockData';
import type { Candidate } from '../../../types';
import { FormField } from '../../ui/FormField';

type CsvRow = {
    name?: string;
    email?: string;
    position?: string;
    experience?: string;
    skills?: string;
    status?: string;
};

function CandidateForm() {
    const [loading, setLoading] = useState(false);

    const [candidateForm, setCandidateForm] = useState({
        name: "",
        email: "",
        position: "",
        experience: 0,
        skills: "",
        status: "screening" as Candidate["status"],
    });

    const handleAddCandidate = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);

        try {
            await mockGraphQL.addCandidate({
                ...candidateForm,
                skills: candidateForm.skills
                    .split(",")
                    .map((s) => s.trim())
                    .filter((s) => s.length > 0),
            });

            setCandidateForm({
                name: "",
                email: "",
                position: "",
                experience: 0,
                skills: "",
                status: "screening",
            });
        } catch (error) {
            console.error("Failed to add candidate:", error);
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
                const candidates: Candidate[] = [];
                const invalidRows: number[] = [];

                for (const [index, row] of results.data.entries()) {
                    try {
                        const candidate: Candidate = {
                            id: "", // leave empty or generate later
                            name: String(row["name"] || "").trim(),
                            email: String(row["email"] || "").trim(),
                            position: String(row["position"] || "").trim(),
                            experience: Number(row["experience"]) || 0,
                            skills: (String(row["skills"] || "")).split(",").map(s => s.trim()).filter(Boolean),
                            status: String(row["status"] || "screening") as Candidate["status"],
                            addedDate: new Date().toISOString().slice(0, 10), // today’s date as YYYY-MM-DD
                        };

                        // Basic validation example
                        if (!candidate.name || !candidate.email) {
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
                    const { success, failed } = await mockGraphQL.addCandidatesBulk(candidates);

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
                            label="Name"
                            required
                            value={candidateForm.name}
                            onChange={(e) =>
                                setCandidateForm((prev) => ({ ...prev, name: e.target.value }))
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
                            label="Position"
                            required
                            value={candidateForm.position}
                            onChange={(e) =>
                                setCandidateForm((prev) => ({ ...prev, position: e.target.value }))
                            }
                        />

                        <FormField
                            label="Experience (years)"
                            type="number"
                            min={0}
                            value={candidateForm.experience}
                            onChange={(e) =>
                                setCandidateForm((prev) => ({
                                    ...prev,
                                    experience: parseInt(e.target.value) || 0
                                }))
                            }
                        />
                    </div>

                    <FormField
                        label="Skills (comma-separated)"
                        placeholder="React, TypeScript, Node.js"
                        value={candidateForm.skills}
                        onChange={(e) =>
                            setCandidateForm((prev) => ({ ...prev, skills: e.target.value }))
                        }
                    />

                    <FormField
                        label="Initial Status"
                        value={candidateForm.status}
                        onChange={(e) =>
                            setCandidateForm((prev) => ({
                                ...prev,
                                status: e.target.value as Candidate["status"]
                            }))
                        }
                        options={[
                            { value: "screening", label: "Screening" },
                            { value: "technical", label: "Technical" },
                            { value: "final", label: "Final" },
                            { value: "hired", label: "Hired" },
                            { value: "rejected", label: "Rejected" }
                        ]}
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
