define e = Character("Eileen")
define config.name = "Demo"
default points = 0
default persistent.seen_intro = False
image eileen happy = "eileen_happy.png"
image bg room = "room.png"
transform slide:
    xalign 0.5
init python:
    def award(n):
        global points
        points += n
        return points
