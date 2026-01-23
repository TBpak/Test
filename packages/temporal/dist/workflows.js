"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.agentWorkflow = agentWorkflow;
const workflow_1 = require("@temporalio/workflow");
const { analyzeTask, fetchData, generateResult } = (0, workflow_1.proxyActivities)({
    startToCloseTimeout: '1 minute',
    retry: {
        initialInterval: '1s',
        backoffCoefficient: 2,
        maximumInterval: '10s',
        maximumAttempts: 3,
    },
});
async function agentWorkflow(task) {
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
//# sourceMappingURL=workflows.js.map