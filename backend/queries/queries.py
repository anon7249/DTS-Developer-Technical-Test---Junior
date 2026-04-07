from datetime import date
from fastapi import HTTPException
from ..db.database import database


async def create_task_query(title: str, description: str, status: str, due_at: date):
    query = """
        INSERT INTO tasks (title, description, status, due_at)
        VALUES (:title, :description, :status, :due_at)
        RETURNING id;
    """

    values = {
        "title": title,
        "description": description,
        "status": status,
        "due_at": due_at,
    }

    task_id_row = await database.fetch_one(query=query, values=values)

    if task_id_row is None:
        raise HTTPException(status_code=500, detail="Failed to create task")

    return task_id_row["id"]


async def get_tasks_query():
    query = """
        SELECT * FROM tasks
        ORDER BY id DESC;
    """
    result = await database.fetch_all(query=query)
    return result


async def get_task_by_id_query(task_id: int):
    query = """
        SELECT * FROM tasks
        WHERE id = :task_id
        LIMIT 1;
    """

    values = {"task_id": task_id}

    task = await database.fetch_one(query=query, values=values)

    if task is None:
        raise HTTPException(status_code=404, detail="Task not found")

    return task


async def delete_task_query(task_id: int):
    query = """
        DELETE FROM tasks
        WHERE id = :task_id
        RETURNING id;
    """

    values = {"task_id": task_id}

    deleted = await database.fetch_one(query=query, values=values)

    if deleted is None:
        raise HTTPException(status_code=404, detail="Task not found")

    return {"message": "Task deleted successfully", "task_id": deleted["id"]}


async def update_task_status(task_id: int, status: str):
    query = """
        UPDATE tasks
        SET status = :status
        WHERE id = :task_id
        RETURNING *;
    """

    values = {
        "task_id": task_id,
        "status": status,
    }

    updated_task = await database.fetch_one(query=query, values=values)

    if updated_task is None:
        raise HTTPException(status_code=404, detail="Task not found")

    return updated_task
