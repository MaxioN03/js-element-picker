Run `git diff --staged` to see all staged changes.

If there are no staged changes, tell the user and stop.

Based on the diff, create a single commit message in Conventional Commits style:

```
<type>[optional scope]: <description>
```

- Pick the most appropriate type: feat, fix, build, chore, ci, docs, style, refactor, perf, test
- Keep the description short, lowercase, no period at the end
- Do not add Co-Authored-By

Then run `git commit -m "<message>"` with that message.
