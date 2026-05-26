from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from .db.database import database
from backend.routes.routes import router as routes

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


@app.on_event("startup")
async def startup():
    print("Connecting to DB...")
    await database.connect()
    print("Connected to DB")


@app.on_event("shutdown")
async def shutdown():
    await database.disconnect()
    print("Disconnected from DB")


@app.get("/")
async def root():
    return {"message": "Hello World"}


app.include_router(routes)

print("testing")