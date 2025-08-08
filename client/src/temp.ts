import React, {
	useState,
	useEffect,
	createContext,
	useContext,
	ReactNode,
} from "react";
import {
	Upload,
	Plus,
	Users,
	MessageSquare,
	Eye,
	FileText,
	LogOut,
	User,
} from "lucide-react";
import * as XLSX from "xlsx";

// Types
interface Candidate {
	id: string;
	name: string;
	email: string;
	position: string;
	status: "screening" | "technical" | "final" | "hired" | "rejected";
	experience: number;
	skills: string[];
	addedDate: string;
}

interface Feedback {
	id: string;
	candidateId: string;
	interviewerName: string;
	interviewStep: string;
	rating: number;
	comments: string;
	nextStepNotes: string;
	date: string;
}

interface User {
	id: string;
	name: string;
	email: string;
	role: "recruiter" | "interviewer" | "admin";
}

interface AuthContextType {
	user: User | null;
	isLoggedIn: boolean;
	login: (email: string, password: string) => Promise<boolean>;
	loginWithSSO: () => Promise<boolean>;
	logout: () => void;
}

// Auth Context
const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
	const context = useContext(AuthContext);
	if (context === undefined) {
		throw new Error("useAuth must be used within an AuthProvider");
	}
	return context;
};

// Mock GraphQL queries
const mockGraphQL = {
	authenticate: async (
		email: string,
		password: string
	): Promise<User | null> => {
		await new Promise((resolve) => setTimeout(resolve, 1000));
		// Mock authentication - in real app, this would validate credentials
		if (email && password) {
			return {
				id: "1",
				name: "John Recruiter",
				email: email,
				role: "recruiter",
			};
		}
		return null;
	},

	authenticateSSO: async (): Promise<User | null> => {
		await new Promise((resolve) => setTimeout(resolve, 1500));
		return {
			id: "2",
			name: "Jane Admin",
			email: "jane@company.com",
			role: "admin",
		};
	},

	getCandidates: async (): Promise<Candidate[]> => {
		await new Promise((resolve) => setTimeout(resolve, 500));
		return [
			{
				id: "1",
				name: "John Doe",
				email: "john@example.com",
				position: "Frontend Developer",
				status: "technical",
				experience: 3,
				skills: ["React", "TypeScript", "CSS"],
				addedDate: "2024-01-15",
			},
			{
				id: "2",
				name: "Jane Smith",
				email: "jane@example.com",
				position: "Backend Developer",
				status: "screening",
				experience: 5,
				skills: ["Node.js", "Python", "PostgreSQL"],
				addedDate: "2024-01-16",
			},
		];
	},

	addCandidate: async (
		candidate: Omit<Candidate, "id" | "addedDate">
	): Promise<Candidate> => {
		await new Promise((resolve) => setTimeout(resolve, 300));
		return {
			...candidate,
			id: Date.now().toString(),
			addedDate: new Date().toISOString().split("T")[0],
		};
	},

	getFeedback: async (candidateId: string): Promise<Feedback[]> => {
		await new Promise((resolve) => setTimeout(resolve, 300));
		return [
			{
				id: "1",
				candidateId,
				interviewerName: "Alice Johnson",
				interviewStep: "Technical Interview",
				rating: 4,
				comments:
					"Strong technical skills, good problem-solving approach. Demonstrated solid understanding of React concepts and was able to implement the coding challenge efficiently.",
				nextStepNotes:
					"Recommend for final interview. Focus on system design questions and leadership scenarios.",
				date: "2024-01-20",
			},
		];
	},

	addFeedback: async (
		feedback: Omit<Feedback, "id" | "date">
	): Promise<Feedback> => {
		await new Promise((resolve) => setTimeout(resolve, 300));
		return {
			...feedback,
			id: Date.now().toString(),
			date: new Date().toISOString().split("T")[0],
		};
	},
};

