import { useState } from "react";
import { toast } from "sonner";
import { candidateService } from "../services/candidateService";
import type {
	CandidateFormData,
	JobData,
	ModalType,
	SkillData,
} from "../types/candidate";
import { AppliedJob, CandidateStatus } from "../types/enums";
import type { CreateCandidateInput } from "../types/inputs";

export function useCandidateForm() {
	const [loading, setLoading] = useState(false);
	const [activeModal, setActiveModal] = useState<ModalType>(null);
	const [editingIndex, setEditingIndex] = useState<number | null>(null);

	const [candidateForm, setCandidateForm] = useState<CandidateFormData>({
		firstName: "",
		lastName: "",
		email: "",
		phone: "",
		currentLocation: "",
		citizenship: "",
		resumeUrl: "",
	});

	const [skills, setSkills] = useState<SkillData[]>([]);
	const [jobs, setJobs] = useState<JobData[]>([]);

	const [currentSkill, setCurrentSkill] = useState<SkillData>({
		university: "",
		qualification: "",
		proficiencyLevel: 1,
	});

	const [currentJob, setCurrentJob] = useState<JobData>({
		title: "",
		appliedJob: AppliedJob.TECH,
		department: "",
		requirements: "",
		isActive: true,
	});

	const resetForm = () => {
		setCandidateForm({
			firstName: "",
			lastName: "",
			email: "",
			phone: "",
			currentLocation: "",
			citizenship: "",
			resumeUrl: "",
		});
		setSkills([]);
		setJobs([]);
	};

	const resetCurrentSkill = () => {
		setCurrentSkill({
			university: "",
			qualification: "",
			proficiencyLevel: 1,
		});
	};

	const resetCurrentJob = () => {
		setCurrentJob({
			title: "",
			appliedJob: AppliedJob.TECH,
			department: "",
			requirements: "",
			isActive: true,
		});
	};

	const closeModal = () => {
		setActiveModal(null);
		setEditingIndex(null);
		resetCurrentSkill();
		resetCurrentJob();
	};

	const handleSkillSubmit = (skill: SkillData) => {
		if (editingIndex !== null) {
			const updatedSkills = [...skills];
			updatedSkills[editingIndex] = skill;
			setSkills(updatedSkills);
			setEditingIndex(null);
		} else {
			setSkills([...skills, skill]);
		}
		closeModal();
	};

	const handleJobSubmit = (job: JobData) => {
		if (editingIndex !== null) {
			const updatedJobs = [...jobs];
			updatedJobs[editingIndex] = job;
			setJobs(updatedJobs);
			setEditingIndex(null);
		} else {
			setJobs([...jobs, job]);
		}
		closeModal();
	};

	const handleEditSkill = (index: number) => {
		setCurrentSkill(skills[index]);
		setEditingIndex(index);
		setActiveModal("skill");
	};

	const handleEditJob = (index: number) => {
		setCurrentJob(jobs[index]);
		setEditingIndex(index);
		setActiveModal("job");
	};

	const handleDeleteSkill = (index: number) => {
		setSkills(skills.filter((_, i) => i !== index));
	};

	const handleDeleteJob = (index: number) => {
		setJobs(jobs.filter((_, i) => i !== index));
	};

	const handleAddCandidate = async () => {
		if (
			!candidateForm.firstName ||
			!candidateForm.lastName ||
			!candidateForm.email
		) {
			toast.error("First name, last name, and email are required");
			return;
		}

		if (skills.length === 0) {
			toast.error("At least one skill must be added");
			return;
		}

		if (jobs.length === 0) {
			toast.error("At least one job application must be added");
			return;
		}

		setLoading(true);

		try {
			const fullCandidateInput: CreateCandidateInput = {
				...candidateForm,
				status: CandidateStatus.OPEN,
				candidateSkill: {
					university: skills[0].university,
					qualification: skills[0].qualification,
					proficiencyLevel: skills[0].proficiencyLevel,
				},
				jobApplication: {
					title: jobs[0].title,
					appliedJob: jobs[0].appliedJob,
					department: jobs[0].department,
					requirements: jobs[0].requirements,
					isActive: jobs[0].isActive,
				},
			};

			await candidateService.createFullCandidate(fullCandidateInput);
			resetForm();
			toast.success("Candidate added successfully");
		} catch (error) {
			toast.error("Failed to add candidate");
		} finally {
			setLoading(false);
		}
	};

	return {
		// State
		loading,
		activeModal,
		editingIndex,
		candidateForm,
		skills,
		jobs,
		currentSkill,
		currentJob,

		// Setters
		setActiveModal,
		setCandidateForm,
		setCurrentSkill,
		setCurrentJob,

		// Actions
		resetForm,
		closeModal,
		handleSkillSubmit,
		handleJobSubmit,
		handleEditSkill,
		handleEditJob,
		handleDeleteSkill,
		handleDeleteJob,
		handleAddCandidate,
	};
}
