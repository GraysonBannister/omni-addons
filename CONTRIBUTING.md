# Contributing an Add-on

Anyone can submit an add-on to the Omni Code registry. Merged manifests
immediately appear on the [Omni Code website](https://omni-code.dev/addons)
and are installable from within the Omni Code desktop app and Omni Go mobile app.

---

## What is an add-on?

An add-on is a JavaScript module that extends Omni Code with new **agent tools**,
**modes**, or **integrations**. The registry is just a list of `manifest.json`
files — your actual code lives in your own GitHub repo.

---

## Step 1 — Build your add-on

Your add-on repo should have this minimal structure:

```
my-addon/
  index.js        ← entrypoint loaded by Omni Code
  package.json    ← optional, for dependencies
  README.md
```

The `index.js` file exports a default object that Omni Code loads:

```js
// index.js
module.exports = {
  name: "My Addon",
  version: "1.0.0",

  // Called once when the add-on is activated
  activate(context) {
    // context.registerTool({ name, description, execute })
    // context.registerMode({ name, systemPrompt })
  },

  // Called when the add-on is deactivated
  deactivate() {},
};
```

Make sure your repo has a downloadable zip. GitHub provides one automatically:
```
https://github.com/YOUR_USERNAME/YOUR_REPO/archive/refs/heads/main.zip
```

---

## Step 2 — Create a manifest

Fork this repo and create a folder in `addons/` matching your add-on's ID:

```
addons/
  my-addon-id/
    manifest.json
```

The folder name **must exactly match** the `id` field in your manifest.

### `manifest.json` fields

| Field | Required | Description |
|---|---|---|
| `id` | ✓ | Unique kebab-case ID (matches folder name) |
| `name` | ✓ | Human-readable display name |
| `description` | ✓ | Short description (10–200 chars) |
| `author` | ✓ | Your GitHub username |
| `version` | ✓ | Semver string (e.g. `1.0.0`) |
| `repo` | ✓ | GitHub URL of your add-on repo |
| `download` | ✓ | Direct URL to a zip of your add-on |
| `entrypoint` | ✓ | Relative path to your main JS file (e.g. `index.js`) |
| `tags` | — | Array of category tags (kebab-case, max 8) |
| `minOmniCodeVersion` | — | Minimum Omni Code version required |
| `platforms` | — | `["desktop"]`, `["mobile"]`, or `["desktop","mobile"]` |
| `homepage` | — | URL to documentation or a demo |

### Example

```json
{
  "id": "my-addon",
  "name": "My Addon",
  "description": "A short description of what this add-on does for the agent.",
  "author": "your-github-username",
  "version": "1.0.0",
  "tags": ["category", "language"],
  "repo": "https://github.com/your-github-username/my-addon",
  "download": "https://github.com/your-github-username/my-addon/archive/refs/heads/main.zip",
  "entrypoint": "index.js",
  "minOmniCodeVersion": "2.0.0",
  "platforms": ["desktop", "mobile"]
}
```

---

## Step 3 — Open a pull request

1. Fork this repo
2. Create your `addons/my-addon-id/manifest.json`
3. Open a PR against `main`

GitHub Actions will automatically validate your manifest. Fix any errors
reported in the CI check before requesting a review.

**PR requirements:**
- One add-on per PR
- The add-on repo must be public
- The `download` URL must be accessible without authentication
- The add-on must not contain malicious code

---

## Updating an existing add-on

To release a new version, open a PR that bumps the `version` field in your
existing manifest. Do not change the `id`.

---

## Removing an add-on

Open a PR removing your manifest folder. Only the original author or a
maintainer can remove an add-on.

---

## Questions?

Open an issue or start a [Discussion](https://github.com/GraysonBannister/omni-addons/discussions).
