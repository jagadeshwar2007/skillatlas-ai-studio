# SKILLATLAS AI STUDIO — KNOWN ISSUES & RESOLUTIONS

| Issue ID | Description | Impact | Resolution Strategy | Status |
|----------|-------------|--------|---------------------|--------|
| ISS-001 | FFmpeg was missing in fresh environment | Video rendering blocked | Winget silent installation completed; PATH updated | RESOLVED |
| ISS-002 | Missing Supabase and external paid API keys | Cloud persistence & paid APIs offline | Dual-mode SQLite + procedural fallback adapters implemented | MITIGATED |
| ISS-003 | Python 3.13 deprecation of legacy C-extensions in some packages | Potential wheel build issues | Selected modern, pure-Python / up-to-date wheels (FastAPI, Pydantic v2, Uvicorn) | PREVENTED |
