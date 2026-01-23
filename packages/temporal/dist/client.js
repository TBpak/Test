"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.startAgentWorkflow = startAgentWorkflow;
exports.getWorkflowStatus = getWorkflowStatus;
const client_1 = require("@temporalio/client");
const workflows_1 = require("./workflows");
const nanoid_1 = require("nanoid");
async function startAgentWorkflow(task) {
    const connection = await client_1.Connection.connect({ address: 'localhost:7233' });
    const client = new client_1.Client({
        connection,
    });
    const handle = await client.workflow.start(workflows_1.agentWorkflow, {
        args: [task],
        taskQueue: 'agent-task-queue',
        workflowId: `agent-workflow-${(0, nanoid_1.nanoid)()}`,
    });
    return handle.workflowId;
}
async function getWorkflowStatus(workflowId) {
    const connection = await client_1.Connection.connect({ address: 'localhost:7233' });
    const client = new client_1.Client({
        connection,
    });
    const handle = client.workflow.getHandle(workflowId);
    const description = await handle.describe();
    let result = null;
    if (description.status.name === 'COMPLETED') {
        result = await handle.result();
    }
    return {
        status: description.status.name,
        result,
    };
}
//# sourceMappingURL=client.js.map