Update or create CHANGELOG.md in the project root.

## Steps

### 1 — Check whether CHANGELOG.md exists

Use the Read tool on `CHANGELOG.md` in the project root.

**If it does NOT exist**, run:
```
git log --format="%ad|||%s" --date=short
```
Collect all output lines. Group them by date (the part before `|||`). Create `CHANGELOG.md` from scratch using the format described in the "Format" section below. Include every date that has at least one commit, newest date first.

**If it DOES exist**, find the most recent date heading in the file (a line starting with `## `). Then run:
```
git log --format="%ad|||%s" --date=short --after="<most-recent-date>"
```
where `<most-recent-date>` is the date from that heading. If there are no new commits (empty output), tell the user "Geen nieuwe commits sinds <date>." and stop. Otherwise prepend the new date sections to the file, directly below the `# Changelog` heading.

### 2 — Write the file

Use the Write tool (for a new file) or the Edit tool (to prepend new sections to an existing file).

## Format

```markdown
# Changelog

## YYYY-MM-DD
- <commit message>
- <commit message>

## YYYY-MM-DD
- <commit message>
```

Rules:
- One `##` heading per date, newest date at the top.
- Each commit on its own `-` bullet under its date heading.
- Skip merge commits (messages starting with `Merge`).
- Keep commit messages as-is; do not rephrase or summarise them.
- Leave a blank line between each date section.
