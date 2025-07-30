import { brain, agent } from "@/agent/agent";


async function discover() {
    const isUp = await brain.discover();
    agent.state.setKey("component", "AgentBaseText");
    console.log("Is up", isUp);
    agent.show();
    if (!isUp) {
        agent.talk("⭕ <span class=\"txt-danger\">My brain is down</span>: please check if your local Koboldcpp server is running!", 5)
    } else {
        agent.talk("✅ My brain is up, I'm ready to answer queries", 3)
    }
}

export { discover }