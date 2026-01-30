# Contributing to Apex Yield

Thank you for your interest in contributing to Apex Yield! We welcome contributions from the community.

## Development Setup

1.  **Clone the repository:**
    ```bash
    git clone https://github.com/man-croft/ApexYield.git
    cd ApexYield
    ```

2.  **Install dependencies:**
    ```bash
    cd frontend
    npm install
    ```

3.  **Environment Variables:**
    Copy `.env.example` to `.env` (create one if missing) and set your keys.
    ```env
    VITE_WALLET_CONNECT_PROJECT_ID=your_id
    ```

4.  **Run Development Server:**
    ```bash
    npm run dev
    ```

## Project Structure

-   `contracts/`: Clarity smart contracts for Stacks.
-   `frontend/`: React + Vite application.
-   `tests/`: Clarinet tests for contracts.

## Pull Request Process

1.  Create a feature branch: `git checkout -b feature/my-feature`
2.  Commit your changes using conventional commits (e.g., `feat: add new button`).
3.  Ensure the build passes: `npm run build`
4.  Open a Pull Request against `main`.

## Code Style

-   We use **TypeScript** for type safety.
-   We use **Tailwind CSS** for styling.
-   Components should be modular and reusable.
