# Public Documentation Policy

Public OpenWave repositories must not publish internal working context or authorship traces that are unrelated to the standard.

## Rules

- Keep internal continuation notes outside public repositories.
- Do not commit `AGENT_CONTEXT.md` or similar operator notes to public branches.
- Run the public-surface check before pushing docs or committed site output.
- Treat committed generated docs as public source, not disposable build output.

## Blocked markers

The public-surface guard currently blocks:

- `AGENT_CONTEXT`
- `Codex`
- `OpenAI`
- `ChatGPT`
- `GPT`
- `AI generated`

Only publish material that is intentionally part of the public standard or public developer documentation.
