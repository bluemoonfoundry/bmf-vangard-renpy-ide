label start:
    scene bg room
    show eileen happy
    e "You have [points] points."
    $ flag_seen = True
    jump .sub
label .sub:
    jump chapter1
label intro:
    call chapter1_part from _call_part
    return
