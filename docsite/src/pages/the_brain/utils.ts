import { brain, joe } from "@/agent/agent";


async function discover() {
    const isUp = await brain.discover();
    joe.state.setKey("component", "AgentBaseText");
    console.log("Is up", isUp);
    joe.show();
    if (!isUp) {
        joe.talk("⭕ <span class=\"txt-danger\">My brain is down</span>: please check if your local Koboldcpp server is running!", 5)
    } else {
        joe.talk("✅ My brain is up, I'm ready to answer queries", 3)
    }
}

export { discover }