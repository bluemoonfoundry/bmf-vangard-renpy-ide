# Debug System Implementation Issues

## Issue 1: Ren'Py Script-Level Instrumentation Layer

**Title:** Implement Ren'Py Script-Level Debug Instrumentation

**Description:**

Create a Python-based instrumentation layer that hooks into Ren'Py's statement execution engine to enable script-level debugging. This allows developers to debug `.rpy` files directly rather than the underlying Python code.

**Background:**

Ren'Py executes scripts as a sequence of statements (dialogue, scene, show, menu, jump, etc.). By intercepting execution at the statement level using `renpy.ast.Node.execute()`, we can provide a debugging experience that operates at the visual novel script level.

**Requirements:**

### Core Functionality
- [ ] Hook into `renpy.ast.Node.execute()` to intercept every statement before execution
- [ ] Track source location (filename, line number) for each statement from AST
- [ ] Implement breakpoint matching against file:line locations
- [ ] Support step execution modes:
  - Step Over (execute to next statement at same or lower call depth)
  - Step Into (execute to next statement, entering calls)
  - Step Out (execute until returning from current call)
- [ ] Track call stack depth for step control
- [ ] Pause execution when breakpoint or step condition is met

### State Capture
- [ ] Serialize `renpy.store` variables (user-defined variables)
  - Handle primitives (int, float, str, bool, None)
  - Handle collections (list, tuple, dict) with size limits
  - Handle custom objects (Character, etc.) with attribute inspection
- [ ] Capture call stack from `renpy.get_return_stack()`
- [ ] Capture scene state (displayed images on each layer)
- [ ] Capture active screens
- [ ] Capture character definitions

### Communication Protocol
- [ ] Establish socket connection to IDE (localhost:5679 default)
- [ ] Implement JSON-based message protocol:
  - Events: `connected`, `paused`, `resumed`
  - Commands: `setBreakpoints`, `continue`, `stepOver`, `stepInto`, `stepOut`, `evaluate`, `getVariables`
- [ ] Run command listener in background thread
- [ ] Queue and process commands during pause state
- [ ] Send pause events with full state snapshot

### Expression Evaluation
- [ ] Implement safe `eval()` in store context for watch expressions
- [ ] Return serialized results or error messages

**Implementation Notes:**

1. Create `debug_instrumentation.rpy` file that gets injected into game directory
2. Initialize with `init -1000 python:` to run before user code
3. Use `renpy.pause(0.01)` during blocking to yield to event loop
4. Normalize file paths for cross-platform compatibility
5. Handle errors gracefully to avoid breaking game execution

**Acceptance Criteria:**

- Breakpoints set by IDE cause execution to pause at correct `.rpy` line
- Step Over/Into/Out work correctly with nested label calls
- State capture includes all user variables and scene information
- Socket communication is reliable and handles disconnection gracefully
- No performance impact when not paused
- Works with both `config.developer` mode and production builds

**Technical Details:**

```python
# Key hook point
renpy.ast.Node.execute = debug_execute

# Pause mechanism
while self.paused:
    self.process_commands()
    renpy.pause(0.01)
```

**Files to Create:**
- `debug_instrumentation.rpy` - Main instrumentation layer
- `debug_protocol.md` - Protocol documentation

**Dependencies:** None

---

## Issue 2: Debug Protocol & IPC Bridge

**Title:** Implement Debug Protocol and Electron-Ren'Py IPC Bridge

**Description:**

Create the communication layer between the Electron IDE and the Ren'Py debug instrumentation. This includes the socket-based protocol, message serialization, and IPC handlers for debug commands.

**Requirements:**

### Protocol Definition
- [ ] Define JSON message format for all debug events and commands
- [ ] Document protocol specification
- [ ] Design versioning strategy for protocol evolution
- [ ] Handle message framing (newline-delimited JSON)

### IDE Debug Client (Renderer Process)
- [ ] Create `DebugClient` class to manage debug connection
- [ ] Implement connection lifecycle:
  - Connect to Ren'Py debug socket
  - Handle connection failures and retries
  - Detect disconnection and cleanup
