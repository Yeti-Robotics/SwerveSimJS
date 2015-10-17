# SwerveSimJS
-------------

A repository for a JS project that shows we can program a swerve drive
## Keyboard Controls:
- WS to modify forward/reverse vertexes
- AD to modify strafe vertexes
- QE to modify rotation vertexes
- arrow keys to modify bases position (test feature)
- ZX to modify bases rotation (test feature)
- Backspace to reset

## Gamepad Controls:
- Back to reset (also changes modes)
- Two modes, press left stick (and pray) to switch:

#### First Mode (Vertex Mode):
 - Left stick to control X and Y vectors
 - Right stick to control rotation

#### Second Mode (Freespin Mode)
 - Vectors still show, but also approximates drive base movements (not perfectly accurate)
 - Left stick to move base
 - Right stick to rotate


## TODO:
- Make movement (and maybe position) dependent on aggregation of vertexes
- Display actual values to make look more "Mathy"

## Resources
- [Swerve drive math](http://www.chiefdelphi.com/media/papers/2426 "aka robot-centric and field-centric wheel speeds and wheel steering angles for a vehicle with four-wheel independent drive and independent steering. Thanks Ether")