// Auth Provider Component
const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
	const [user, setUser] = useState<User | null>(null);
	const [isLoggedIn, setIsLoggedIn] = useState(false);

	const login = async (email: string, password: string): Promise<boolean> => {
		try {
			const authenticatedUser = await mockGraphQL.authenticate(email, password);
			if (authenticatedUser) {
				setUser(authenticatedUser);
				setIsLoggedIn(true);
				return true;
			}
			return false;
		} catch (error) {
			console.error("Login failed:", error);
			return false;
		}
	};

	const loginWithSSO = async (): Promise<boolean> => {
		try {
			const authenticatedUser = await mockGraphQL.authenticateSSO();
			if (authenticatedUser) {
				setUser(authenticatedUser);
				setIsLoggedIn(true);
				return true;
			}
			return false;
		} catch (error) {
			console.error("SSO login failed:", error);
			return false;
		}
	};

	const logout = () => {
		setUser(null);
		setIsLoggedIn(false);
	};

	return (
		<AuthContext.Provider
			value={{ user, isLoggedIn, login, loginWithSSO, logout }}
		>
			{children}
		</AuthContext.Provider>
	);
};

// Login Component
const LoginForm: React.FC = () => {
	const [email, setEmail] = useState("");
	const [password, setPassword] = useState("");
	const [loading, setLoading] = useState(false);
	const [error, setError] = useState("");
	const { login, loginWithSSO } = useAuth();

	const handleLogin = async (e: React.FormEvent) => {
		e.preventDefault();
		setLoading(true);
		setError("");

		const success = await login(email, password);
		if (!success) {
			setError("Invalid credentials");
		}
		setLoading(false);
	};

	const handleSSO = async () => {
		setLoading(true);
		setError("");

		const success = await loginWithSSO();
		if (!success) {
			setError("SSO authentication failed");
		}
		setLoading(false);
	};

	return (
		<div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center p-4">
			<div className="bg-white rounded-xl shadow-lg p-8 w-full max-w-md">
				<div className="text-center mb-8">
					<h1 className="text-3xl font-bold text-gray-900 mb-2">
						Recruitment Portal
					</h1>
					<p className="text-gray-600">Sign in to manage candidates</p>
				</div>

				{error && (
					<div className="bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded-lg mb-4">
						{error}
					</div>
				)}

				<form onSubmit={handleLogin} className="space-y-4">
					<div>
						<label className="block text-sm font-medium text-gray-700 mb-2">
							Email
						</label>
						<input
							type="email"
							required
							value={email}
							onChange={(e) => setEmail(e.target.value)}
							className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
							placeholder="Enter your email"
							disabled={loading}
						/>
					</div>

					<div>
						<label className="block text-sm font-medium text-gray-700 mb-2">
							Password
						</label>
						<input
							type="password"
							required
							value={password}
							onChange={(e) => setPassword(e.target.value)}
							className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
							placeholder="Enter your password"
							disabled={loading}
						/>
					</div>

					<button
						type="submit"
						disabled={loading}
						className="w-full bg-blue-600 text-white py-2 px-4 rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center"
					>
						{loading ? (
							<div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
						) : (
							"Sign In"
						)}
					</button>

					<div className="text-center">
						<button
							type="button"
							onClick={handleSSO}
							disabled={loading}
							className="text-blue-600 hover:underline text-sm disabled:opacity-50"
						>
							Sign in with SSO
						</button>
					</div>
				</form>
			</div>
		</div>
	);
};