- [ ] Implement command sending:
  - `setBreakpoints(file, lines[])`
  - `continue()`
  - `stepOver()`, `stepInto()`, `stepOut()`
  - `evaluate(expression)`
  - `getVariables()`
- [ ] Implement event receiving:
  - `onConnected()`
  - `onPaused(location, state)`
  - `onResumed()`
  - `onOutput(text)`
- [ ] Provide TypeScript types for all messages

### IPC Handlers (Main Process)
- [ ] Add `ipcMain` handlers for debug operations
- [ ] Implement `debug:launchWithDebug` to start Ren'Py with instrumentation
  - Inject `debug_instrumentation.rpy` into game directory
  - Pass debug port via environment variable or command line
  - Track debug-enabled process separately
- [ ] Implement `debug:attachToProcess` for attaching to running process
- [ ] Implement `debug:detach` for cleanup
- [ ] Handle process termination and cleanup of injected files

### Debug Context Provider
- [ ] Create `DebugContext` provider for React components
- [ ] Manage debug state:
  - `isDebugging: boolean`
  - `isPaused: boolean`
  - `pausedLocation: {file, line} | null`
  - `currentState: DebugState | null`
  - `breakpoints: Map<file, Set<line>>`
- [ ] Provide debug control methods:
  - `startDebugging(projectPath)`
  - `stopDebugging()`
  - `toggleBreakpoint(file, line)`
  - `continue()`, `stepOver()`, `stepInto()`, `stepOut()`
- [ ] Emit events for UI updates

**Protocol Specification (Example):**

```typescript
// Events (Ren'Py -> IDE)
interface PausedEvent {
  type: 'paused';
  reason: 'breakpoint' | 'step' | 'exception';
  location: {
    file: string;
    line: number;
  };
  state: {
    variables: Record<string, VariableValue>;
    callstack: StackFrame[];
    currentLabel: string;
    scene: SceneState;
    characters: Record<string, CharacterInfo>;
  };
}

// Commands (IDE -> Ren'Py)
interface SetBreakpointsCommand {
  type: 'setBreakpoints';
  id?: string;
  filename: string;
  lines: number[];
}

interface ContinueCommand {
  type: 'continue';
}

// ... etc
```

**Acceptance Criteria:**

- Debug client can connect/disconnect reliably
- All commands are properly serialized and sent
- All events are received and parsed correctly
- Type safety for all protocol messages
- Connection survives Ren'Py restarts (with manual reconnect)
- Error handling for network issues and malformed messages
- Debug context provides reactive state for UI components

**Files to Create:**
- `src/contexts/DebugContext.tsx` - React context provider
- `src/lib/debugClient.ts` - Socket client for debug protocol
- `src/types/debug.ts` - TypeScript types for protocol messages
- `electron/debugHandler.js` - IPC handlers for debug operations
- `docs/DEBUG_PROTOCOL.md` - Protocol documentation

