from fastapi import FastAPI, HTTPException
from pydantic import BaseModel
from logging_lib import StructuredLogger

app = FastAPI()
logger = StructuredLogger(__name__)

class AuthRequest(BaseModel):
    username: str
    password: str

@app.post("/login")
async def login(auth_request: AuthRequest):
    # Simulate login success and failure
    if auth_request.username == "testuser" and auth_request.password == "password":
        logger.info("User logged in successfully", username=auth_request.username)
        return {"message": "Login successful"}
    else:
        logger.error("Login failed", username=auth_request.username)
        raise HTTPException(status_code=401, detail="Login failed")

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=5000)
