export default function QuizForm() {
    return (
        <>
            <h1 style={{ color: "red" }}>This is where the quiz form goes</h1>

            <form>
                <label>
                    <input type="text" name="title"/>
                </label>

                <label>
                    <input type="text" name="description"/>
                </label>

                <label>
                    <input type="text" name="question"/>
                </label>
            </form>
        </>
    );
}