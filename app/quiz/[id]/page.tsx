import postgres from 'postgres';
import { redirect } from 'next/navigation';

const sql = postgres(process.env.DATABASE_URL!);

function shuffleArray(array: Object[]) {
    for (let i = array.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [array[i], array[j]] = [array[j], array[i]];
    }

    return array;
}

async function Quiz({ id, searchParams }: { id: string, searchParams: { show?: string } }) {
    // get the quiz and answer for particular quiz id
    let answers = await sql`
        SELECT q.title, q.description, q.question, a.id, a.text, a.is_correct
        FROM quiz q 
        JOIN answer a ON q.id = a.quiz_id
        WHERE q.id = ${id};
    `;

    // answers = shuffleArray(answers);

    return (
        <>
            <h1>{answers[0].title}</h1>
            <h1>{answers[0].description}</h1>
            <h1>{answers[0].question}</h1>

            <ul>
                {answers.map((answer) => (
                    <li key={answer.id}>
                        <p>
                            {answer.text} &nbsp;&nbsp;&nbsp;
                            {searchParams.show === 'true' && answer.is_correct && '✅'}
                        </p>
                    </li>
                ))}
            </ul>
        </>
    )
}

export default function QuizPage({ params, searchParams }:
    { params: { id: string }, searchParams: { show?: string } }) {
    return (
        <>
            <Quiz id={params.id} searchParams={searchParams} />

            <form action={async () => {
                'use server';
                redirect(`/quiz/${params.id}?show=true`)
            }}>
                <button className="btn btn-primary btn-lg px-4 gap-3 extra-btn-1">Show answer</button>
            </form>
        </>
    );
}