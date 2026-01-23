import { proxyActivities } from '@temporalio/workflow';
import type * as activities from './activities';

const { analyzeTask, fetchData, generateResult } = proxyActivities<typeof activities>({
  startToCloseTimeout: '1 minute',
  retry: {
    initialInterval: '1s',
    backoffCoefficient: 2,
    maximumInterval: '10s',
    maximumAttempts: 3,
  },
});

export async function agentWorkflow(task: string): Promise<string> {
  /**
   * Note on Determinism:
   * This workflow function must be deterministic. We use proxyActivities
   * for any side-effectful operations (like tool calls) and avoid non-deterministic
   * constructs like Math.random(), new Date(), or direct network calls here.
   */
  
  // Step 1: Analyze the task to decide what to do
  const tools = await analyzeTask(task);
  
  // Step 2: Fetch data (if 'tool-fetch' was decided)
  let data = {};
  if (tools.includes('tool-fetch')) {
    data = await fetchData(task);
  }
  
  // Step 3: Final step to generate the result
  const finalResult = await generateResult(data);
  
  return finalResult;
}
