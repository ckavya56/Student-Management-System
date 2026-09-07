import { useState, useEffect } from "react";
import Header from "./Header";
import StudentForm from "./StudentForm";
import SearchBar from "./SearchBar";
import StudentList from "./StudentList";
import "./App.css";

function App() {

    const [students, setStudents] = useState([]);

    useEffect(() => {
        fetch("http://127.0.0.1:8000/students")
            .then((response) => response.json())
            .then((data) => {
                setStudents(data);
            });
    }, []);

    const [search, setSearch] = useState("");

    return (
        <div>

            <Header />

            <div className="hero">

                <img
                    src="/student-dashboard.png"
                    alt="Student Management System"
                />

                <div>
                    <h1>Manage Your Students</h1>
                    <p>Add, update, search and manage student records easily.</p>
                </div>

            </div>

            <StudentForm
                students={students}
                setStudents={setStudents}
            />

            <SearchBar
                search={search}
                setSearch={setSearch}
            />

            <StudentList
                students={students}
                search={search}
                setStudents={setStudents}
            />

        </div>
    );
}

export default App;