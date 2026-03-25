# Google Forms Lite Clone

A simplified clone of Google Forms built with React, TypeScript, Redux Toolkit, and NestJS GraphQL.

## Setup Instructions

### Prerequisites

Before you begin, ensure you have the following installed:

- **Node.js 18+** - [Download from nodejs.org](https://nodejs.org/)
  - Verify installation: `node --version` (should be v18.0.0 or higher)
- **pnpm** (Recommended) or npm
  - Install pnpm: `npm install -g pnpm`
  - Verify pnpm: `pnpm --version`
  - (Alternatively, you can use npm: `npm --version`)
- **Git** - [Download from git-scm.com](https://git-scm.com/) (for cloning the repository)

### Installation Steps

#### Step 1: Clone the Repository

```bash
# Clone the repository to your local machine
git clone github.com/pashkanorm/google-forms-lite
cd google-forms-lite
```

#### Step 2: Install Dependencies

```bash
# Install all dependencies for the monorepo (client, server, and root)
pnpm install
```

This command will:
- Install dependencies in the root `package.json`
- Install dependencies in `client/package.json`
- Install dependencies in `server/package.json`

**If using npm instead:**
```bash
npm install
```

#### Step 3: Verify Installation

Check that everything installed correctly:

```bash
# Verify pnpm workspaces are recognized
pnpm list -r --depth=0

# This should show three packages:
# - google-forms-lite (root)
# - client
# - server
```

### Running the Application

#### Option 1: Run Both Client & Server Together (Recommended)

```bash
# Start both client and server concurrently
pnpm dev
```

This will start:
- **Frontend**: http://localhost:5173 (Vite dev server)
- **Backend**: http://localhost:3001 (NestJS server)
- **GraphQL Playground**: http://localhost:3001/graphql

**Expected Output:**
```
PNPM  Concurrently running 2 processes...

> client dev
> server dev:server

[client] VITE v5.x.x ready in xxx ms
[client]
[client] ➜  Local:   http://localhost:5173/

[server] [NestFactory] Starting Nest application...
[server] [InstanceLoader] GraphQLModule dependencies initialized
[server] [GraphQLModule] Mapped {/graphql, POST}
[server] Nest application successfully started on port 3001
```

#### Option 2: Run Client and Server Separately

If you need to run them in separate terminals:

**Terminal 1 - Start the Backend Server:**
```bash
pnpm --filter server run dev:server
```

Expected: Server runs on `http://localhost:3001`

**Terminal 2 - Start the Frontend Client:**
```bash
pnpm --filter client run dev
```

Expected: Client runs on `http://localhost:5173`

## Accessing the Application

Once both the client and server are running:

- **Frontend Application**: Open your browser and navigate to [http://localhost:5173](http://localhost:5173)
- **GraphQL Playground**: Visit [http://localhost:3001/graphql](http://localhost:3001/graphql) to explore the GraphQL API