**Dependencies:**
- Issue 1 (Ren'Py Instrumentation Layer)

---

## Issue 3: Debug UI Components

**Title:** Implement Debug UI Components and Editor Integration

**Description:**

Create the user-facing debugging interface including debug toolbar, breakpoint gutter, variables panel, call stack view, and watch expressions. Integrate with existing Monaco editor and canvas system.

**Requirements:**

### Debug Toolbar
- [ ] Create `DebugToolbar` component with controls:
  - Play/Pause (continue execution)
  - Step Over button
  - Step Into button
  - Step Out button
  - Stop Debugging button
  - Restart button (stop + start)
- [ ] Show debug status indicator (connected, paused, running)
- [ ] Disable controls when not in valid state
- [ ] Add keyboard shortcuts (F5=continue, F10=step over, F11=step in, Shift+F11=step out)

### Breakpoint Gutter Integration
- [ ] Add breakpoint gutter to Monaco editor instances
- [ ] Show breakpoint indicators on lines with breakpoints
- [ ] Handle click in gutter to toggle breakpoint
- [ ] Visual distinction for:
  - Enabled breakpoint (red dot)
  - Disabled breakpoint (gray dot)
  - Current execution line (yellow arrow)
- [ ] Sync breakpoints with `DebugContext` when file is edited
- [ ] Persist breakpoints across IDE restarts (in project settings)

### Variables Panel
- [ ] Create `VariablesPanel` component
- [ ] Display variables in tree/list view:
  - Variable name
  - Variable type
  - Variable value (with truncation for long values)
- [ ] Support expanding collections (lists, dicts, objects)
- [ ] Show variable changes (highlight when value changes)
- [ ] Implement virtual scrolling for large variable lists
- [ ] Add search/filter for variables
- [ ] Add "Copy Value" action

### Call Stack Panel
- [ ] Create `CallStackPanel` component
- [ ] Display stack frames with:
  - Label/function name
  - File name and line number
  - Click to navigate to source location
- [ ] Highlight current frame
- [ ] Show frame depth/nesting visually

### Watch Expressions Panel
- [ ] Create `WatchPanel` component
- [ ] Allow adding/removing watch expressions
- [ ] Evaluate expressions when paused
- [ ] Show expression results or errors
- [ ] Persist watch expressions across sessions
- [ ] Support Ren'Py expression syntax

### Scene State Inspector
- [ ] Create `SceneInspector` component (Ren'Py-specific)
- [ ] Display current scene state:
  - Active layers and shown images
  - Character positions/emotions
  - Active screens
- [ ] Link to asset files when clicked
- [ ] Show visual preview if possible

### Debug Layout
- [ ] Add debug perspective/layout mode
- [ ] Panel arrangement:
  - Left: File explorer (existing)
  - Center: Editor with breakpoint gutter
  - Right: Debug panels (variables, call stack, watch, scene)
  - Bottom: Debug console/output
- [ ] Remember panel sizes and positions
- [ ] Toggle panels on/off

### Editor Integration
- [ ] Highlight current execution line in editor
- [ ] Scroll to execution line when paused
- [ ] Show inline variable values on hover (if paused)
- [ ] Disable editing while paused (optional)

**Acceptance Criteria:**

- All debug controls work reliably and provide visual feedback
- Breakpoints can be toggled in editor gutter
- Current execution line is clearly visible
- Variables panel updates in real-time when paused
- Call stack is accurate and navigable
- Watch expressions evaluate correctly
- Layout is usable and intuitive
- Keyboard shortcuts work as expected
- UI is responsive and doesn't block editor usage

**Design Considerations:**

- Follow VS Code debug UI patterns (familiar to developers)
- Use existing Tailwind styling and dark mode support
- Integrate with existing split pane system
- Match existing IDE aesthetic

**Files to Create:**
- `src/components/debug/DebugToolbar.tsx`
- `src/components/debug/VariablesPanel.tsx`
- `src/components/debug/CallStackPanel.tsx`
- `src/components/debug/WatchPanel.tsx`
- `src/components/debug/SceneInspector.tsx`
- `src/hooks/useDebugEditorIntegration.ts`
- `src/lib/monacoBreakpoints.ts` - Monaco breakpoint gutter logic

**Dependencies:**
- Issue 2 (Debug Protocol & IPC Bridge)

---

## Issue 4: Debug System Integration and Launch

**Title:** Integrate Debug System with IDE and Implement Debug Launch

**Description:**

Tie together all debug components and implement the debug launch workflow. This includes injecting instrumentation, managing debug processes, handling project settings, and ensuring seamless integration with existing IDE features.

**Requirements:**

### Debug Launch Workflow
- [ ] Implement "Start Debugging" command/button
  - Validate project setup (Ren'Py executable configured)
  - Inject `debug_instrumentation.rpy` into project's `game/` directory
  - Launch Ren'Py process with debug flag
  - Connect debug client to instrumentation
  - Initialize debug UI
- [ ] Implement "Stop Debugging" command
  - Disconnect debug client
  - Terminate Ren'Py process
  - Remove injected instrumentation file
  - Restore normal UI mode
- [ ] Handle restart workflow
  - Preserve breakpoints
  - Reconnect to new process

### Process Management
- [ ] Extend `useRenpyProcess` hook for debug mode
- [ ] Track debug process separately from normal launch
- [ ] Handle debug port allocation (find free port)
- [ ] Detect when Ren'Py process exits during debugging
- [ ] Clean up resources on IDE shutdown

### Instrumentation Injection
- [ ] Copy `debug_instrumentation.rpy` to `game/` directory on launch
- [ ] Parameterize debug port in injected file
- [ ] Verify instrumentation is loaded correctly
- [ ] Remove instrumentation on stop (don't leave in project)
- [ ] Handle case where file already exists (warn user)

### Project Settings Integration
- [ ] Add debug configuration to `ProjectSettings`:
  - Default debug port
  - Auto-start debugging option
  - Breakpoint persistence
  - Debug log level
- [ ] Add UI for debug settings in project settings modal
- [ ] Save/load breakpoints per project

### Canvas Integration
- [ ] Show execution indicator on canvas blocks when paused
- [ ] Highlight current label on RouteCanvas
- [ ] Sync canvas view with current execution location
- [ ] Allow setting breakpoints from canvas (click on block)

### Menu Integration
- [ ] Add "Debug" menu with actions:
  - Start/Stop Debugging (F5)
  - Step Over (F10)
  - Step Into (F11)
  - Step Out (Shift+F11)
  - Toggle Breakpoint (F9)
  - Restart (Ctrl+Shift+F5)
- [ ] Add context menu items to editor
- [ ] Add toolbar buttons to main IDE toolbar

### Error Handling
- [ ] Handle instrumentation load failures
- [ ] Handle connection failures (Ren'Py not responding)
- [ ] Handle protocol version mismatches
- [ ] Show error messages in debug console
- [ ] Provide troubleshooting guidance

### Documentation
- [ ] User guide section on debugging
- [ ] Document keyboard shortcuts
- [ ] Document troubleshooting steps
- [ ] Include screenshots of debug UI

**Launch Sequence:**

```
1. User clicks "Start Debugging" or presses F5
2. IDE validates Ren'Py is configured
3. IDE finds free port (e.g., 5679)
4. IDE copies debug_instrumentation.rpy to game/ with port configured
5. IDE launches Ren'Py process with --developer flag
6. IDE waits for connection on debug port (with timeout)
7. Instrumentation connects, sends 'connected' event
8. IDE syncs all current breakpoints
9. IDE switches to debug layout
10. User's game starts, execution pauses at first breakpoint
```

**Acceptance Criteria:**

- Debug launch works reliably from clean state
- Breakpoints persist across debug sessions
- Canvas highlights current execution location
- All menus and shortcuts work correctly
- Error cases are handled gracefully with clear messages
- Debug session cleanup is thorough (no leftover files/processes)
- Documentation is complete and accurate
- Works on macOS, Windows, and Linux

**Files to Create:**
- `src/hooks/useDebugLaunch.ts` - Launch workflow logic
- `src/components/debug/DebugSettingsPanel.tsx` - Settings UI
- `docs/user-guide/DEBUGGING.md` - User documentation
- Update `electron.js` with debug launch handlers
- Update `App.tsx` to integrate debug context
- Update existing menus to add debug actions

**Dependencies:**
- Issue 1 (Ren'Py Instrumentation Layer)
- Issue 2 (Debug Protocol & IPC Bridge)
- Issue 3 (Debug UI Components)

---

## Implementation Order

1. **Issue 1** (Instrumentation Layer) - Can be developed and tested standalone with a test Ren'Py project
2. **Issue 2** (Protocol & IPC Bridge) - Requires Issue 1 for testing, but no UI dependencies
3. **Issue 3** (Debug UI Components) - Requires Issue 2 for functionality, can be stubbed for visual development
4. **Issue 4** (Integration) - Requires all previous issues

## Testing Strategy

- **Unit Tests**: Protocol serialization, state capture logic, breakpoint matching
- **Integration Tests**: Full debug workflow with sample Ren'Py project
- **Manual Testing**: Real visual novel projects with complex control flow
- **Performance Testing**: Ensure minimal overhead when not paused

## Related Issues

- #[existing canvas issue] - Canvas execution highlighting
- #[existing settings issue] - Project settings persistence
