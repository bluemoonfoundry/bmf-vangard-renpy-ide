label chapter1:
    $ points += 1
    $ award(2)
    show eileen sad
    if flag_seen:
        call start.sub
    call screen inventory
    jump missing_label
label chapter1_part:
    return
label intro:
    return