// Main App Component
const RecruitmentApp: React.FC = () => {
	const { user, isLoggedIn, logout } = useAuth();
	const [candidates, setCandidates] = useState<Candidate[]>([]);
	const [feedback, setFeedback] = useState<Record<string, Feedback[]>>({});
	const [currentView, setCurrentView] = useState<
		"candidates" | "add-candidate" | "candidate-detail" | "feedback"
	>("candidates");
	const [selectedCandidate, setSelectedCandidate] = useState<Candidate | null>(
		null
	);
	const [loading, setLoading] = useState(false);

	// Form states
	const [candidateForm, setCandidateForm] = useState({
		name: "",
		email: "",
		position: "",
		experience: 0,
		skills: "",
		status: "screening" as Candidate["status"],
	});

	const [feedbackForm, setFeedbackForm] = useState({
		candidateId: "",
		interviewerName: user?.name || "",
		interviewStep: "",
		rating: 3,
		comments: "",
		nextStepNotes: "",
	});

	const loadCandidates = async () => {
		setLoading(true);
		try {
			const data = await mockGraphQL.getCandidates();
			setCandidates(data);
		} catch (error) {
			console.error("Failed to load candidates:", error);
		} finally {
			setLoading(false);
		}
	};

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

	const handleFileUpload = async (
		event: React.ChangeEvent<HTMLInputElement>
	) => {
		const file = event.target.files?.[0];
		if (!file) return;

		setLoading(true);
		try {
			const data = await file.arrayBuffer();
			const workbook = XLSX.read(data);
			const worksheet = workbook.Sheets[workbook.SheetNames[0]];
			const jsonData = XLSX.utils.sheet_to_json(worksheet);

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

	const handleAddFeedback = async (e: React.FormEvent) => {
		e.preventDefault();
		setLoading(true);

		try {
			const newFeedback = await mockGraphQL.addFeedback({
				...feedbackForm,
				candidateId: selectedCandidate?.id || "",
			});

			setFeedback((prev) => ({
				...prev,
				[selectedCandidate?.id || ""]: [
					...(prev[selectedCandidate?.id || ""] || []),
					newFeedback,
				],
			}));

			setFeedbackForm({
				candidateId: "",
				interviewerName: user?.name || "",
				interviewStep: "",
				rating: 3,
				comments: "",
				nextStepNotes: "",
			});
			setCurrentView("candidate-detail");
		} catch (error) {
			console.error("Failed to add feedback:", error);
		} finally {
			setLoading(false);
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

	useEffect(() => {
		if (isLoggedIn && candidates.length === 0) {
			loadCandidates();
		}
	}, [isLoggedIn]);

	useEffect(() => {
		if (user) {
			setFeedbackForm((prev) => ({ ...prev, interviewerName: user.name }));
		}
	}, [user]);

	if (!isLoggedIn) {
		return <LoginForm />;
	}

	return (
		<div className="min-h-screen bg-gray-50">
			{/* Header */}
			<header className="bg-white shadow-sm border-b">
				<div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
					<div className="flex justify-between items-center h-16">
						<div className="flex items-center">
							<Users className="h-8 w-8 text-blue-600" />
							<h1 className="ml-3 text-xl font-semibold text-gray-900">
								Recruitment Portal
							</h1>
						</div>

						<nav className="flex space-x-4">
							<button
								onClick={() => setCurrentView("candidates")}
								className={`px-3 py-2 rounded-md text-sm font-medium ${
									currentView === "candidates"
										? "bg-blue-100 text-blue-700"
										: "text-gray-500 hover:text-gray-700"
								}`}
							>
								Candidates
							</button>
							<button
								onClick={() => setCurrentView("add-candidate")}
								className={`px-3 py-2 rounded-md text-sm font-medium ${
									currentView === "add-candidate"
										? "bg-blue-100 text-blue-700"
										: "text-gray-500 hover:text-gray-700"
								}`}
							>
								Add Candidate
							</button>
						</nav>

						<div className="flex items-center space-x-4">
							<div className="flex items-center space-x-2">
								<User className="h-5 w-5 text-gray-400" />
								<div className="text-sm">
									<div className="text-gray-700">{user?.name}</div>
									<div className="text-gray-500 text-xs">{user?.role}</div>
								</div>
							</div>
							<button
								onClick={logout}
								className="text-gray-400 hover:text-gray-600"
							>
								<LogOut className="h-5 w-5" />
							</button>
						</div>
					</div>
				</div>
			</header>

			<main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
				{loading && (
					<div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
						<div className="bg-white rounded-lg p-6 flex items-center space-x-3">
							<div className="animate-spin rounded-full h-6 w-6 border-b-2 border-blue-600"></div>
							<span>Loading...</span>
						</div>
					</div>
				)}

				{/* Candidates List */}
				{currentView === "candidates" && (
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
				)}

				{/* Add Candidate Form */}
				{currentView === "add-candidate" && (
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
				)}

				{/* Candidate Detail */}
				{currentView === "candidate-detail" && selectedCandidate && (
					<div>
						<div className="mb-6">
							<button
								onClick={() => setCurrentView("candidates")}
								className="text-blue-600 hover:text-blue-700 text-sm font-medium mb-4"
							>
								← Back to candidates
							</button>
							<h2 className="text-2xl font-bold text-gray-900">
								{selectedCandidate.name}
							</h2>
						</div>

						<div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
							<div className="lg:col-span-2">
								<div className="bg-white shadow rounded-lg p-6 mb-6">
									<h3 className="text-lg font-medium text-gray-900 mb-4">
										Candidate Information
									</h3>
									<dl className="grid grid-cols-1 gap-x-4 gap-y-6 sm:grid-cols-2">
										<div>
											<dt className="text-sm font-medium text-gray-500">
												Email
											</dt>
											<dd className="mt-1 text-sm text-gray-900">
												{selectedCandidate.email}
											</dd>
										</div>
										<div>
											<dt className="text-sm font-medium text-gray-500">
												Position
											</dt>
											<dd className="mt-1 text-sm text-gray-900">
												{selectedCandidate.position}
											</dd>
										</div>
										<div>
											<dt className="text-sm font-medium text-gray-500">
												Experience
											</dt>
											<dd className="mt-1 text-sm text-gray-900">
												{selectedCandidate.experience} years
											</dd>
										</div>
										<div>
											<dt className="text-sm font-medium text-gray-500">
												Status
											</dt>
											<dd className="mt-1">
												<span
													className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusColor(
														selectedCandidate.status
													)}`}
												>
													{selectedCandidate.status}
												</span>
											</dd>
										</div>
										<div className="sm:col-span-2">
											<dt className="text-sm font-medium text-gray-500">
												Skills
											</dt>
											<dd className="mt-1 text-sm text-gray-900">
												<div className="flex flex-wrap gap-2 mt-2">
													{selectedCandidate.skills.map((skill, index) => (
														<span
															key={index}
															className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800"
														>
															{skill}
														</span>
													))}
												</div>
											</dd>
										</div>
									</dl>
								</div>

								{/* Feedback History */}
								<div className="bg-white shadow rounded-lg p-6">
									<div className="flex justify-between items-center mb-4">
										<h3 className="text-lg font-medium text-gray-900">
											Interview Feedback
										</h3>
										<button
											onClick={() => {
												setFeedbackForm((prev) => ({
													...prev,
													candidateId: selectedCandidate.id,
												}));
												setCurrentView("feedback");
											}}
											className="inline-flex items-center px-3 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700"
										>
											<Plus className="h-4 w-4 mr-2" />
											Add Feedback
										</button>
									</div>

									{feedback[selectedCandidate.id]?.length > 0 ? (
										<div className="space-y-4">
											{feedback[selectedCandidate.id].map((fb) => (
												<div key={fb.id} className="border rounded-lg p-4">
													<div className="flex justify-between items-start mb-2">
														<div>
															<h4 className="text-sm font-medium text-gray-900">
																{fb.interviewStep}
															</h4>
															<p className="text-sm text-gray-600">
																by {fb.interviewerName}
															</p>
														</div>
														<div className="flex items-center">
															<span className="text-sm font-medium text-gray-900">
																Rating: {fb.rating}/5
															</span>
														</div>
													</div>
													<p className="text-sm text-gray-700 mb-2">
														{fb.comments}
													</p>
													{fb.nextStepNotes && (
														<div className="bg-yellow-50 border-l-4 border-yellow-400 p-3 mt-3">
															<h5 className="text-sm font-medium text-yellow-800">
																Next Step Notes:
															</h5>
															<p className="text-sm text-yellow-700">
																{fb.nextStepNotes}
															</p>
														</div>
													)}
													<p className="text-xs text-gray-500 mt-2">
														{fb.date}
													</p>
												</div>
											))}
										</div>
									) : (
										<p className="text-gray-500 text-center py-8">
											No feedback available yet
										</p>
									)}
								</div>
							</div>
						</div>
					</div>
				)}

				{/* Feedback Form */}
				{currentView === "feedback" && selectedCandidate && (
					<div className="max-w-4xl mx-auto">
						<div className="mb-6">
							<button
								onClick={() => setCurrentView("candidate-detail")}
								className="text-blue-600 hover:text-blue-700 text-sm font-medium mb-4"
							>
								← Back to candidate
							</button>
							<h2 className="text-2xl font-bold text-gray-900">
								Add Feedback for {selectedCandidate.name}
							</h2>
							<p className="text-sm text-gray-600 mt-1">
								Position: {selectedCandidate.position}
							</p>
						</div>

						<div className="bg-white shadow rounded-lg p-8">
							<form onSubmit={handleAddFeedback} className="space-y-8">
								<div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
									<div>
										<label className="block text-sm font-medium text-gray-700 mb-2">
											Interviewer Name
										</label>
										<input
											type="text"
											required
											value={feedbackForm.interviewerName}
											onChange={(e) =>
												setFeedbackForm((prev) => ({
													...prev,
													interviewerName: e.target.value,
												}))
											}
											className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm px-3 py-2 border"
											placeholder="Enter interviewer name"
										/>
									</div>

									<div>
										<label className="block text-sm font-medium text-gray-700 mb-2">
											Interview Step
										</label>
										<select
											required
											value={feedbackForm.interviewStep}
											onChange={(e) =>
												setFeedbackForm((prev) => ({
													...prev,
													interviewStep: e.target.value,
												}))
											}
											className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm px-3 py-2 border"
										>
											<option value="">Select interview step</option>
											<option value="Phone Screening">Phone Screening</option>
											<option value="Technical Interview">
												Technical Interview
											</option>
											<option value="System Design">System Design</option>
											<option value="Behavioral Interview">
												Behavioral Interview
											</option>
											<option value="Final Interview">Final Interview</option>
											<option value="HR Interview">HR Interview</option>
										</select>
									</div>
								</div>

								<div>
									<label className="block text-sm font-medium text-gray-700 mb-3">
										Overall Rating
									</label>
									<div className="flex items-center space-x-6">
										{[1, 2, 3, 4, 5].map((rating) => (
											<label
												key={rating}
												className="flex items-center cursor-pointer"
											>
												<input
													type="radio"
													name="rating"
													value={rating}
													checked={feedbackForm.rating === rating}
													onChange={(e) =>
														setFeedbackForm((prev) => ({
															...prev,
															rating: parseInt(e.target.value),
														}))
													}
													className="focus:ring-blue-500 h-4 w-4 text-blue-600 border-gray-300 mr-2"
												/>
												<span className="text-sm font-medium text-gray-700">
													{rating}
												</span>
												<span className="ml-1 text-xs text-gray-500">
													{rating === 1 && "(Poor)"}
													{rating === 2 && "(Below Average)"}
													{rating === 3 && "(Average)"}
													{rating === 4 && "(Good)"}
													{rating === 5 && "(Excellent)"}
												</span>
											</label>
										))}
									</div>
								</div>

								<div>
									<label className="block text-sm font-medium text-gray-700 mb-2">
										Interview Comments
									</label>
									<textarea
										required
										rows={6}
										value={feedbackForm.comments}
										onChange={(e) =>
											setFeedbackForm((prev) => ({
												...prev,
												comments: e.target.value,
											}))
										}
										placeholder="Share detailed feedback about the candidate's performance, strengths, areas for improvement, specific examples from the interview..."
										className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm px-3 py-2 border resize-none"
									/>
									<p className="mt-1 text-xs text-gray-500">
										Be specific and provide examples to help other interviewers
										and hiring managers
									</p>
								</div>

								<div>
									<label className="block text-sm font-medium text-gray-700 mb-2">
										Notes for Next Interviewer (Optional)
									</label>
									<textarea
										rows={4}
										value={feedbackForm.nextStepNotes}
										onChange={(e) =>
											setFeedbackForm((prev) => ({
												...prev,
												nextStepNotes: e.target.value,
											}))
										}
										placeholder="Specific areas to focus on, questions to ask, or recommendations for the next interview step..."
										className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm px-3 py-2 border resize-none"
									/>
									<p className="mt-1 text-xs text-gray-500">
										Help the next interviewer by highlighting areas they should
										explore further
									</p>
								</div>

								<div className="flex justify-end space-x-4 pt-6 border-t">
									<button
										type="button"
										onClick={() => setCurrentView("candidate-detail")}
										className="py-2 px-6 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500"
									>
										Cancel
									</button>
									<button
										type="submit"
										disabled={loading}
										className="py-2 px-6 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed"
									>
										{loading ? "Saving..." : "Save Feedback"}
									</button>
								</div>
							</form>
						</div>
					</div>
				)}
			</main>
		</div>
	);
};

// Main App with Auth Provider
const App: React.FC = () => {
	return (
		<AuthProvider>
			<RecruitmentApp />
		</AuthProvider>
	);
};

export default App;
