import type { InterviewStageOutput } from "../../types/outputs";

function FeedbackItem({
    interviewStage,
    onEditFeedback,
}: {
    interviewStage: InterviewStageOutput;
    onEditFeedback: (id: string) => void;
}) {
    return (
        <div key={interviewStage.id} className="border rounded-lg p-4">
            <div className="flex justify-between items-start mb-2">
                <div>
                    <h4 className="text-sm font-medium text-gray-900">
                        {interviewStage.name}
                    </h4>
                    <p className="text-sm text-gray-600">
                        by {interviewStage.createdBy}
                    </p>
                </div>
                <span className="text-sm font-medium text-gray-900">
                    Rating: {interviewStage.rating}/5
                </span>
            </div>
            <p className="text-sm text-gray-700 mb-2">{interviewStage.feedback}</p>
            {interviewStage.nextStepNotes && (
                <div className="bg-yellow-50 border-l-4 border-yellow-400 p-3 mt-3">
                    <h5 className="text-sm font-medium text-yellow-800">Next Step Notes:</h5>
                    <p className="text-sm text-yellow-700">{interviewStage.nextStepNotes}</p>
                </div>
            )}
            <p className="text-xs text-gray-500 mt-2">{interviewStage.createdAt}</p>
            <div className="flex"><button
                onClick={() => onEditFeedback(interviewStage.id)}
                className="inline-flex items-center px-3 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700"
            >
                Edit Feedback
            </button></div>
        </div>
    )
}

export default FeedbackItem;
