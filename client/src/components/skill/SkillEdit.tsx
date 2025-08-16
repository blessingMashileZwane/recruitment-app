import { AlertCircle } from 'lucide-react';
import { useEffect, useState } from 'react';
import { toast } from 'sonner';
import { SkillModal } from './SkillModal';
import { graphqlService } from '../../services/graphql.service';
import type { CreateCandidateSkillInput, UpdateCandidateSkillInput } from '../../types';
import { LoadingOverlay } from '../ui/LoadingOverlay';

interface SkillEditProps {
    skillId: string;
    candidateId: string;
    onCancel: () => void;
    onSave: (candidateId: string) => void;
}

export function SkillEdit({ skillId, candidateId, onCancel, onSave }: SkillEditProps) {
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [currentSkill, setCurrentSkill] = useState<CreateCandidateSkillInput>({
        university: "",
        qualification: "",
        proficiencyLevel: 1,
        yearsOfExperience: 0,
        possessedSkills: "",
    });

    useEffect(() => {
        console.log("Loading skill:", skillId);
        loadSkill();
    }, [skillId]);

    const loadSkill = async () => {
        setLoading(true);
        setError(null);
        try {
            const skill = await graphqlService.getCandidateSkillById(skillId);
            if (skill) {
                setCurrentSkill({
                    university: skill.university || "",
                    qualification: skill.qualification || "",
                    proficiencyLevel: skill.proficiencyLevel || 1,
                    yearsOfExperience: skill.yearsOfExperience || 0,
                    possessedSkills: skill.possessedSkills || "",
                });
            } else {
                setError("Skill not found");
            }
        } catch (error) {
            setError("Failed to load skill data");
            console.error("Failed to load skill:", error);
        } finally {
            setLoading(false);
        }
    };

    const handleSubmit = async (skill: CreateCandidateSkillInput) => {
        setSaving(true);
        setError(null);
        try {
            const updateInput: UpdateCandidateSkillInput = {
                id: skillId,
                ...skill
            };
            await graphqlService.updateCandidateSkill(updateInput);
            toast.success("Skill updated successfully");
            onSave(candidateId);
        } catch (error) {
            setError("Failed to update skill");
            console.error("Failed to update skill:", error);
            toast.error("Failed to update skill");
        } finally {
            setSaving(false);
        }
    };

    if (loading) {
        return <LoadingOverlay isVisible={true} />;
    }

    return (
        <>
            <LoadingOverlay isVisible={saving} />

            {/* Error Popup */}
            {error && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
                    <div className="bg-white rounded-lg p-6 w-full max-w-md mx-4">
                        <div className="flex items-center mb-4">
                            <AlertCircle className="h-6 w-6 text-red-600 mr-3" />
                            <h3 className="text-lg font-semibold text-gray-900">Error</h3>
                        </div>
                        <p className="text-gray-700 mb-6">{error}</p>
                        <div className="flex justify-end space-x-3">
                            <button
                                onClick={() => setError(null)}
                                className="cursor-pointer py-2 px-4 border border-gray-300 rounded-md text-sm font-medium text-gray-700 bg-white hover:bg-gray-50"
                            >
                                Close
                            </button>
                            <button
                                onClick={() => {
                                    setError(null);
                                    loadSkill();
                                }}
                                className="cursor-pointer py-2 px-4 border border-transparent rounded-md text-sm font-medium text-white bg-blue-600 hover:bg-blue-700"
                            >
                                Try Again
                            </button>
                        </div>
                    </div>
                </div>
            )}

            <SkillModal
                isOpen={true}
                skill={currentSkill}
                isEditing={true}
                onClose={onCancel}
                onSubmit={handleSubmit}
                onSkillChange={setCurrentSkill}
            />
        </>
    );
}