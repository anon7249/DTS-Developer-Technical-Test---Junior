from fastapi import APIRouter, HTTPException, requests
from backend.queries.queries import (
    create_task_query,
    get_tasks_query,
    get_task_by_id_query,
    delete_task_query,
    update_task_status,
)
from backend.schema.task_schemas import TaskCreate


router = APIRouter()


@router.post("/api/create_task", tags=["Tasks"])
async def create_task(task: TaskCreate):
    task_id = await create_task_query(
        title=task.title,
        description=task.description,
        status=task.status,
        due_at=task.due_at,
    )
    return {"Message": "Task created successfully", "task_id": task_id}


@router.get("/api/get_tasks", tags=["Tasks"])
async def get_tasks():
    all_tasks = await get_tasks_query()
    return all_tasks


@router.get("/api/tasks/{task_id}", tags=["Tasks"])
async def get_task_by_id(task_id: int):
    task = await get_task_by_id_query(task_id)

    if not task:
        raise HTTPException(status_code=404, detail="Task not found")

    return task


@router.delete("/api/tasks/{task_id}", tags=["Tasks"])
async def delete_task(task_id: int):
    return await delete_task_query(task_id)


@router.put("/api/tasks/{task_id}/status", tags=["Tasks"])
async def update_status(task_id: int, status: str):
    return await update_task_status(task_id, status)
