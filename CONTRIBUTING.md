# Contributing to WrappedNow

First off, thank you for considering contributing to WrappedNow! We appreciate the time and effort you want to spend helping us make this app better.

To ensure our project remains clean and easy to manage, we ask that you follow these guidelines for your contributions.

## Branching Guidelines

We use a simple branching model based on the "GitHub Flow". It's designed to be straightforward and minimize merge conflicts.

**There is only one long-lived branch: `main`**

-   The `main` branch is our single source of truth. It should always be stable and deployable.
-   Direct commits to `main` are not allowed. All changes must go through a Pull Request.

### The Workflow

1.  **Create a New Branch from `main`**:
    Before starting any new work, make sure your local `main` branch is up-to-date (`git pull origin main`). Then, create a new, descriptively named branch off of `main`.

    Use these prefixes for your branch names:
    -   `feature/`: For new features (e.g., `feature/spotify-data-fetching`)
    -   `fix/`: For bug fixes (e.g., `fix/login-button-crash`)
    -   `chore/`: For maintenance tasks (e.g., `chore/update-dependencies`)

    ```bash
    git checkout -b feature/your-feature-name
    ```

2.  **Work and Commit on Your Branch**:
    Make all your changes and commit them to your feature branch. Write clear and concise commit messages following our guidelines below.

3.  **Create a Pull Request (PR)**:
    When your feature is complete and tested, push your branch to GitHub and open a Pull Request to merge your branch into `main`.

4.  **Code Review**:
    Another team member must review the Pull Request. This is a crucial step to maintain code quality and share knowledge. Once the PR is approved, it can be merged into `main`.

5.  **Clean Up**:
    After your branch is merged, you can delete it from GitHub and your local repository.

## Commit Message Guidelines

We follow the **Conventional Commits** specification. This makes our commit history readable and helps automate things like generating changelogs.

### Format

Each commit message consists of a **header**, a **body**, and a **footer**.

```
<type>: <subject>

[optional body]

[optional footer]
```

### 1. Header (Subject Line)

The header is the most important part and should be a concise summary of the change.

-   **Use a Type Prefix**: Start the subject with one of the following types:
    -   **feat**: A new feature for the user.
    -   **fix**: A bug fix for the user.
    -   **build**: Changes that affect the build system or external dependencies.
    -   **chore**: Routine tasks, maintenance, or changes that don't modify src or test files.
    -   **docs**: Documentation only changes.
    -   **style**: Changes that do not affect the meaning of the code (white-space, formatting, etc).
    -   **refactor**: A code change that neither fixes a bug nor adds a feature.
    -   **test**: Adding missing tests or correcting existing tests.

-   **Use Imperative Mood**: Write what the commit *does*, not what it *did*.
    -   **Good**: `feat: Add user profile page`
    -   **Bad**: `feat: Added the user profile page`

-   **Keep it Short**: Aim for 50-70 characters maximum.

### 2. Body (Optional)

-   The body is used to explain the *why* behind the change, not the *how*.
-   Separate the body from the header with a blank line.
-   Wrap lines at around 72 characters.

### Example Commit

```
feat: Add Spotify login functionality

Implements the full OAuth 2.0 PKCE flow for Spotify authentication.
This allows users to securely log in and grant the app permissions.

- Adds a "Login with Spotify" button to the main screen.
- Includes helper functions for PKCE code generation.
- Handles the callback from Spotify to exchange the auth code for an access token.
```