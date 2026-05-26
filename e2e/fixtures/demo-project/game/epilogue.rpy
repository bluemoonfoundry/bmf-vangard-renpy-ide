# Aethoria Chronicles — Epilogue: The Weight of Truth

label epilogue_beginning:

    "The truth of Aethoria's founding lay exposed before them."
    "Every history book. Every monument. Built on this."

    marcus "This changes everything."
    lyra "Or it changes nothing. Depending on what we do with it."

    menu:
        "We have to tell people.":
            jump ending_truth

        "Some secrets are better buried.":
            jump ending_silence

        "Take it to the Council.":
            jump ending_council


label ending_truth:

    lyra "The city deserves to know who it really is."
    marcus "And so it shall. Whatever the cost."

    "They carried the truth out into the rain-soaked streets."
    "Aethoria would face its history — and choose its future."

    return


label ending_silence:

    marcus "The city runs on this myth."
    lyra "Destroy the myth and you destroy everything built upon it."

    "They closed the Codex and replaced it on its shelf."
    "Some truths, once known, can never be unknown."
    "But knowing and telling are two different things."

    return


label ending_council:

    "The Council chambers were cold at this hour."
    "The Councillors listened without expression."

    sentinel "You understand what you're asking us to do."
    marcus "I understand what we're asking you not to bury."

    "A long silence."
    "Then — slowly — the head archivist nodded."

    return
