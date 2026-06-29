#!/bin/sh
# Stub Ren'Py executable for E2E tests — satisfies checkRenpyPath's
# fs.access(X_OK) check without launching a real Ren'Py SDK.
# Sleeps until killed so the run/stop-game smoke test has a window to
# observe the "running" state before sending SIGTERM via the Stop button.
trap 'exit 0' TERM INT
sleep 60 &
wait $!
