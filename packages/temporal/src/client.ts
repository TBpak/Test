import { Connection, Client } from '@temporalio/client';
import { agentWorkflow } from './workflows';
import { nanoid } from 'nanoid';

export async function startAgentWorkflow(task: string) {
  const connection = await Connection.connect({ address: 'localhost:7233' });
  const client = new Client({
    connection,
  });

  const handle = await client.workflow.start(agentWorkflow, {
    args: [task],
    taskQueue: 'agent-task-queue',
    workflowId: `agent-workflow-${nanoid()}`,
  });

  return handle.workflowId;
}

export async function getWorkflowStatus(workflowId: string) {
  const connection = await Connection.connect({ address: 'localhost:7233' });
  const client = new Client({
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
