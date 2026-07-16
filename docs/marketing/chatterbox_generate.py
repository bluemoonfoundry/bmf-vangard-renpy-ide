#!/usr/bin/env python
"""
chatterbox_generate.py

Local text-to-speech worker for generate_vo_local.js, using Resemble AI's
Chatterbox TTS model on a local GPU instead of the ElevenLabs API -- see
generate_vo_local.js's header comment for why (ElevenLabs quota exhausted
mid-project; this machine has an RTX 4090 idle).

Run via docs/marketing/.venv-chatterbox (created by generate_vo_local.js's
setup instructions) -- NOT the repo's global/dev Python. Chatterbox pins
torch==2.6.0/torchaudio==2.6.0, which would otherwise fight whatever torch
version other tooling on this machine needs.

Loads the model once (the slow part, ~30s) and generates every line in the
job file in that one process, rather than reloading per line. Reads a job
list, writes one .wav per line, and prints one "RESULT: {json}" line to
stdout per completed job so the calling Node process can parse progress
incrementally without waiting for the whole batch.

Usage:
  python chatterbox_generate.py --jobs jobs.json --out docs/marketing/vo
    [--voice-sample /path/to/reference.wav]
    [--exaggeration 0.5] [--cfg-weight 0.5] [--seed 0]

jobs.json: [{"id": "...", "filename": "01-hook.wav", "text": "..."}, ...]
"""
import argparse
import json
import sys
import time
from pathlib import Path


def log(msg):
    print(msg, file=sys.stderr, flush=True)


def main():
    parser = argparse.ArgumentParser()
    parser.add_argument("--jobs", required=True, help="Path to a JSON job list")
    parser.add_argument("--out", required=True, help="Output directory for .wav files")
    parser.add_argument("--voice-sample", default=None, help="Reference audio for voice cloning (optional -- uses Chatterbox's built-in voice if omitted)")
    parser.add_argument("--exaggeration", type=float, default=0.5, help="Emotion exaggeration (0-1ish); Chatterbox default")
    parser.add_argument("--cfg-weight", type=float, default=0.5, help="Classifier-free guidance weight; lower = faster/more monotone pacing")
    parser.add_argument("--seed", type=int, default=None, help="Fix the random seed for reproducible takes")
    args = parser.parse_args()

    jobs = json.loads(Path(args.jobs).read_text(encoding="utf-8"))
    out_dir = Path(args.out)
    out_dir.mkdir(parents=True, exist_ok=True)

    log("Loading torch/chatterbox...")
    t0 = time.time()
    import torch
    import torchaudio as ta
    from chatterbox.tts import ChatterboxTTS

    if args.seed is not None:
        torch.manual_seed(args.seed)

    device = "cuda" if torch.cuda.is_available() else "cpu"
    if device == "cpu":
        log("WARNING: CUDA not available in this venv -- falling back to CPU, generation will be much slower.")
    model = ChatterboxTTS.from_pretrained(device=device)
    log(f"Model loaded on {device} in {time.time() - t0:.1f}s")

    for job in jobs:
        t0 = time.time()
        try:
            kwargs = {"exaggeration": args.exaggeration, "cfg_weight": args.cfg_weight}
            if args.voice_sample:
                kwargs["audio_prompt_path"] = args.voice_sample
            wav = model.generate(job["text"], **kwargs)
            out_path = out_dir / job["filename"]
            ta.save(str(out_path), wav, model.sr)
            duration_seconds = wav.shape[-1] / model.sr
            print(f"RESULT: {json.dumps({'id': job['id'], 'filename': job['filename'], 'durationSeconds': duration_seconds})}", flush=True)
            log(f"  {job['filename']}: {duration_seconds:.2f}s ({time.time() - t0:.1f}s to generate)")
        except Exception as e:  # noqa: BLE001 -- report per-line failure, keep processing the rest
            print(f"RESULT: {json.dumps({'id': job['id'], 'filename': None, 'error': str(e)})}", flush=True)
            log(f"  {job['filename']}: FAILED -- {e}")


if __name__ == "__main__":
    main()
