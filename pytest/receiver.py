import logging
import base64
import json

from websocket_server import WebsocketServer

# Called for every client connecting (after handshake)
def new_client(client, server):
    print("New client connected")
   # server.send_message_to_all("Hey all, a new client has joined us")

# Called for every client disconnecting
def client_left(client, server):
    print("Client disconnected")

# Called when a client sends a message
def message_received(client, server, message):
    print("Client said:")
    if message == "START":
        print(" img transport start... ")
    elif message == "END":
        print(" img transport end...")
    else:
        # decoded_string = base64.b64decode(message)
        decoded_json = json.loads(message)  # 将base64code包裹在一个json对象里，python解析为dict，可以方便携带更多信息
        # print(decoded_json)
        frameId = decoded_json['frameId']
        decoded_string = base64.b64decode(decoded_json['base64code'])
        with open("recv_sfz2.jpeg", "wb") as image_file:
            image_file.write(decoded_string)
        image_file.close()

# server.send_message_to_all("Client(%d) said: %s" % (client['id'], message))

PORT=8765
server = WebsocketServer(host="10.170.0.3", port=PORT)
server.set_fn_new_client(new_client)
server.set_fn_client_left(client_left)
server.set_fn_message_received(message_received)
server.run_forever()