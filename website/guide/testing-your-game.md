# Testing Your Game

At some point, every visual novel developer stops writing and starts asking the question that actually matters: "Does this look right when the player sees it?" Writing dialogue in a code editor is one thing. Watching it unfold with character sprites, backgrounds, music, and timed transitions is something else entirely.

The difference between reading a line of script and experiencing that line as a player is enormous. Pacing feels different. A transition that seemed fine in code might feel sluggish when you actually sit through it. A joke that looked funny on screen might fall flat with the wrong timing.

Vangard Studio gives you three tools to make that feedback loop as short as possible: a one-key game launcher, a warp system that teleports you to any scene, and a drafting mode that lets you run unfinished projects without crashing on missing art.

## Running Your Game

Press `F5`. That is all it takes.

Vangard Studio launches the Ren'Py engine as a child process, passing your project directory straight to it. Your visual novel boots in its own window, and you can interact with it exactly as a player would -- click through dialogue, make choices, watch transitions play out. The green play button in the toolbar turns into a red stop button while the game is running, so you always know the current state at a glance.

When you are done testing, press `Shift+F5` (or click that red stop button) and the game process shuts down cleanly. You are back in the IDE, ready to edit. No manual window-switching, no hunting for a terminal to kill a process.

The core workflow looks like this:

1. Write or edit a scene in the code editor.
2. Press `Ctrl+S` to save.
3. Press `F5` to launch.
4. Watch your scene play out in the Ren'Py window.
5. Press `Shift+F5` to stop.
6. Fix what needs fixing.
7. Repeat.

This tight loop means you spend less time fumbling between applications and more time polishing your story. Noticed that a `with dissolve` transition feels too slow? Stop the game, change the duration, save, relaunch. The whole cycle takes seconds.

Many developers coming from other engines are used to a more cumbersome testing cycle -- export, wait for a build, open the build, navigate to the right scene. With Ren'Py and Vangard Studio, the cycle is nearly instantaneous because Ren'Py interprets scripts directly. There is no compilation step. The version of your code on disk is the version Ren'Py reads.

A few things worth knowing about the run/stop behavior:

