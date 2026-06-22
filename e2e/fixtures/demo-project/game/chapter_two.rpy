# Aethoria Chronicles — Chapter Two: The Search

label archive_split:

    marcus "East wing. Twenty minutes."
    lyra "Don't open anything that glows."
    marcus "That is very specific advice."

    "Silence swallowed the hall."
    "Somewhere in the shelves — a book fell."

    jump discovery_lyra


label archive_together:

    lyra "Two sets of eyes are better than one in the dark."
    marcus "Agreed. Restricted section first."

    "Their footsteps echoed through vaulted corridors."
    "Every shadow seemed to watch."

    jump discovery_lyra


label archive_sentinel_route:

    sentinel "The restricted section requires a senior archivist."
    marcus "We don't have that kind of time."
    sentinel "... Room seven. Third shelf. I didn't say that."

    jump discovery_direct


label discovery_lyra:

    "Hours passed. Then—"

    lyra "Marcus. I found it."
    marcus "The Codex? Are you certain?"

    lyra "The obsidian binding. The silver clasp engraved with the Founders' mark."
    marcus "It's real."

    $ found_codex = True

    jump the_revelation


label discovery_direct:

    "Room seven. Third shelf."
    "There, wedged between two unremarkable volumes—"

    marcus "The Obsidian Codex."

    "He could feel the weight of it before he even touched it."

    $ found_codex = True

    jump the_revelation


label the_revelation:

    scene bg_reading_room with dissolve

    "The pages shimmered with an inner light as they opened it."

    lyra "Marcus. Look at this."
    marcus "The founding treaty. I've read the copies a hundred times."
    lyra "But not this version."

    marcus "This is... this can't be right."
    lyra "And yet here it is. In the founders' own hand."

    jump epilogue_beginning
