# Aethoria Chronicles — Chapter One: The Archive

label trust_lyra_path:

    lyra "Something doesn't feel right about that alley."
    marcus "Your instincts have never failed us."
    lyra "We go the long way. Through the market square."

    jump chapter_one_arrival


label press_forward_path:

    marcus "Fear has no power over us tonight."
    lyra "Determination can be its own blindness, Marcus."
    marcus "Then let it blind us to everything but the truth."

    jump chapter_one_arrival


label check_map_path:

    marcus "Good thinking. The archive entrance — two blocks north."
    lyra "Old habits die hard, Detective."
    marcus "Some habits are worth keeping."

    jump chapter_one_arrival


label chapter_one_arrival:

    scene bg_archive_exterior with dissolve

    "They reached the Aethorian Chronicle as midnight bells echoed."

    lyra "Oldest library in the known world."
    marcus "And our only lead on the Obsidian Codex."

    sentinel "The archive is closed."

    marcus "We have authorisation. Inspector Veil, City Watch."
    sentinel "Inspector."

    "The sentinel stepped aside, face unreadable."

    jump chapter_one_interior


label chapter_one_interior:

    scene bg_archive_hall with dissolve

    "The archive's vaulted ceiling disappeared into shadow above them."
    "Ten thousand years of Aethoria's history, shelved and catalogued."

    lyra "We split up or stay together?"

    menu:
        "Split up — cover more ground.":
            jump archive_split

        "Stay together — it's safer.":
            jump archive_together

        "Ask the sentinel for help.":
            jump archive_sentinel_route
