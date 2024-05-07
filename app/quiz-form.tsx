import { revalidatePath } from 'next/cache';
import postgres from 'postgres';

const sql = postgres(process.env.DATABASE_URL!);

function Answer({ id }: { id: number }) {
    return (
        <label>
            <input
                type="text"
                name={`answer-${id}`}
                className="form-control"
                placeholder={`Enter answer ${id}`}
                style={{ textAlign: "center" }}
            />
            <input type="checkbox" name={`check-${id}`} />
        </label>
    );
}

export default function QuizForm() {
    async function createQuiz(formData: FormData) {
        "use server";

        let title = formData.get("title") as string;
        let description = formData.get("description") as string;
        let question = formData.get("question") as string;

        let answers = [1, 2, 3, 4].map((id) => {
            return {
                answer : formData.get(`answer-${id}`) as string,
                isCorrect : formData.get(`check-${id}`) === 'on'
            };
        });

        await sql`
        WITH new_quiz AS (
            INSERT INTO quiz (title, description, question, created_at)
            VALUES (${title}, ${description}, ${question}, NOW())
            RETURNING id
        )
        
        INSERT INTO answer (quiz_id, text, is_correct)
        VALUES
        
            ((SELECT id FROM new_quiz), ${answers[0].answer}, ${answers[0].isCorrect}),
        
            ((SELECT id FROM new_quiz), ${answers[1].answer}, ${answers[1].isCorrect}),
        
            ((SELECT id FROM new_quiz), ${answers[2].answer}, ${answers[2].isCorrect}),

            ((SELECT id FROM new_quiz), ${answers[3].answer}, ${answers[3].isCorrect});
            
        `;     
        
        revalidatePath('/');
    }

    return (
        <>
            <h1 style={{ color: "red" }}>This is where the quiz form goes</h1>

            <form className="flex flex-col mt-8 p-8" action={createQuiz} >
                <label>
                    <input
                        type="text"
                        name="title"
                        className="form-control"
                        placeholder="Enter quiz title"
                        style={{ textAlign: "center" }}
                    />
                </label>

                <label>
                    <input
                        type="text"
                        name="description"
                        className="form-control"
                        placeholder="Enter quiz description"
                        style={{ textAlign: "center" }}
                    />
                </label>

                <label>
                    <input
                        type="text"
                        name="question"
                        className="form-control"
                        placeholder="Enter question"
                        style={{ textAlign: "center" }}
                    />
                </label>

                <div className="m-8"></div>

                <Answer id={1} />
                <Answer id={2} />
                <Answer id={3} />
                <Answer id={4} />

                <button className="btn btn-primary btn-lg px-4 gap-3 extra-btn-1">Create Quiz</button>
            </form>
        </>
    );
}


// WITH new_quiz AS (
//     INSERT INTO quiz (title, description, question, created_at)
//     VALUES (${title}, ${description}, ${question}, NOW())
//     RETURNING id
// )
// SELECT id INTO quiz_id FROM new_quiz;

// INSERT INTO answer (text, is_correct, quiz_id)
//             VALUES (
//                 ( ${answers[0].answer}, ${answers[0].isCorrect}, quiz_id ),
//                 ( ${answers[1].answer}, ${answers[1].isCorrect}, quiz_id ),
//                 ( ${answers[2].answer}, ${answers[2].isCorrect}, quiz_id ),
//                 ( ${answers[3].answer}, ${answers[3].isCorrect}, quiz_id )
//             );


// need to remove the extra quiz and its answers and re do it