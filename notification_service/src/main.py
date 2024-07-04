from fastapi import FastAPI
from pydantic import BaseModel
from logging_lib import StructuredLogger

app = FastAPI()
logger = StructuredLogger(__name__)

class NotificationRequest(BaseModel):
    user_id: int
    message: str

@app.post("/notifications")
async def send_notification(notification_request: NotificationRequest):
    # Simulate sending notification
    logger.info("Notification sent", notification=notification_request.dict())
    return {"message": "Notification sent"}

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=5004)
