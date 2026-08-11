# Development

## Install as a dev extension

1. Clone this repository.
2. In Zed, open the command palette (`Cmd/Ctrl+Shift+P`) and run
   **`zed: install dev extension`**.
3. Select the cloned `zed-carve` folder.

Zed fetches the configured Tree-sitter grammar on first install. Reinstall the
dev extension after changing the pinned grammar revision in `extension.toml` so
Zed rebuilds it.

## Testing

There is no standalone Zed extension test runner in the Zed CLI. The
[`CI workflow`](../.github/workflows/ci.yml) validates the following on every
push and pull request:

- `extension.toml` is valid and pins a full grammar commit hash.
- The pinned grammar generates successfully and passes its corpus.
- Every query compiles against that exact grammar revision.
- Every fixture parses without `ERROR` or `MISSING` nodes.

To reproduce the query and fixture checks, build the grammar from a sibling
checkout at the revision pinned in `extension.toml`, then run:

```bash
tree-sitter query --scope text.carve languages/carve/highlights.scm tests/fixtures/99-kitchen-sink.crv
tree-sitter parse --scope text.carve tests/fixtures/99-kitchen-sink.crv
git diff --check
```

For manual validation, install the dev extension and open
`tests/fixtures/99-kitchen-sink.crv`. Confirm that headings, emphasis,
extensions, comments, math, code blocks, and links are highlighted.

## Fixtures

The documents under `tests/fixtures/` exercise representative real-world
syntax and support both automated parsing checks and manual validation.
