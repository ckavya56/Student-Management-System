import { useState } from "react";
import "./StudentList.css";

function StudentList({ students, search, setStudents }) {

    const [editRollNo, setEditRollNo] = useState(null);
    const [editName, setEditName] = useState("");
    const [editBranch, setEditBranch] = useState("");

    const filteredStudents = students.filter((student) =>
        student.name.toLowerCase().includes(search.toLowerCase())
    );

    async function handleDelete(rollno) {

        const response = await fetch(
            `http://127.0.0.1:8000/students/${rollno}`,
            {
                method: "DELETE"
            }
        );

        const data = await response.json();

        console.log(data);

        const updatedStudents = students.filter(
            (student) => student.rollno !== rollno
        );

        setStudents(updatedStudents);
    }

    function handleEdit(student) {
        setEditName(student.name);
        setEditRollNo(student.rollno);
        setEditBranch(student.branch);
    }

    async function handleUpdate() {

        const updatedStudent = {
            name: editName,
            rollno: Number(editRollNo),
            branch: editBranch
        };

        const response = await fetch(
            `http://127.0.0.1:8000/students/${editRollNo}`,
            {
                method: "PUT",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify(updatedStudent)
            }
        );

        const data = await response.json();

        const updatedStudents = students.map((student) =>
            student.rollno === editRollNo
                ? data
                : student
        );

        setStudents(updatedStudents);

        setEditRollNo(null);
        setEditName("");
        setEditBranch("");
    }

    return (
        <div className="student-list">

            <h2>Student List</h2>

            {filteredStudents.map((student) => (

                <div
                    className="student-card"
                    key={student.rollno}
                >

                    {editRollNo === student.rollno ? (

                        <div className="edit-section">

                            <input
                                className="edit-input"
                                value={editName}
                                onChange={(e) =>
                                    setEditName(e.target.value)
                                }
                            />

                            <input
                                className="edit-input"
                                value={editBranch}
                                onChange={(e) =>
                                    setEditBranch(e.target.value)
                                }
                            />

                            <button
                                className="save-button"
                                onClick={handleUpdate}
                            >
                                Save
                            </button>

                        </div>

                    ) : (

                        <div className="student-info">

                            <h3>{student.name}</h3>

                            <p>
                                Roll Number: {student.rollno}
                            </p>

                            <p>
                                Branch: {student.branch}
                            </p>

                            <button
                                className="edit-button"
                                onClick={() => handleEdit(student)}
                            >
                                Edit
                            </button>

                            <button
                                className="delete-button"
                                onClick={() =>
                                    handleDelete(student.rollno)
                                }
                            >
                                Delete
                            </button>

                        </div>
                    )}

                    <hr />

                </div>
            ))}

        </div>
    );
}

export default StudentList;