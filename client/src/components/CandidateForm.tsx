import { useState } from 'react';
import { mockGraphQL } from '../mock/mockData';
import type { Candidate } from '../types';
function CandidateForm() {
    const [loading, setLoading] = useState(false);
    const [candidates, setCandidates] = useState<Candidate[]>([]);
    const [candidateForm, setCandidateForm] = useState({
        name: "",
        email: "",
        position: "",
        experience: 0,
        skills: "",
        status: "screening" as Candidate["status"],
    });

    const [currentView, setCurrentView] = useState<
        "candidates" | "add-candidate" | "candidate-detail" | "feedback"
    >("candidates");

    const handleAddCandidate = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);

        try {
            const newCandidate = await mockGraphQL.addCandidate({
                ...candidateForm,
                skills: candidateForm.skills
                    .split(",")
                    .map((s) => s.trim())
                    .filter((s) => s.length > 0),
            });

            setCandidates((prev) => [...prev, newCandidate]);
            setCandidateForm({
                name: "",
                email: "",
                position: "",
                experience: 0,
                skills: "",
                status: "screening",
            });
            setCurrentView("candidates");
        } catch (error) {
            console.error("Failed to add candidate:", error);
        } finally {
            setLoading(false);
        }
    };


    return (
        <div className="max-w-2xl">
            <h2 className="text-2xl font-bold text-gray-900 mb-6">
                Add New Candidate
            </h2>

            <form
                onSubmit={handleAddCandidate}
                className="bg-white shadow rounded-lg p-6 space-y-6"
            >
                <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
                    <div>
                        <label className="block text-sm font-medium text-gray-700">
                            Name
                        </label>
                        <input
                            type="text"
                            required
                            value={candidateForm.name}
                            onChange={(e) =>
                                setCandidateForm((prev) => ({
                                    ...prev,
                                    name: e.target.value,
                                }))
                            }
                            className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm px-3 py-2 border"
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700">
                            Email
                        </label>
                        <input
                            type="email"
                            required
                            value={candidateForm.email}
                            onChange={(e) =>
                                setCandidateForm((prev) => ({
                                    ...prev,
                                    email: e.target.value,
                                }))
                            }
                            className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm px-3 py-2 border"
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700">
                            Position
                        </label>
                        <input
                            type="text"
                            required
                            value={candidateForm.position}
                            onChange={(e) =>
                                setCandidateForm((prev) => ({
                                    ...prev,
                                    position: e.target.value,
                                }))
                            }
                            className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm px-3 py-2 border"
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700">
                            Experience (years)
                        </label>
                        <input
                            type="number"
                            min="0"
                            value={candidateForm.experience}
                            onChange={(e) =>
                                setCandidateForm((prev) => ({
                                    ...prev,
                                    experience: parseInt(e.target.value) || 0,
                                }))
                            }
                            className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm px-3 py-2 border"
                        />
                    </div>
                </div>

                <div>
                    <label className="block text-sm font-medium text-gray-700">
                        Skills (comma-separated)
                    </label>
                    <input
                        type="text"
                        value={candidateForm.skills}
                        onChange={(e) =>
                            setCandidateForm((prev) => ({
                                ...prev,
                                skills: e.target.value,
                            }))
                        }
                        placeholder="React, TypeScript, Node.js"
                        className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm px-3 py-2 border"
                    />
                </div>

                <div>
                    <label className="block text-sm font-medium text-gray-700">
                        Initial Status
                    </label>
                    <select
                        value={candidateForm.status}
                        onChange={(e) =>
                            setCandidateForm((prev) => ({
                                ...prev,
                                status: e.target.value as Candidate["status"],
                            }))
                        }
                        className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm px-3 py-2 border"
                    >
                        <option value="screening">Screening</option>
                        <option value="technical">Technical</option>
                        <option value="final">Final</option>
                        <option value="hired">Hired</option>
                        <option value="rejected">Rejected</option>
                    </select>
                </div>

                <div className="flex justify-end space-x-3">
                    <button
                        type="button"
                        onClick={() => setCurrentView("candidates")}
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

    )
}

export default CandidateForm;
