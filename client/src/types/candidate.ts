export type CandidateFormData = {
	firstName: string;
	lastName: string;
	email: string;
	phone?: string;
	currentLocation?: string;
	citizenship?: string;
	resumeUrl?: string;
};

export type ModalType = "skill" | "job" | null;
