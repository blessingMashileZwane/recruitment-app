import { Plus } from 'lucide-react';
import type { CreateCandidateSkillInput } from '../../types';
import { SkillCard } from './SkillCard';

interface SkillsSectionProps {
    skills: CreateCandidateSkillInput[];
    onAddSkill: () => void;
    onEditSkill: (index: number) => void;
    onDeleteSkill: (index: number) => void;
}

export function SkillsSection({ skills, onAddSkill, onEditSkill, onDeleteSkill }: SkillsSectionProps) {
    return (
        <div className="bg-white shadow rounded-lg p-6 mb-6">
            <div className="flex justify-between items-center mb-4">
                <h3 className="text-lg font-semibold text-gray-900">Skills & Education</h3>
                <button
                    type="button"
                    onClick={onAddSkill}
                    className="inline-flex items-center py-2 px-3 border border-transparent rounded-md text-sm font-medium text-white bg-green-600 hover:bg-green-700"
                >
                    <Plus className="h-4 w-4 mr-2" />
                    Add Skill
                </button>
            </div>

            {skills.length === 0 ? (
                <p className="text-gray-500 text-center py-8">No skills added yet</p>
            ) : (
                <div className="grid gap-4 sm:grid-cols-2">
                    {skills.map((skill, index) => (
                        <SkillCard
                            key={index}
                            skill={skill}
                            index={index}
                            onEdit={onEditSkill}
                            onDelete={onDeleteSkill}
                        />
                    ))}
                </div>
            )}
        </div>
    );
}