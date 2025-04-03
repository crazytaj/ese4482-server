# Setup
`npm install`
# Use
`npm start`
# Features
## Implemented
- when the client recieves an awareness event, the screen goes blue and "BEGIN TRIAL" appears. It then starts a timer that counts up (indicating time pressure but giving no time limit)
- when the client recieves an outcome event, the screen goes green or red dependant on the value of success, and displays which machine they played and WIN or LOSS.
## Planned
- seperate spectator page that shows a window of the participants play history, the current winrates of the machines, and the adjustments our models make at each adjustment event.
# Api Reference
there are currently two endpoints:
## (GET) localhost:3000
this is the web address for a participant device.
## (POST) localhost:3000/participant
to use this endpoint in python:
```python
import requests
def send_awareness():
  requests.post("localhost:3000/participant", json={"event": "awareness"})

def send_outcome(machine, success):
  requests.post("localhost:3000/participant", json={"event": "outcome","machine":machine,"success":int(success)})
```
machine can be any string, success needs to be a boolean (0,1), it can be sent as a raw boolean, an int between 0,1 or a string that contains a 0 or 1.
