document.addEventListener("DOMContentLoaded", () => {
    const width = window.innerWidth;
    const height = window.innerHeight;

    const svg = d3.select("#root").append("svg")
        .attr("width", width)
        .attr("height", height);

    d3.json("data.json").then(data => {
        const simulation = d3.forceSimulation(data.nodes)
            .force("link", d3.forceLink(data.links).id(d => d.id).distance(150))
            .force("charge", d3.forceManyBody().strength(-400))
            .force("center", d3.forceCenter(width / 2, height / 2));

        const link = svg.selectAll(".link")
            .data(data.links)
            .enter().append("line")
            .attr("class", "link");

        const node = svg.selectAll(".node")
            .data(data.nodes)
            .enter().append("g")
            .attr("class", "node")
            .call(d3.drag()
                .on("start", (event, d) => {
                    if (!event.active) simulation.alphaTarget(0.3).restart();
                    d.fx = d.x;
                    d.fy = d.y;
                })
                .on("drag", (event, d) => {
                    d.fx = event.x;
                    d.fy = event.y;
                })
                .on("end", (event, d) => {
                    if (!event.active) simulation.alphaTarget(0);
                    d.fx = null;
                    d.fy = null;
                }));

        node.append("circle")
            .attr("r", 40)
            .attr("fill", "#1e1e1e")
            .attr("stroke", "#fff")
            .attr("stroke-width", 2);

        node.append("image")
            .attr("xlink:href", d => d.image)
            .attr("x", -20)
            .attr("y", -20)
            .attr("width", 40)
            .attr("height", 40);

        node.append("text")
            .text(d => d.name)
            .attr("x", 50)
            .attr("y", 5)
            .style("font-size", "14px")
            .style("fill", "white");

        node.append("title")
            .text(d => d.desc);

        simulation.on("tick", () => {
            link
                .attr("x1", d => d.source.x)
                .attr("y1", d => d.source.y)
                .attr("x2", d => d.target.x)
                .attr("y2", d => d.target.y);

            node
                .attr("transform", d => `translate(${d.x},${d.y})`);
        });
    });
});
