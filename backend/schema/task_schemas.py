from pydantic import BaseModel, field_validator
from typing import Optional, Literal
from datetime import date


class TaskCreate(BaseModel):
    title: str
    description: Optional[str] = None
    status: Literal["todo", "in progress", "done"]
    due_at: date

    @field_validator("due_at")
    @classmethod
    def due_at_cannot_be_in_past(cls, value):
        if value < date.today():
            raise ValueError("Due date cannot be in the past")
        return value
