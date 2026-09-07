from sqlalchemy import Column, Integer, String
from database import Base

# "This StudentDB model represents the MySQL table named students."
class StudentDB(Base):
    __tablename__ = "students"

    id = Column(Integer, primary_key=True, index=True)
    name = Column(String(100), nullable=False)
    rollno = Column(Integer, unique=True, nullable=False)
    branch = Column(String(100), nullable=False)