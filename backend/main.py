# 1. Receive the request
# 2. Get Ravi's data
# 3. Create a StudentDB object
# 4. Give it to SQLAlchemy
# 5. Save it into MySQL
# 6. Send the saved student back to React


# Base → SQLAlchemy/database models.
# BaseModel → Pydantic/API data models.


from fastapi import FastAPI, Depends, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from sqlalchemy.orm import Session
from pydantic import BaseModel

from database import Base, engine, get_db
from models import StudentDB


# Create all tables defined in models.py
Base.metadata.create_all(bind=engine)


# Create the FastAPI application
app = FastAPI()


# Allow React frontend to communicate with FastAPI
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173", "http://127.0.0.1:5173"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


# Data coming from React when creating a student
# When React sends student data, I expect these fields
class StudentCreate(BaseModel):
    name: str
    rollno: int
    branch: str


# Data coming from React when updating a student
class StudentUpdate(BaseModel):
    name: str
    branch: str


# Data sent back from FastAPI to React
class StudentResponse(BaseModel):
    name: str
    rollno: int
    branch: str

    class Config:
        from_attributes = True


# GET: Return all students
@app.get("/students", response_model=list[StudentResponse])
def get_students(db: Session = Depends(get_db)):

    # Go to the table represented by StudentDB and get all the records
    students = db.query(StudentDB).all()

    return students


# POST: Create a new student
@app.post("/students", response_model=StudentResponse)
def create_student(
    student: StudentCreate,
    db: Session = Depends(get_db)
):

    existing_student = db.query(StudentDB).filter(
        StudentDB.rollno == student.rollno
    ).first()

    if existing_student:
        raise HTTPException(
            status_code=400,
            detail="Roll number already exists"
        )

    new_student = StudentDB(
        name=student.name,
        rollno=student.rollno,
        branch=student.branch
    )

    db.add(new_student)
    db.commit()
    db.refresh(new_student)

    return new_student


# PUT: Update an existing student
@app.put("/students/{rollno}", response_model=StudentResponse)
def update_student(
    rollno: int,
    student: StudentUpdate,
    db: Session = Depends(get_db)
):

    existing_student = db.query(StudentDB).filter(
        StudentDB.rollno == rollno
    ).first()

    if not existing_student:
        raise HTTPException(
            status_code=404,
            detail="Student not found"
        )

    existing_student.name = student.name
    
    existing_student.branch = student.branch

    db.commit()
    db.refresh(existing_student)

    return existing_student


# DELETE: Delete an existing student
@app.delete("/students/{rollno}")
def delete_student(
    rollno: int,
    db: Session = Depends(get_db)
):

    existing_student = db.query(StudentDB).filter(
        StudentDB.rollno == rollno
    ).first()

    if not existing_student:
        raise HTTPException(
            status_code=404,
            detail="Student not found"
        )

    db.delete(existing_student)
    db.commit()

    return {
        "message": "Student deleted successfully"
    }



@app.get("/")
def home():
    return {
        "message": "Student Management API is running"
    }