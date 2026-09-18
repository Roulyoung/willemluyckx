# TopFit Running

## Project info

**URL**: https://topfitrunning.com/

## Project Docs

This repo uses a small set of project-specific setup docs:

- `PROJECT_KEYS_REGISTER.md`
- `PROJECT_SECRETS_PLAYBOOK.md`
- `GOOGLE_SHEETS_ACCESS.md`
- `PAYMENTS_EMAILS_IMPLEMENTATION.md`
- `PAYMENTS_EMAILS_LIVE_RUNBOOK.md`

## Content Editing (Codex-friendly)

Primary site copy is centralized in:

- `src/content/siteContent.ts`

Update text there first to keep sections consistent without changing layout components.

## How can I edit this code?

There are several ways of editing your application.

**Use Lovable**

Simply visit the live site at [TopFit Running](https://topfitrunning.com/) and continue from there.

Changes made via Lovable will be committed automatically to this repo.

**Use your preferred IDE**

If you want to work locally using your own IDE, you can clone this repo and push changes. Pushed changes will also be reflected in Lovable.

The only requirement is having Node.js & npm installed - [install with nvm](https://github.com/nvm-sh/nvm#installing-and-updating)

Follow these steps:

```sh
# Step 1: Clone the repository using the project's Git URL.
git clone <YOUR_GIT_URL>

# Step 2: Navigate to the project directory.
cd <YOUR_PROJECT_NAME>

# Step 3: Install the necessary dependencies.
npm i

# Step 4: Start the development server with auto-reloading and an instant preview.
npm run dev
```

**Edit a file directly in GitHub**

- Navigate to the desired file(s).
- Click the "Edit" button (pencil icon) at the top right of the file view.
- Make your changes and commit the changes.

**Use GitHub Codespaces**

- Navigate to the main page of your repository.
- Click on the "Code" button (green button) near the top right.
- Select the "Codespaces" tab.
- Click on "New codespace" to launch a new Codespace environment.
- Edit files directly within the Codespace and commit and push your changes once you're done.

## What technologies are used for this project?

This project is built with:

- Vite
- TypeScript
- React
- shadcn-ui
- Tailwind CSS

## How can I deploy this project?

The live project is currently deployed at [https://topfitrunning.com/](https://topfitrunning.com/).

## Can I connect a custom domain to my Lovable project?

Yes, you can!

The live domain for this project is [https://topfitrunning.com/](https://topfitrunning.com/).

If you need to adjust hosting or domain routing, use the current deployment setup rather than the generic Lovable walkthrough.
