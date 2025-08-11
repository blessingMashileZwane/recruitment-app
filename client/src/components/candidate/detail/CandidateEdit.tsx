import { useEffect, useState } from "react";
import type { Candidate } from "../../../types";
import { graphqlService } from "../../../services/graphql.service";

type CandidateEditProps = {
    candidateId: string;
    onCancel: (candidateId: string) => void;
    onSave: (updatedCandidate: Candidate) => void;
};

const statuses = ["screening", "technical", "final", "hired", "rejected"];

export default function CandidateEdit({ candidateId, onCancel, onSave }: CandidateEditProps) {
    const [candidate, setCandidate] = useState<Candidate | null>(null);
    const [loading, setLoading] = useState(false);
    const [formData, setFormData] = useState({
        name: "",
        email: "",
        position: "",
        experience: 0,
        status: "screening",
        skills: "",
    });

    useEffect(() => {
        const loadCandidate = async () => {
            setLoading(true);
            try {
                const data = await graphqlService.getCandidateById(candidateId);
                setCandidate(data);
                setFormData({
                    name: data.name,
                    email: data.email,
                    position: data.position,
                    experience: data.experience,
                    status: data.status,
                    skills: data.skills.join(", "),
                });
            } catch (err) {
                console.error("Failed to load candidate", err);
            } finally {
                setLoading(false);
            }
        };
        loadCandidate();
    }, [candidateId]);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
        const { name, value } = e.target;
        setFormData((prev) => ({
            ...prev,
            [name]: name === "experience" ? Number(value) : value,
        }));
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!candidate) return;

        const updatedCandidate: Candidate = {
            ...candidate,
            name: formData.name,
            email: formData.email,
            position: formData.position,
            experience: formData.experience,
            status: formData.status as Candidate["status"],
            skills: formData.skills.split(",").map((s) => s.trim()).filter(Boolean),
        };

        try {
            await graphqlService.updateCandidate(updatedCandidate);
            onSave(updatedCandidate);
        } catch (err) {
            console.error("Failed to save candidate", err);
        }
    };

    if (loading) return <p>Loading candidate...</p>;
    if (!candidate) return <p>Candidate not found</p>;

    return (
        <div className="max-w-xl mx-auto bg-white p-6 rounded shadow">
            <h2 className="text-xl font-semibold mb-4">Edit Candidate</h2>
            <form onSubmit={handleSubmit} className="space-y-4">
                <label className="block">
                    <span className="text-gray-700">Name</span>
                    <input
                        name="name"
                        type="text"
                        value={formData.name}
                        onChange={handleChange}
                        required
                        className="mt-1 block w-full border rounded p-2"
                    />
                </label>

                <label className="block">
                    <span className="text-gray-700">Email</span>
                    <input
                        name="email"
                        type="email"
                        value={formData.email}
                        onChange={handleChange}
                        required
                        className="mt-1 block w-full border rounded p-2"
                    />
                </label>

                <label className="block">
                    <span className="text-gray-700">Position</span>
                    <input
                        name="position"
                        type="text"
                        value={formData.position}
                        onChange={handleChange}
                        required
                        className="mt-1 block w-full border rounded p-2"
                    />
                </label>

                <label className="block">
                    <span className="text-gray-700">Experience (years)</span>
                    <input
                        name="experience"
                        type="number"
                        min={0}
                        value={formData.experience}
                        onChange={handleChange}
                        required
                        className="mt-1 block w-full border rounded p-2"
                    />
                </label>

                <label className="block">
                    <span className="text-gray-700">Status</span>
                    <select
                        name="status"
                        value={formData.status}
                        onChange={handleChange}
                        required
                        className="mt-1 block w-full border rounded p-2"
                    >
                        {statuses.map((s) => (
                            <option key={s} value={s}>
                                {s.charAt(0).toUpperCase() + s.slice(1)}
                            </option>
                        ))}
                    </select>
                </label>

                <label className="block">
                    <span className="text-gray-700">Skills (comma separated)</span>
                    <textarea
                        name="skills"
                        value={formData.skills}
                        onChange={handleChange}
                        rows={3}
                        className="mt-1 block w-full border rounded p-2"
                        placeholder="e.g. React, TypeScript, Node.js"
                    />
                </label>

                <div className="flex justify-between">
                    <button
                        type="button"
                        onClick={() => onCancel(candidateId)}
                        className="px-4 py-2 border rounded bg-gray-200 hover:bg-gray-300"
                    >
                        Cancel
                    </button>
                    <button
                        type="submit"
                        className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
                    >
                        Save
                    </button>
                </div>
            </form>
        </div>
    );
}
