export function isMastered(
    correctAnswers: number,
    requiredAnswers = 3 
): boolean {
    return correctAnswers >= requiredAnswers;
}

export function getProgressPrecentage(
    correctAnswers: number,
    requiredAnswers = 3
): number {
    return Math.min(
        (correctAnswers / requiredAnswers) * 100,
        100
    );
}