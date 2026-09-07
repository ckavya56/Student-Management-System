import { useState } from "react";
import "./StudentForm.css";

function StudentForm({ students, setStudents }) {

    const [name, setName] = useState("");
    const [rollno, setRollNo] = useState("");
    const [branch, setBranch] = useState("");

    async function handleAddStudent(e) {
        e.preventDefault();

        const newStudent = {
            name,
            rollno: Number(rollno),
            branch
        };

        const response = await fetch(
            "http://127.0.0.1:8000/students",
            {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify(newStudent)
            }
        );

        const data = await response.json();

        setStudents([...students, data]);

        setName("");
        setRollNo("");
        setBranch("");
    }

    return (
        <form className="student-form" onSubmit={handleAddStudent}>

            <h2>Add Student</h2>

            <input
                className="form-input"
                type="text"
                placeholder="Enter Name"
                value={name}
                onChange={(e) => setName(e.target.value)}
            />

            <input
                className="form-input"
                type="number"
                placeholder="Enter Roll Number"
                value={rollno}
                onChange={(e) => setRollNo(e.target.value)}
            />

            <input
                className="form-input"
                type="text"
                placeholder="Enter Branch"
                value={branch}
                onChange={(e) => setBranch(e.target.value)}
            />

            <button
                className="add-button"
                type="submit"
            >
                Add Student
            </button>

        </form>
    );
}

export default StudentForm;