import { useState } from 'react';
import { toast } from 'sonner';

import { candidateService } from '../../../services/candidateService';
import type { CandidateFormData, ModalType } from '../../../types/candidate';
import { AppliedJob, AppliedJobStatus, CandidateStatus } from '../../../types/enums';
import type { CreateCandidateInput, CreateCandidateSkillInput, CreateJobApplicationInput } from '../../../types/inputs';
import { LoadingOverlay } from '../../ui/LoadingOverlay';
import { BasicInfoForm } from './BasicInfoForm';
import { BulkUpload } from './BulkUpload';
import { JobModal } from '../../jobApplication/JobModal';
import { JobsSection } from '../../jobApplication/JobsSection';
import { SkillModal } from '../../skill/SkillModal';
import { SkillsSection } from '../../skill/SkillsSection';

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

    const [skills, setSkills] = useState<CreateCandidateSkillInput[]>([]);
    const [jobs, setJobs] = useState<CreateJobApplicationInput[]>([]);

    const [currentSkill, setCurrentSkill] = useState<CreateCandidateSkillInput>({
        university: "",
        qualification: "",
        proficiencyLevel: 1,
        yearsOfExperience: 0,
        possessedSkills: "",
    });

    const [currentJob, setCurrentJob] = useState<CreateJobApplicationInput>({
        appliedJob: AppliedJob.TECH,
        applicationStatus: AppliedJobStatus.ACTIVE,
        appliedJobOther: "",
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
            possessedSkills: "",
        });
    };

    const resetCurrentJob = () => {
        setCurrentJob({
            appliedJob: AppliedJob.TECH,
            applicationStatus: AppliedJobStatus.ACTIVE,
            appliedJobOther: "",
            isActive: true,
        });
    };

    const closeModal = () => {
        setActiveModal(null);
        setEditingIndex(null);
        resetCurrentSkill();
        resetCurrentJob();
    };

    const handleSkillSubmit = (skill: CreateCandidateSkillInput) => {
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

    const handleJobSubmit = (job: CreateJobApplicationInput) => {
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
            const candidateSkillInput: CreateCandidateSkillInput = {
                university: skills[0].university,
                qualification: skills[0].qualification,
                proficiencyLevel: skills[0].proficiencyLevel,
                yearsOfExperience: skills[0].yearsOfExperience,
                possessedSkills: skills[0].possessedSkills,
            };

            const jobApplicationsInput: CreateJobApplicationInput[] = jobs.map(job => ({
                appliedJob: job.appliedJob,
                applicationStatus: job.applicationStatus,
                appliedJobOther: job.appliedJobOther,
                isActive: job.isActive,
            }));

            const fullCandidateInput: CreateCandidateInput = {
                ...candidateForm,
                status: CandidateStatus.OPEN,
                candidateSkill: candidateSkillInput,
                jobApplications: jobApplicationsInput,
            };

            await candidateService.createFullCandidate(fullCandidateInput);
            resetForm();
            toast.success("Candidate added successfully");
        } catch (error) {
            console.error('Error creating candidate:', error);
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
                                className="cursor-pointer py-2 px-4 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50"
                            >
                                Reset Form
                            </button>
                            <button
                                type="submit"
                                onClick={handleAddCandidate}
                                disabled={loading || skills.length === 0 || jobs.length === 0}
                                className="cursor-pointer py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 disabled:bg-gray-400 disabled:cursor-not-allowed"
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