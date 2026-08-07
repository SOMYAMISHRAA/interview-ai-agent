from fastapi import FastAPI

app = FastAPI(
    title="Interview AI Agent",
    version="1.0.0",
)


@app.get("/")
def root():
    return {
        "message": "Interview AI Agent is running 🚀"
    }