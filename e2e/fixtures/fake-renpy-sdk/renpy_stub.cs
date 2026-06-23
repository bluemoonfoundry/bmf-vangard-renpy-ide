// Source for the fake renpy.exe E2E fixture — NOT part of the app build.
// Compiled once via:
//   "C:\Windows\Microsoft.NET\Framework64\v4.0.30319\csc.exe" /out:renpy.exe /target:exe renpy_stub.cs
// Sleeps until forcibly terminated (Node's child.kill() on Windows calls
// TerminateProcess, so no signal handling is needed) so the run/stop-game
// smoke test has a window to observe the "running" state.
using System;
using System.Threading;

class RenpyStub
{
    static void Main()
    {
        Thread.Sleep(60000);
    }
}
