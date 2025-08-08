import ExcelJS from 'exceljs';
import { Eye, MessageSquare, Plus, Upload, User } from 'lucide-react';
import { useEffect, useState } from 'react';
import { useAuth } from '../auth/AuthProvider';
import { mockGraphQL } from '../mock/mockData';
import type { Candidate, Feedback } from '../types';


function CandidateList({ currentCandidates }: { currentCandidates: Candidate[] }) {
    const { user, isLoggedIn, logout } = useAuth();
    const [loading, setLoading] = useState(false);
    const [candidates, setCandidates] = useState<Candidate[]>(currentCandidates);
    const [feedback, setFeedback] = useState<Record<string, Feedback[]>>({});
    const [currentView, setCurrentView] = useState<
        "candidates" | "add-candidate" | "candidate-detail" | "feedback"
    >("candidates");
    const [selectedCandidate, setSelectedCandidate] = useState<Candidate | null>(
        null
    );

    useEffect(() => {
        setCandidates(currentCandidates);
    }, [currentCandidates]);

    console.log("Current candidates:", currentCandidates);

    const loadFeedback = async (candidateId: string) => {
        try {
            const candidateFeedback = await mockGraphQL.getFeedback(candidateId);
            setFeedback((prev) => ({
                ...prev,
                [candidateId]: candidateFeedback,
            }));
        } catch (error) {
            console.error("Failed to load feedback:", error);
        }
    };

    const getStatusColor = (status: Candidate["status"]) => {
        const colors = {
            screening: "bg-yellow-100 text-yellow-800",
            technical: "bg-blue-100 text-blue-800",
            final: "bg-purple-100 text-purple-800",
            hired: "bg-green-100 text-green-800",
            rejected: "bg-red-100 text-red-800",
        };
        return colors[status];
    };


    const [feedbackForm, setFeedbackForm] = useState({
        candidateId: "",
        interviewerName: user?.name || "",
        interviewStep: "",
        rating: 3,
        comments: "",
        nextStepNotes: "",
    });


    const handleFileUpload = async (
        event: React.ChangeEvent<HTMLInputElement>
    ) => {
        const file = event.target.files?.[0];
        if (!file) return;

        setLoading(true);
        try {

            const workbook = new ExcelJS.Workbook();
            await workbook.xlsx.load(await file.arrayBuffer());
            const worksheet = workbook.worksheets[0];
            const jsonData: Record<string, any>[] = [];

            worksheet.eachRow({ includeEmpty: false }, (row, rowNumber) => {
                if (rowNumber === 1) return; // Skip header row
                const rowData: any = {};
                row.eachCell({ includeEmpty: true }, (cell, colNumber) => {
                    const colLetter = String.fromCharCode(64 + colNumber);
                    rowData[colLetter] = cell.value;
                });
                jsonData.push(rowData);
            });

            const newCandidates = jsonData.map((row: any) => ({
                name: row.name || row.Name || "",
                email: row.email || row.Email || "",
                position: row.position || row.Position || "",
                experience: parseInt(row.experience || row.Experience || "0"),
                skills: (row.skills || row.Skills || "")
                    .split(",")
                    .map((s: string) => s.trim())
                    .filter((s: string) => s.length > 0),
                status: "screening" as Candidate["status"],
            }));

            for (const candidateData of newCandidates) {
                if (candidateData.name && candidateData.email) {
                    const newCandidate = await mockGraphQL.addCandidate(candidateData);
                    setCandidates((prev) => [...prev, newCandidate]);
                }
            }
        } catch (error) {
            console.error("Failed to upload file:", error);
        } finally {
            setLoading(false);
        }
    };


    return (
        <div>
            <div className="sm:flex sm:items-center sm:justify-between mb-6">
                <div>
                    <h2 className="text-2xl font-bold text-gray-900">Candidates</h2>
                    <p className="text-sm text-gray-600">
                        Manage and track candidate applications
                    </p>
                </div>
                <div className="mt-4 sm:mt-0 sm:ml-16 sm:flex-none space-x-2">
                    <label className="inline-flex items-center px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 cursor-pointer">
                        <Upload className="h-4 w-4 mr-2" />
                        Upload CSV/Excel
                        <input
                            type="file"
                            accept=".csv,.xlsx,.xls"
                            onChange={handleFileUpload}
                            className="hidden"
                        />
                    </label>
                    <button
                        onClick={() => setCurrentView("add-candidate")}
                        className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700"
                    >
                        <Plus className="h-4 w-4 mr-2" />
                        Add Candidate
                    </button>
                </div>
            </div>

            <div className="bg-white shadow overflow-hidden sm:rounded-md">
                <ul className="divide-y divide-gray-200">
                    {candidates.map((candidate) => (
                        <li key={candidate.id} className="px-6 py-4 hover:bg-gray-50">
                            <div className="flex items-center justify-between">
                                <div className="flex items-center">
                                    <div className="flex-shrink-0 h-10 w-10">
                                        <div className="h-10 w-10 rounded-full bg-gray-200 flex items-center justify-center">
                                            <User className="h-6 w-6 text-gray-500" />
                                        </div>
                                    </div>
                                    <div className="ml-4">
                                        <div className="flex items-center">
                                            <p className="text-sm font-medium text-gray-900">
                                                {candidate.name}
                                            </p>
                                            <span
                                                className={`ml-2 inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusColor(
                                                    candidate.status
                                                )}`}
                                            >
                                                {candidate.status}
                                            </span>
                                        </div>
                                        <div className="mt-1">
                                            <p className="text-sm text-gray-600">
                                                {candidate.position}
                                            </p>
                                            <p className="text-xs text-gray-500">
                                                {candidate.email} • {candidate.experience} years
                                                exp
                                            </p>
                                        </div>
                                    </div>
                                </div>
                                <div className="flex items-center space-x-2">
                                    <button
                                        onClick={() => {
                                            setSelectedCandidate(candidate);
                                            loadFeedback(candidate.id);
                                            setCurrentView("candidate-detail");
                                        }}
                                        className="inline-flex items-center px-3 py-2 border border-gray-300 shadow-sm text-xs font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50"
                                    >
                                        <Eye className="h-3 w-3 mr-1" />
                                        View
                                    </button>
                                    <button
                                        onClick={() => {
                                            setSelectedCandidate(candidate);
                                            setFeedbackForm((prev) => ({
                                                ...prev,
                                                candidateId: candidate.id,
                                            }));
                                            setCurrentView("feedback");
                                        }}
                                        className="inline-flex items-center px-3 py-2 border border-gray-300 shadow-sm text-xs font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50"
                                    >
                                        <MessageSquare className="h-3 w-3 mr-1" />
                                        Feedback
                                    </button>
                                </div>
                            </div>
                        </li>
                    ))}
                </ul>
            </div>
        </div>
    )
}

export default CandidateList;
