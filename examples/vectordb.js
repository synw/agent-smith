#!/usr/bin/env node
//import { useSmem } from "@agent-smith/smem";
import { useSmem } from "../packages/smem/dist/main.js"

async function main() {
    const mem = useSmem();
    await mem.init("data");

    const schema = [
        { name: "id", type: "int" },
        { name: "text", type: "string" },
        { name: "type", type: "string" },
    ]

    const data = [
        { id: 1, text: 'Cherry', type: 'fruit' },
        { id: 2, text: 'Carrot', type: 'vegetable' },
        { id: 3, text: 'Potato', type: 'vegetable' },
        { id: 4, text: 'Apple', type: 'fruit' },
        { id: 5, text: 'Banana', type: 'fruit' }
    ];

    const node = await mem.node("food", schema, "text");
    await node.upsert(data)

    const q = "a sweet fruit to eat";
    const results = await mem.nodes.food.table
        .search(await mem.vector(q))
        .where("type='fruit'")
        .toArray()
    //console.log(results)
    console.log(results.map(r => r.text))
}

(async () => {
    await main();
})();

