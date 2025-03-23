import { Puzzlet } from "@puzzlet/sdk";
import { ModelPluginRegistry, createTemplateRunner } from "@puzzlet/agentmark";
import AllModels from "@puzzlet/all-models";

const apiKey = 'pzlt_3ZNbidkiE3YP7awCJ4dPumaJ';
const appId = '3e5f2b0c-140f-4eb1-83f0-3cf9d05b41af';
process.env.OPENAI_API_KEY = '';
const puzzletClient = new Puzzlet({ apiKey, appId }, createTemplateRunner);
const tracer = puzzletClient.initTracing();

// Note: Registering all latest models for demo/development purposes. 
// In production, you'll likely want to selectively load these, and pin models.
// See AgentMark docs for more details: https://docs.puzzlet.ai/agentmark/model-providers
ModelPluginRegistry.registerAll(AllModels);

async function run () {
  const basicPrompt = await puzzletClient.fetchPrompt("example.prompt.mdx");
  const props = { myProp: 'hello' };
  const telemetry = {
    isEnabled: true,
    functionId: 'example-function-id',
    metadata: { userId: 'example-user-id' }
  };
  return (await basicPrompt.run(props, { telemetry }));
}
// Note: You only need to shutdown the tracer for local/short running tasks.
run()
  .then(() => tracer.shutdown())
  .catch(error => {
    console.error('Error:', error);
    tracer.shutdown();
    process.exit(1);
  });