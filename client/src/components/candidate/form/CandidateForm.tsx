import { useState } from 'react';
import { toast } from 'sonner';

import { BulkUpload } from './BulkUpload';
import { BasicInfoForm } from './BasicInfoForm';
import { SkillModal } from './SkillModal';
import { JobModal } from './JobModal';
import { SkillsSection } from './SkillsSection';
import { JobsSection } from './JobsSection';
import type { CandidateFormData, JobData, ModalType, SkillData } from '../../../types/candidate';
import { candidateService } from '../../../services/candidateService';
import { CandidateStatus } from '../../../types/enums';
import type { CreateCandidateInput } from '../../../types/inputs';
import { LoadingOverlay } from '../../ui/LoadingOverlay';

function CandidateForm() {
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
        status: "TECH" as any,
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
            yearsOfExperience: 0,
        });
    };

    const resetCurrentJob = () => {
        setCurrentJob({
            title: "",
            status: "TECH" as any,
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
        setActiveModal('skill');
    };

    const handleEditJob = (index: number) => {
        setCurrentJob(jobs[index]);
        setEditingIndex(index);
        setActiveModal('job');
    };

    const handleDeleteSkill = (index: number) => {
        setSkills(skills.filter((_, i) => i !== index));
    };

    const handleDeleteJob = (index: number) => {
        setJobs(jobs.filter((_, i) => i !== index));
    };

    const handleAddCandidate = async (e: React.FormEvent) => {
        e.preventDefault();

        if (!candidateForm.firstName || !candidateForm.lastName || !candidateForm.email) {
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
                candidateSkill: skills[0],
                jobApplication: jobs[0]
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

    return (
        <>
            <LoadingOverlay isVisible={loading} />

            <SkillModal
                isOpen={activeModal === 'skill'}
                skill={currentSkill}
                isEditing={editingIndex !== null}
                onClose={closeModal}
                onSubmit={handleSkillSubmit}
                onSkillChange={setCurrentSkill}
            />

            <JobModal
                isOpen={activeModal === 'job'}
                job={currentJob}
                isEditing={editingIndex !== null}
                onClose={closeModal}
                onSubmit={handleJobSubmit}
                onJobChange={setCurrentJob}
            />

            <div className="flex justify-center flex-col items-center p-6">
                <h2 className="text-2xl font-bold text-gray-900 mb-6">
                    Add New Candidate
                </h2>

                <BulkUpload onUploadComplete={resetForm} />

                <div className="w-full max-w-4xl">
                    <BasicInfoForm
                        candidateForm={candidateForm}
                        setCandidateForm={setCandidateForm}
                    />

                    <SkillsSection
                        skills={skills}
                        onAddSkill={() => setActiveModal('skill')}
                        onEditSkill={handleEditSkill}
                        onDeleteSkill={handleDeleteSkill}
                    />

                    <JobsSection
                        jobs={jobs}
                        onAddJob={() => setActiveModal('job')}
                        onEditJob={handleEditJob}
                        onDeleteJob={handleDeleteJob}
                    />

                    <div className="bg-white shadow rounded-lg p-6">
                        <div className="flex justify-end space-x-3">
                            <button
                                type="button"
                                onClick={resetForm}
                                className="py-2 px-4 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50"
                            >
                                Reset Form
                            </button>
                            <button
                                type="submit"
                                onClick={handleAddCandidate}
                                disabled={loading || skills.length === 0 || jobs.length === 0}
                                className="py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 disabled:bg-gray-400 disabled:cursor-not-allowed"
                            >
                                Create Full Candidate
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
}

export default CandidateForm;