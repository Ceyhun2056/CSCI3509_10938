# 🧱 Class Wall

Every student adds one file. Every merged pull request goes **live on the internet automatically**.

**Live site:** `https://<owner>.github.io/<repo>/` *(teacher: replace this line)*

---

## Your task (≈15 min)

### 1. Get the code
```bash
git clone https://github.com/<owner>/<repo>.git
cd <repo>
```

### 2. Make a branch
A branch is your own safe copy of the project to experiment on.
```bash
git switch -c add-<your-name>
```

### 3. Add your file
Copy the example and edit it:
```bash
cp students/_example.json students/<your-name>.json
```
```json
{
  "name": "Your Name",
  "message": "Something about you (max 140 characters)",
  "emoji": "🎸"
}
```
Want to test it before pushing? `node build.js --check`

### 4. Commit and push
```bash
git status                          # what changed?
git add students/<your-name>.json   # stage it
git commit -m "Add <your-name> to the wall"
git push -u origin add-<your-name>
```

### 5. Open a pull request
Go to the repo on GitHub → **Compare & pull request** → **Create pull request**.

### 6. Watch the robots 🤖
- **CI** runs on your pull request. ✅ green = good. ❌ red = click **Details**, read the error, fix the file, commit and push again — the PR updates by itself.
- When the teacher merges your PR, **CD** builds and deploys the site. Refresh the live site in ~1 minute and find your card!

---

## Rules
- Only add **your own** file in `students/`. Don't edit other people's files.
- File name: lowercase, no spaces — e.g. `priya-sharma.json`.
- `name` and `message` are required. `emoji` is optional.

## Bonus challenge: a merge conflict 💥
Everyone, change the single line in `motto.txt` on your branch and open a PR. The first one merges cleanly — everyone else gets a **conflict**. Pull `main` into your branch, fix the conflict, and push:
```bash
git pull origin main      # conflict appears
# open motto.txt, keep the line you want, delete the <<<<<<< ======= >>>>>>> markers
git add motto.txt
git commit
git push
```
