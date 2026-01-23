# Temporal Workflow Agent

A minimal but production-minded workflow agent system built with **Temporal**, **Node.js**, **Next.js**, and **TypeScript**.

## Architecture

The system consists of three main components:
1.  **Temporal Worker**: A standalone Node.js service that hosts the workflows and activities.
2.  **Temporal Workflow**: orchestrates the "agent" logic by calling multiple activities (tools) in a deterministic manner.
3.  **Next.js Frontend**: Provides a UI to trigger and monitor workflow executions.

### Why Temporal?
Temporal is used as the orchestration engine because it provides:
- **Fault Tolerance**: If a worker crashes, Temporal automatically restarts the workflow on another worker from the last state.
- **Durable Execution**: Workflows can run for seconds or years reliably.
- **Observability**: Every step of the workflow is recorded and can be inspected.
- **Retries**: Built-in retry policies for activities make handling flaky tools trivial.

### Failure and Retry Handling
- Each activity has a defined `retryPolicy` with exponential backoff.
- Timeouts (StartToClose) ensure that hanging activities are detected and retried.
- The workflow itself is deterministic, ensuring that it can be replayed safely if needed.

## Setup Instructions

### Prerequisites
- Node.js (v18+)
- Temporal Server running locally (use `temporal server start-dev`)

### Installation
1.  Install dependencies:
    ```bash
    npm install
    ```
2.  Start the Temporal Worker:
    ```bash
    npm run dev:worker
    ```
3.  Start the Frontend:
    ```bash
    npm run dev:frontend
    ```

## Design Decisions
- **Separation of Concerns**: Activities are isolated from the workflow logic, making them independently testable and retryable.
- **Mocking**: Since this is a system exercise, tools are mocked but follow the input/output boundaries expected in a real agent runtime.
- **Production Readiness**: If this were production, I would add:
    - Real LLM calls in the `analyzeTask` activity.
    - Persistent database for task history beyond Temporal's retention.
    - Webhooks for long-running task completion notifications.
    - Enhanced error handling for specific failure modes.

## Bonus Content

### Extension Points
- **Multiple Tool Chains**: The `analyzeTask` activity can be enhanced to return more complex execution graphs (parallel vs sequential).
- **Human-in-the-loop**: Temporal `Signals` can be used to pause workflows for human approval before critical actions.
- **Dynamic Worker Scaling**: Workers are stateless and can be scaled horizontally to handle high task volumes.

### MCP (Model Context Protocol) Integration
This system is natively compatible with MCP. MCP tools could be implemented as Temporal Activities, allowing the agent to:
1.  Discover available MCP servers at runtime.
2.  Call MCP tool endpoints within isolated Temporal Activities (ensuring retries and isolation).
3.  Use Temporal's history to provide a full audit trail of all MCP tool interactions.
