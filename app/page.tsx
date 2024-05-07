import "bootstrap/dist/css/bootstrap.min.css"; // Import bootstrap CSS
import "./globals.css";

import Link from 'next/link';
import postgres from 'postgres';
import QuizForm from "./quiz-form";

const sql = postgres(process.env.DATABASE_URL!);

async function Quizzes() {  
    const quizzes = await sql`SELECT * FROM quiz;`;

    return (
        <ul>
            {
                quizzes.map((quiz) => {
                    return (
                        <li key={quiz.id}>
                            <Link href={`/quiz/${quiz.id}`} prefetch className = "btn btn-primary btn-lg px-4 gap-3 extra-btn-1"> {quiz.title} </Link>
                        </li>
                    )
                })
            }
        </ul>
    );
}

export default function Home() {
    return (
        <div className = "text-center">
            <h1 className = "text-4xl font-bold mb-6">Quiz time!</h1>

            <Quizzes />
            <QuizForm />
        </div>
    );
}
