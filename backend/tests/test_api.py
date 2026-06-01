import os
from unittest.mock import AsyncMock

import pytest
from fastapi import HTTPException
from httpx import AsyncClient, ASGITransport
from datetime import date
from backend.main import app
import backend.routes.routes as routes


@pytest.mark.asyncio
async def test_create_task(monkeypatch):
    mock_create_task = AsyncMock(return_value=1)
    monkeypatch.setattr(routes, "create_task_query", mock_create_task)

    task_data = {
        "title": "Review case documents",
        "description": "Check uploaded evidence",
        "status": "pending",
        "due_at": "2026-06-10",
    }

    async with AsyncClient(
        transport=ASGITransport(app=app), base_url="http://test"
    ) as client:
        response = await client.post("/api/create_task", json=task_data)

    assert response.status_code == 200
    assert response.json() == {"Message": "Task created successfully", "task_id": 1}

    mock_create_task.assert_called_once_with(
        title="Review case documents",
        description="Check uploaded evidence",
        status="pending",
        due_at=date(2026, 6, 10),
    )


@pytest.mark.asyncio
async def test_get_all_tasks(monkeypatch):
    mock_tasks = [
        {
            "id": 1,
            "title": "Review case documents",
            "description": "Check uploaded evidence",
            "status": "pending",
            "due_at": "2026-06-10",
        }
    ]

    mock_get_tasks = AsyncMock(return_value=mock_tasks)
    monkeypatch.setattr(routes, "get_tasks_query", mock_get_tasks)

    async with AsyncClient(
        transport=ASGITransport(app=app), base_url="http://test"
    ) as client:
        response = await client.get("/api/get_tasks")

    assert response.status_code == 200
    assert response.json() == mock_tasks
    mock_get_tasks.assert_called_once()


@pytest.mark.asyncio
async def test_get_task_by_id(monkeypatch):
    mock_task = {
        "id": 1,
        "title": "Review case documents",
        "description": "Check uploaded evidence",
        "status": "pending",
        "due_at": "2026-06-10",
    }

    mock_get_task = AsyncMock(return_value=mock_task)
    monkeypatch.setattr(routes, "get_task_by_id_query", mock_get_task)

    async with AsyncClient(
        transport=ASGITransport(app=app), base_url="http://test"
    ) as client:
        response = await client.get("/api/tasks/1")

    assert response.status_code == 200
    assert response.json() == mock_task
    mock_get_task.assert_called_once_with(1)


@pytest.mark.asyncio
async def test_get_task_by_id_not_found(monkeypatch):
    mock_get_task = AsyncMock(return_value=None)
    monkeypatch.setattr(routes, "get_task_by_id_query", mock_get_task)

    async with AsyncClient(
        transport=ASGITransport(app=app), base_url="http://test"
    ) as client:
        response = await client.get("/api/tasks/999")

    assert response.status_code == 404
    assert response.json() == {"detail": "Task not found"}


@pytest.mark.asyncio
async def test_update_task_status(monkeypatch):
    updated_task = {
        "id": 1,
        "title": "Review case documents",
        "description": "Check uploaded evidence",
        "status": "done",
        "due_at": "2026-06-10",
    }

    mock_update_status = AsyncMock(return_value=updated_task)
    monkeypatch.setattr(routes, "update_task_status", mock_update_status)

    async with AsyncClient(
        transport=ASGITransport(app=app), base_url="http://test"
    ) as client:
        response = await client.put("/api/tasks/1/status?status=done")

    assert response.status_code == 200
    assert response.json() == updated_task
    mock_update_status.assert_called_once_with(1, "done")


@pytest.mark.asyncio
async def test_delete_task(monkeypatch):
    delete_response = {"message": "Task deleted successfully", "task_id": 1}

    mock_delete_task = AsyncMock(return_value=delete_response)
    monkeypatch.setattr(routes, "delete_task_query", mock_delete_task)

    async with AsyncClient(
        transport=ASGITransport(app=app), base_url="http://test"
    ) as client:
        response = await client.delete("/api/tasks/1")

    assert response.status_code == 200
    assert response.json() == delete_response
    mock_delete_task.assert_called_once_with(1)


@pytest.mark.asyncio
async def test_delete_task_not_found(monkeypatch):
    mock_delete_task = AsyncMock(
        side_effect=HTTPException(status_code=404, detail="Task not found")
    )

    monkeypatch.setattr(routes, "delete_task_query", mock_delete_task)

    async with AsyncClient(
        transport=ASGITransport(app=app), base_url="http://test"
    ) as client:
        response = await client.delete("/api/tasks/999")

    assert response.status_code == 404
    assert response.json() == {"detail": "Task not found"}
