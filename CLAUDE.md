# News Feed Eradicator

## Chrome Extension Install Location

The built extension lives at `~/news-feed-eradicator-extension`. Chrome loads it as an unpacked extension from that folder.

After making changes and confirming the user is happy with them, copy the build output to the install location:

```
cp -r build/ ~/news-feed-eradicator-extension
```

Then the user should refresh the extension in `chrome://extensions` to pick up the changes.

## Dev Workflow

- `make dev` — builds the extension into `build/` and watches for changes
- Load unpacked extension in Chrome from the `build/` folder for live testing during development
- TypeScript type check: `npx tsc --noEmit` (CSS module import errors are expected and harmless — Vite handles those at build time)

## Tech Stack

- **SolidJS** (not React) for UI
- **Vite** bundler with `vite-plugin-solid`
- **Bun** as runtime and package manager
- **Manifest V3** browser extension (Chrome + Firefox)
- **browser.storage.local** for persistence
