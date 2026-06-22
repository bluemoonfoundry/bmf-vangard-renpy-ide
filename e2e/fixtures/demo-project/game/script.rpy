# Aethoria Chronicles — Main Script

label start:

    scene bg_aethoria_night with fade

    "The city of Aethoria never sleeps."
    "Its neon-lit spires pierce clouds heavy with rain and memory."
    "Tonight, something ancient stirs beneath its streets."

    show lyra at left

    lyra "Marcus. Are you sure about this?"

    show marcus at right

    marcus "We've come too far to turn back now."

    lyra "The archive closes at midnight. We have twenty minutes."
    marcus "Then let's make every one of them count."

    jump prologue_choice


label prologue_choice:

    menu:
        "Trust Lyra's instincts.":
            $ trust_lyra = True
            jump trust_lyra_path

        "Press forward regardless.":
            jump press_forward_path

        "Check the map first.":
            $ knowledge_level += 1
            jump check_map_path
