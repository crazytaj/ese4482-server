# Setup
`npm install`
# Use
`npm start`
# Features
## Implemented
- when the client recieves an awareness event, the screen goes blue and "BEGIN TRIAL" appears. It then starts a timer that counts up (indicating time pressure but giving no time limit)
- when the client recieves an outcome event, the screen goes green or red dependant on the value of success, and displays which machine they played and WIN or LOSS.
- seperate spectator page that shows a recent window of the participants play history, a low poll rate top down view of the arena and the participant, the current winrates of the machines, and the adjustments our models make at each adjustment event.
## Planned
- clean up the play history section: make the most recent outcome larger and distinct, indicate the direction of time with gradient opacity(?), maybe indicate what our model had predicted
- make the machine info section more informative: display current real and experienced winrates (maybe a wins / losses), a seperate section for the behavioral and mocap adjustments and add a visual indicator for the top pick of each model (the most negative adjustment).
- maybe add some sort of overall accuracy for each models predictions, alongside the participants overall winrate / balance
- try to make the layout and color scheme less harsh. But I'm no front-end developer so well see...
# Api Reference
there are currently four endpoints:
## (GET) localhost:3000
this is the web address for a participant device.
## (GET) localhost:3000/spectator
this is the web address for the spectator view.
*note: the spectator client receives **outcome** events from the /participant endpoint to avoid duplicates*
## (POST) localhost:3000/spectator
to use this endpoint in python:
```python
import requests
  # winrates =    np.ones(numberOfMachines) 
  #               winrates after the adjustments were applied
  # adjustments = np.ones(numberOfMachines)
  #               adjustments your model output
  def send_position(x,z,theta):
    requests.post("localhost:3000/spectator",json={"event":"playerPosition","x":float(x),"z":float(z),"theta":float(theta)})

  def send_adjustment(winrates,adjustments):
    requests.post("localhost:3000/spectator",json={"event":"machineAdjustment","winrates":winrates,"adjustments":adjustments})
```
it assumes an ordering of 1,2,3,4 for the corresponding machine indices.

## (POST) localhost:3000/participant
to use this endpoint in python:
```python
import requests
def send_awareness():
  requests.post("localhost:3000/participant", json={"event": "awareness"})

def send_outcome(machine, success):
  requests.post("localhost:3000/participant", json={"event": "outcome","machine":machine,"success":int(success)})
```
machine should be an int (or a string) between 1 and 4, success needs to be a boolean (0,1), it can be sent as a raw boolean, an int between 0,1 or a string that contains a 0 or 1.
