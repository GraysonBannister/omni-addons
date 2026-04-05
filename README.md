# omni-addons

The official add-on registry for [Omni Code](https://github.com/GraysonBannister/omni-code-website).

Add-ons extend the Omni Code AI coding assistant with new agent tools, modes, and integrations.
They are browsable on the [Omni Code website](https://graysonbannister.github.io/omni-code-website/addons)
and installable directly from within the Omni Code desktop app and Omni Go mobile app.

---

## Browse add-ons

| Add-on | Author | Description |
|---|---|---|
| [omni-prettier](addons/omni-prettier/manifest.json) | GraysonBannister | Run Prettier on files through the agent |
| [omni-git-review](addons/omni-git-review/manifest.json) | GraysonBannister | Automated PR review, diff summaries, and commit messages |
| [omni-test-runner](addons/omni-test-runner/manifest.json) | GraysonBannister | Run and fix failing tests with Jest, Vitest, and Pytest |

---

## Submit an add-on

See [CONTRIBUTING.md](CONTRIBUTING.md) for full instructions.

**Quick summary:**
1. Build your add-on in your own GitHub repo
2. Fork this repo
3. Add `addons/your-addon-id/manifest.json`
4. Open a PR — CI validates the manifest automatically
5. Merged PRs appear on the website instantly

---

## Manifest format

Each add-on folder contains a single `manifest.json`. See the
[JSON Schema](schema/manifest.schema.json) for the full spec or
[CONTRIBUTING.md](CONTRIBUTING.md) for a field-by-field reference.

---

## Validate locally

```bash
node scripts/validate.js
```

No dependencies required — runs with plain Node.js.

---

## License

Registry contents (manifests) are MIT licensed. Individual add-ons are
licensed by their respective authors.
