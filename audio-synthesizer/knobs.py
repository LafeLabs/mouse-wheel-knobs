import asyncio
import json
import websockets

async def receive_data(websocket):
    async for message in websocket:
        try:
            data = json.loads(message)
            print(f"\nReceived state payload from web panel: {data}")

        except Exception as e:
            print(f"Error parsing frontend JSON payload: {e}")

async def main():
    async with websockets.serve(receive_data, "localhost", 8080):
        print("Mock Hardware Controller online.")
        print("WebSocket engine streaming on ws://localhost:8080...")
        await asyncio.Future()

if __name__ == "__main__":
    try:
        asyncio.run(main())
    except KeyboardInterrupt:
        print("\nMock server shut down cleanly.")