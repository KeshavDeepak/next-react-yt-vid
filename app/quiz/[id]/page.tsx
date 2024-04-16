export default function QuizPage({ params }: { params: { id: string } }) {
    return (
        <>
            <h2>Quiz {params.id}</h2>
        </>
    );
}