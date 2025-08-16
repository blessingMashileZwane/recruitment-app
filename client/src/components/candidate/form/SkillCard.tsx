import { Edit, Trash2 } from 'lucide-react';
import type { CreateCandidateSkillInput } from '../../../types';

interface SkillCardProps {
    skill: CreateCandidateSkillInput;
    index: number;
    onEdit: (index: number) => void;
    onDelete: (index: number) => void;
}

export function SkillCard({ skill, index, onEdit, onDelete }: SkillCardProps) {
    return (
        <div className="border border-gray-200 rounded-lg p-4">
            <div className="flex justify-between items-start mb-2">
                <div className="flex-1">
                    <h4 className="font-medium text-gray-900">{skill.qualification}</h4>
                    <p className="text-sm text-gray-600">{skill.university}</p>
                    <div className="mt-2 text-xs text-gray-500">
                        <span className="inline-flex items-center px-2 py-1 rounded-full bg-blue-100 text-blue-800 mr-2">
                            Level {skill.proficiencyLevel}/10
                        </span>
                        {skill.yearsOfExperience !== undefined && (
                            <span className="inline-flex items-center px-2 py-1 rounded-full bg-gray-100 text-gray-800">
                                {skill.yearsOfExperience} years exp.
                            </span>
                        )}
                    </div>
                </div>
                <div className="flex space-x-1">
                    <button
                        type="button"
                        onClick={() => onEdit(index)}
                        className="text-blue-600 hover:text-blue-800"
                    >
                        <Edit className="h-4 w-4" />
                    </button>
                    <button
                        type="button"
                        onClick={() => onDelete(index)}
                        className="text-red-600 hover:text-red-800"
                    >
                        <Trash2 className="h-4 w-4" />
                    </button>
                </div>
            </div>
        </div>
    );
}