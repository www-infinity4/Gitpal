# Gitpal · Infinity Oracle Engineering Studio

Gitpal is the **AI engineering assistant** in the Gitpal / Gitpro / Gitpub system. This repository contains the first independent Oracle Octaves-inspired web studio, prepared for use with the first-party QuantaPhi GitHub connector. The original AI Git CLI remains separately proposed in [draft PR #1](https://github.com/www-infinity4/Gitpal/pull/1); it has **not** been silently overwritten or merged.

## Web app

Open index.html locally for a **UI preview**. When hosted on \`https://quantaphi.org\` (or \`https://www.quantaphi.org\`) with the existing QuantaPhi \`/bubbles-connections.mjs\` module and verified wallet, the studio can:

- Connect GitHub through the first-party OAuth popup, with account-scoped repository permissions.
- Select authorized repositories, prepare an engineering request with expandable fields, save/recover a device-local text draft, and insert missing integration/test/publishing steps.
- Call the **same existing GPT text service used by Story Writer** (\`/v1/chat\`) to develop a technical plan. This response is not a commit or deployment.
- Create a real Copilot issue/agent assignment through the **proposed** QuantaPhi \`/api/bubbles/connections/github/copilot\` route, inspect PR patches and comments, and submit user-directed PR feedback.
- Hand off merges to Gitpro and publish work to Gitpub after independent review and CI acceptance.

The dependent QuantaPhi backend is in [draft PR #1272](https://github.com/www-infinity4/QuantaPhi/pull/1272). These features **are not live or fully integrated** until the dependent PR passes gates, deploys, and the new UI is served on the first-party QuantaPhi origin. Opening GitHub Pages does **not** magically share account sessions from quantaphi.org; the UI directs users to the verified QuantaPhi account page instead.

## Security and automation rules

1. No GitHub PAT, OAuth access token, Cloudflare secret, user password or wallet credential is accepted as a UI login value or saved by Gitpal. The server must validate the user and authorize every GitHub operation independently.
2. AI plans and Copilot issue acceptance are **not** code-write, PR, test, merge or deployment receipts.
3. The one-click gap-fill control prepares real requirements but does not claim to know what was skipped until actual source/PR evidence is inspected.
4. Merging must require Gitpro's checks, independent review and user authorization. Existing security holds must never be bypassed.
5. The device-local draft contains text instructions only. Do not paste secrets. Use **Clear saved draft** to delete only this local draft, not any wallet token or GitHub data.
6. Cross-origin session transfer must never be implemented through raw token strings in URL parameters or through the old Gitpub XOR/base64 localStorage auth.

## Run checks

\`\`\`sh
node --check studio.mjs
node --test tests/studio.test.mjs
\`\`\`

The GitHub Actions job \`Gitpal Oracle studio validation\` runs these checks for changes to the web studio.

## Separate roles

- **Gitpal:** request intake, AI plan, PR feedback, missing-work checklist
- **Gitpro:** file edits, checks, approvals, gated merge
- **Gitpub:** preview, publish, Cloudflare linkage and verification

**Deployment checklist:** test standalone rendering; import under the QuantaPhi origin; validate popup and callback with two separate wallet identities; test read-only vs write-capable repos; verify no cross-account data; test AI failures; inspect real PR diff and checks; publish only when authorized and green.
