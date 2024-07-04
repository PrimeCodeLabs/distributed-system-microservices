from fastapi import FastAPI, HTTPException
from pydantic import BaseModel
from logging_lib import StructuredLogger
import pika
import json

app = FastAPI()
logger = StructuredLogger(__name__)

class OrderRequest(BaseModel):
    user_id: int
    item_id: int
    quantity: int

def publish_message(queue, message):
    connection = pika.BlockingConnection(pika.ConnectionParameters('rabbitmq'))
    channel = connection.channel()
    channel.queue_declare(queue=queue, durable=True)
    channel.basic_publish(
        exchange='',
        routing_key=queue,
        body=json.dumps(message),
        properties=pika.BasicProperties(
            delivery_mode=2,  # make message persistent
        ))
    connection.close()

@app.post("/orders")
async def create_order(order_request: OrderRequest):
    try:
        # Publish messages to user and payment queues
        publish_message('user_queue', {'user_id': order_request.user_id})
        publish_message('payment_queue', {'amount': order_request.quantity * 100})
        
        logger.info("Order created successfully", order=order_request.dict())
        return {"message": "Order created successfully"}
    except Exception as e:
        logger.error(f"Error occurred: {e}", order=order_request.dict())
        raise HTTPException(status_code=500, detail="Internal server error")

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=5002)
