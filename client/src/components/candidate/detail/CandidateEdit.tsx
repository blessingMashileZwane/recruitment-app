import { useEffect, useState } from "react";
import { graphqlService } from "../../../services/graphql.service";
import { CandidateStatus } from "../../../types/enums";
import type { UpdateCandidateInput } from "../../../types/inputs";
import type { CandidateOutput } from "../../../types/outputs";

type CandidateEditProps = {
    candidateId: string;
    onCancel: (candidateId: string) => void;
    onSave: (updatedCandidate: CandidateOutput) => void;
};

const statuses = Object.values(CandidateStatus);

export default function CandidateEdit({ candidateId, onCancel, onSave }: CandidateEditProps) {
    const [candidate, setCandidate] = useState<CandidateOutput | null>(null);
    const [loading, setLoading] = useState(false);
    const [formData, setFormData] = useState({
        firstName: "",
        lastName: "",
        email: "",
        phone: "",
        currentLocation: "",
        citizenship: "",
        status: "SCREENING",
        resumeUrl: "",
        candidateSkill: {
            university: "",
            qualification: "",
            proficiencyLevel: 1
        },
        jobApplications: {
            title: "",
            appliedJob: "",
            appliedStatus: "PENDING",
            department: "",
            isActive: true
        }
    });

    useEffect(() => {
        const loadCandidate = async () => {
            console.log(candidateId);
            setLoading(true);
            try {
                const data = await graphqlService.getCandidateById(candidateId);
                setCandidate(data);
                setFormData({
                    firstName: data.firstName,
                    lastName: data.lastName,
                    email: data.email,
                    phone: data.phone || "",
                    currentLocation: data.currentLocation || "",
                    citizenship: data.citizenship || "",
                    status: data.status,
                    resumeUrl: data.resumeUrl || "",
                    candidateSkill: {
                        university: data.candidateSkill.university,
                        qualification: data.candidateSkill.qualification,
                        proficiencyLevel: data.candidateSkill.proficiencyLevel
                    },
                    jobApplications: {
                        title: data.jobApplications.title,
                        appliedJob: data.jobApplications.appliedJob || "",
                        appliedStatus: data.jobApplications.appliedStatus || "",
                        department: data.jobApplications.department || "",
                        isActive: data.jobApplications.isActive
                    }
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

        const updatedCandidate: UpdateCandidateInput = {
            id: candidateId,
            firstName: formData.firstName,
            lastName: formData.lastName,
            email: formData.email,
            phone: formData.phone,
            currentLocation: formData.currentLocation,
            citizenship: formData.citizenship,
            status: formData.status as CandidateStatus,
            resumeUrl: formData.resumeUrl
        };

        try {
            const result = await graphqlService.updateCandidate(updatedCandidate);
            onSave(result);
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
                <div className="grid grid-cols-2 gap-4">
                    <label className="block">
                        <span className="text-gray-700">First Name</span>
                        <input
                            name="firstName"
                            type="text"
                            value={formData.firstName}
                            onChange={handleChange}
                            required
                            className="mt-1 block w-full border rounded p-2"
                        />
                    </label>

                    <label className="block">
                        <span className="text-gray-700">Last Name</span>
                        <input
                            name="lastName"
                            type="text"
                            value={formData.lastName}
                            onChange={handleChange}
                            required
                            className="mt-1 block w-full border rounded p-2"
                        />
                    </label>
                </div>

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
                    <span className="text-gray-700">Phone</span>
                    <input
                        name="phone"
                        type="tel"
                        value={formData.phone}
                        onChange={handleChange}
                        className="mt-1 block w-full border rounded p-2"
                    />
                </label>

                <label className="block">
                    <span className="text-gray-700">Current Location</span>
                    <input
                        name="currentLocation"
                        type="text"
                        value={formData.currentLocation}
                        onChange={handleChange}
                        className="mt-1 block w-full border rounded p-2"
                    />
                </label>

                <label className="block">
                    <span className="text-gray-700">Citizenship</span>
                    <input
                        name="citizenship"
                        type="text"
                        value={formData.citizenship}
                        onChange={handleChange}
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
                                {s}
                            </option>
                        ))}
                    </select>
                </label>

                <label className="block">
                    <span className="text-gray-700">Resume URL</span>
                    <input
                        name="resumeUrl"
                        type="url"
                        value={formData.resumeUrl}
                        onChange={handleChange}
                        className="mt-1 block w-full border rounded p-2"
                        placeholder="https://..."
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
