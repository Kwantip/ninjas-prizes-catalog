import "./Step.css";

interface StepProps {
    stepNum: number;
    message: string;
}
function Step({ stepNum, message }: StepProps) {
    return (
        <div className="step">
            <p className="step-number">{stepNum}</p>
            <p className="step-message">{message}</p>
        </div>
    )
}

export default Step;