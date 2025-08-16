import { X } from 'lucide-react';
import { toast } from 'sonner';
import type { CreateCandidateSkillInput } from '../../../types';
import { FormField } from '../../ui/FormField';

interface SkillModalProps {
    isOpen: boolean;
    skill: CreateCandidateSkillInput;
    isEditing: boolean;
    onClose: () => void;
    onSubmit: (skill: CreateCandidateSkillInput) => void;
    onSkillChange: (updater: (prev: CreateCandidateSkillInput) => CreateCandidateSkillInput) => void;
}

export function SkillModal({
    isOpen,
    skill,
    isEditing,
    onClose,
    onSubmit,
    onSkillChange
}: SkillModalProps) {
    if (!isOpen) return null;

    const handleSubmit = () => {
        if (!skill.university || !skill.qualification) {
            toast.error("University and qualification are required");
            return;
        }
        onSubmit(skill);
    };

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-40">
            <div className="bg-white rounded-lg p-6 w-full max-w-md">
                <div className="flex justify-between items-center mb-4">
                    <h3 className="text-lg font-semibold">
                        {isEditing ? 'Edit Skill' : 'Add Skill'}
                    </h3>
                    <button onClick={onClose} className="text-gray-400 hover:text-gray-600">
                        <X className="h-6 w-6" />
                    </button>
                </div>

                <div className="space-y-4">
                    <FormField
                        label="University"
                        required
                        value={skill.university}
                        onChange={(e) => onSkillChange(prev => ({ ...prev, university: e.target.value }))}
                    />
                    <FormField
                        label="Qualification"
                        required
                        value={skill.qualification}
                        onChange={(e) => onSkillChange(prev => ({ ...prev, qualification: e.target.value }))}
                    />
                    <FormField
                        label="Proficiency Level"
                        type="number"
                        min={1}
                        value={skill.proficiencyLevel.toString()}
                        onChange={(e) => onSkillChange(prev => ({ ...prev, proficiencyLevel: parseInt(e.target.value) || 1 }))}
                    />
                    {/* Optional years of experience field for UI enhancement */}
                    {skill.yearsOfExperience !== undefined && (
                        <FormField
                            label="Years of Experience"
                            type="number"
                            min={0}
                            value={skill.yearsOfExperience?.toString() || "0"}
                            onChange={(e) => onSkillChange(prev => ({ ...prev, yearsOfExperience: parseInt(e.target.value) || 0 }))}
                        />
                    )}
                </div>

                <div className="flex justify-end space-x-3 mt-6">
                    <button
                        type="button"
                        onClick={onClose}
                        className="py-2 px-4 border border-gray-300 rounded-md text-sm font-medium text-gray-700 bg-white hover:bg-gray-50"
                    >
                        Cancel
                    </button>
                    <button
                        type="button"
                        onClick={handleSubmit}
                        className="py-2 px-4 border border-transparent rounded-md text-sm font-medium text-white bg-blue-600 hover:bg-blue-700"
                    >
                        {isEditing ? 'Update' : 'Add'} Skill
                    </button>
                </div>
            </div>
        </div>
    );
}