- Only one game instance runs at a time. If the game is already running, the Run button is replaced by the Stop button -- you cannot accidentally launch a second copy.
- If the game crashes or exits on its own (for example, from a Ren'Py exception), the IDE detects that the process ended and switches the toolbar back to the Run button automatically.
- The IDE saves all unsaved files before launching, so you never have to worry about testing stale code. Hit `F5` and the latest version of every file goes to Ren'Py.

There is one prerequisite: you need a valid **Ren'Py SDK path**. If you have not set one yet, open `Settings` (`Ctrl+,` / `Cmd+,`) and browse to your Ren'Py SDK directory. The IDE validates the path and shows it in the settings panel. If the Run button appears grayed out, your SDK path is either missing or invalid -- double-check that it points to the correct SDK folder (the one containing `renpy.exe` on Windows or `renpy.sh` on macOS/Linux).

## Warp to Label

Here is the problem every visual novel developer hits sooner or later.

You are working on the climactic confrontation in Chapter 5. To test it, you have to launch the game, click through the title screen, sit through the opening monologue, pick dialogue options for four earlier chapters, and finally arrive at the scene you actually want to see. Then you find a typo, stop the game, fix it, and repeat the entire twenty-minute journey.

**Warp to Label** eliminates this entirely.

Press `Ctrl+Shift+G` (`Cmd+Shift+G` on macOS), or click the Warp button in the toolbar -- the target icon sitting next to the Run button. A label picker appears, listing every label in your project. Select one, and the IDE launches your game directly at that label. No title screen. No clicking through earlier scenes. You land exactly where you need to be.

![The Warp to Label picker, fuzzy-filtered to "stage" and listing matching labels from the project](/warp-to-label-modal.png)

Behind the scenes, the IDE uses Ren'Py's `--warp` command-line flag. It resolves the label to a `filename.rpy:line_number` target format and passes it directly to the engine. Ren'Py also skips the main menu and splashscreen automatically during a warp, so you land in-scene without delay.

The label picker supports fuzzy search, so you do not need to remember exact label names. Start typing a few letters -- `conf` to find `chapter5_confrontation`, for instance -- and the list narrows instantly. This is the same picker used by the Go-to-Label command (`Ctrl+G`) on the canvases, so if you already know that search interface, Warp to Label will feel immediately familiar.

Imagine you have a label called `chapter5_confrontation` in a file called `chapter5.rpy`. When you select it in the Warp picker, the IDE resolves it to something like `chapter5.rpy:142` and launches Ren'Py with `--warp chapter5.rpy:142`. You see your scene in seconds.

### Variable Overrides

There is a catch with warping. If your Chapter 5 scene references a variable like `mc_name` that the player normally sets in Chapter 1, or an `affection` counter that accumulates across chapters, the game will either crash or display a placeholder value. The **Variable Overrides** modal solves this.

When you select a warp target, the IDE presents a modal where you can set values for any variables that would normally be established earlier in the story. Variables are grouped into two categories:

- **Default variables** -- these come from `default` declarations in your code, like `default mc_name = "Player"` or `default affection = 0`. The IDE pre-fills them with their declared initial values, so you often do not need to change anything. If the defaults are what you want, just leave them as-is.
- **Interpolated variables** -- these are detected from text interpolation patterns like `[mc_name]` in your dialogue strings. The IDE scans your translatable text (skipping system files like `options.rpy`, `gui.rpy`, and `screens.rpy`) to find variable references. If it finds an interpolated name that does not match any `default` declaration, it adds it to the override list with a sensible placeholder value of `default_<name>`.

You can adjust any of these values before launching. Need to test the scene where the player's name is "Sakura" and their affection score is 75? Type those values in. The IDE is smart about value types -- plain words like `Sakura` are automatically quoted as strings, while numbers like `75`, boolean values like `True`, and Python expressions are left as-is.

When you click launch, the IDE writes a temporary file called `_ide_after_warp.rpy` in your game directory. This file contains a `label after_warp:` block that sets all your override variables using Python assignment statements. Ren'Py's warp system automatically calls this label before resuming at your target. When the game stops, the IDE deletes the temporary file automatically -- your project directory stays clean, and the override file never gets committed to version control by accident.

One edge case worth knowing: if your project already defines its own `label after_warp` (some developers use this hook for custom debugging logic), the IDE detects the conflict and shows a warning in the modal. It will not create a duplicate label, because that would cause Ren'Py to throw an error at launch. In that situation, you will need to manage your variable overrides through your own `after_warp` label instead.

### Other Ways to Warp

The `Ctrl+Shift+G` label picker is not the only entry point. You can also warp from:

- **The code editor**: right-click a label line and choose `Warp to here` from the context menu. This is perfect when you are already staring at the exact label you want to test -- no need to open a picker and search for it.
- **Any canvas node**: right-click a node on the Flow Canvas or Choices Canvas and select the warp option from the context menu. See an interesting branch you want to test? Jump straight there from the visual map.

Warp to Label changes how you develop visual novels. Instead of treating testing as a slow, sequential process where you replay your entire game to reach one scene, you treat it like random access -- jump to any point in your story in seconds. This is especially transformative for games with complex branching, where reaching a specific branch through normal play might require a precise sequence of earlier choices.

Consider a concrete example. Your game has a branching romance route where the player can only reach the confession scene if they chose to visit the library in Chapter 2, helped the character in Chapter 3, and picked the right dialogue option in Chapter 4. Without Warp, testing the confession scene means playing through all three earlier chapters and making exactly the right choices each time. With Warp, you select `confession_scene` from the picker, set `romance_points` to `15` in the variable overrides, and you are there in two seconds.

## Drafting Mode

What if your artist has not finished the character sprites yet? Or your composer has not delivered the background music? Normally, Ren'Py would throw an error -- or simply crash -- when it tries to display an image or play an audio file that does not exist on disk.

**Drafting Mode** handles this gracefully. Toggle it on with the switch in the toolbar (the pen icon on the right side). The toggle turns green when active.

![The toolbar with the Drafting Mode toggle switched on, next to the Run and Warp to Label buttons](/drafting-mode-toolbar.png)

With Drafting Mode enabled, the IDE tells Ren'Py to substitute placeholders for any missing assets:

- **Missing images** appear as gray rectangles with the asset name displayed as text. So if your script calls `show eileen happy` but the sprite does not exist yet, the player sees a gray box labeled "eileen happy" at the correct screen position. You can see exactly where the character will eventually appear, and the scene layout still makes sense.
- **Missing audio** is replaced with silence. Your `play music "romantic_theme.ogg"` and `play sound "door_slam.wav"` statements execute without errors, and the rest of the scene continues normally. Timing-dependent sequences still work -- they just play in silence. This means your `queue music` chains, `play sound` effects, and any `renpy.music.is_playing()` checks behave correctly -- the engine treats the silence as a real audio track.

This is invaluable for writers who want to test story flow, pacing, and branching logic before the art and audio pipeline catches up. You can write your entire visual novel, test every path and every choice, and defer asset creation to a later phase without ever seeing an error screen. It also works well for prototyping -- you can sketch out a new scene with placeholder assets, test whether the pacing feels right, and only commission the real artwork once you are happy with the structure.

When your assets are ready, toggle Drafting Mode off. The IDE stops injecting placeholders, and Ren'Py uses your actual image and audio files. If any assets are still missing at that point, the Diagnostics panel will flag them so you know exactly what remains to be created.

Drafting Mode pairs naturally with Warp to Label. You can warp to any scene in your project and see it play out with placeholder art, testing dialogue pacing, choice logic, and variable behavior -- all without a single finished asset. This combination makes it possible to play-test your entire visual novel on day one of development.
