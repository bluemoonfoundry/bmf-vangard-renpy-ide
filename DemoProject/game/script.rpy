

# -- Image Placeholders --
# Define your background and character images here.
# For now, these are solid colors. Replace 'Solid(...)' with 'Image("images/filename.png")'
image bg academy_gate = Image("images/bg/academy_gate.png") #Solid("#cfcfff")
image bg club_fair = Image("images/bg/club_fair.png") #Solid("#ffd8b1")
image bg library = Image("images/bg/library.png") #Solid("#f5deb3")
image bg gym = Image("images/bg/gym.png") #Solid("#add8e6")
image bg garden = Image("images/bg/garden.png") #Solid("#90ee90")
image bg art_room = Image("images/bg/art_room.png") #Solid("#d3d3d3")
image bg computer_lab = Image("images/bg/computer_lab.png") #Solid("#333333")

# You would define character sprites like this:
# image leo_neutral = "images/leo_neutral.png"
# For simplicity, we will just show the character names.

screen screen_1():
    vbox:
        hbox:
            text "Hey why are you here and not there?"
        hbox:
            button action Return()
            button action foobarbaz()

init:
    # Character sprites are 896x1280 on a 1920x1080 screen.
    # At zoom 1.0 the image is 200px taller than the viewport, causing the head
    # to be clipped at the top.  Scale to 0.844 so the full character fits within
    # the screen height, then anchor the bottom of the image to the bottom of the
    # screen so the character stands on the ground line.

    transform size_normal:
        zoom 0.844
        yanchor 1.0
        ypos 1.0

    # Override the built-in left/center/right position transforms so every
    # "show <char> at <pos>" automatically gets the correct scaling and grounding.
    transform left:
        zoom 0.844
        yanchor 1.0
        ypos 1.0
        xalign 0.0

    transform center:
        zoom 0.844
        yanchor 1.0
        ypos 1.0
        xalign 0.5

    transform right:
        zoom 0.844
        yanchor 1.0
        ypos 1.0
        xalign 1.0



# -- The game starts here --
label start:
    # Set the main character's name
    $ mc_name = persistent.mc_name

    #call screen screen_1

    # Jump to the new comprehensive branching narrative
    # "The Vanishing Artifact" - 8 stages, ~70 files, deep branching
    jump stage1_arrival
