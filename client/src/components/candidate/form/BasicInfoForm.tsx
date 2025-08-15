import type { CandidateFormData } from "../../../types/candidate";
import { FormField } from "../../ui/FormField";

interface BasicInfoFormProps {
    candidateForm: CandidateFormData;
    setCandidateForm: (updater: (prev: CandidateFormData) => CandidateFormData) => void;
}

export function BasicInfoForm({ candidateForm, setCandidateForm }: BasicInfoFormProps) {
    return (
        <div className="bg-white shadow rounded-lg p-6 space-y-6 mb-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Basic Information</h3>

            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
                <FormField
                    label="First Name"
                    required
                    value={candidateForm.firstName}
                    onChange={(e) =>
                        setCandidateForm((prev) => ({ ...prev, firstName: e.target.value }))
                    }
                />

                <FormField
                    label="Last Name"
                    required
                    value={candidateForm.lastName}
                    onChange={(e) =>
                        setCandidateForm((prev) => ({ ...prev, lastName: e.target.value }))
                    }
                />

                <FormField
                    label="Email"
                    type="email"
                    required
                    value={candidateForm.email}
                    onChange={(e) =>
                        setCandidateForm((prev) => ({ ...prev, email: e.target.value }))
                    }
                />

                <FormField
                    label="Phone"
                    type="tel"
                    value={candidateForm.phone || ""}
                    onChange={(e) =>
                        setCandidateForm((prev) => ({ ...prev, phone: e.target.value }))
                    }
                />

                <FormField
                    label="Current Location"
                    value={candidateForm.currentLocation || ""}
                    onChange={(e) =>
                        setCandidateForm((prev) => ({ ...prev, currentLocation: e.target.value }))
                    }
                />

                <FormField
                    label="Citizenship"
                    value={candidateForm.citizenship || ""}
                    onChange={(e) =>
                        setCandidateForm((prev) => ({ ...prev, citizenship: e.target.value }))
                    }
                />
            </div>

            <FormField
                label="Resume URL"
                type="url"
                placeholder="https://..."
                value={candidateForm.resumeUrl || ""}
                onChange={(e) =>
                    setCandidateForm((prev) => ({ ...prev, resumeUrl: e.target.value }))
                }
            />
        </div>
    );
}