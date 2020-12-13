import * as d3 from "d3";
export class Position {
    x: number = 0;
    y: number = 0;
}

export class Node {
    name: string = "";
    children: Node[] = [];
}

export class SvgSize {
    width: number = 0;
    height: number = 0;
}
export class TreePara {
    target: string = ""
    size: SvgSize = {} as any
    data: Node = {} as any
}
export class D3Tree {
    show(para: TreePara) {

        let svg = d3.select(para.target);
        // add viewBox for pan and zoom
        svg.attr("viewBox", `0, 0, 1, 1`);
        let g = svg.append("g");

        let nodes = appendProperty(para);

        // draw line first! otherwise you will see the line goes into the circle
        drawLinks(g, nodes);
        drawNodes(g, nodes);

        applyZoom(svg, para, g);
    }
}

function applyZoom(svg: d3.Selection<d3.BaseType, unknown, HTMLElement, any>, para: TreePara, g: d3.Selection<SVGGElement, unknown, HTMLElement, any>) {
    svg.call(d3.zoom<any, any>()
        .extent([[0, 0], [para.size.width, para.size.height]])
        .scaleExtent([0.1, 10])
        .on("zoom", zoomed));

    function zoomed(item: { transform: null; }) {
        g.attr("transform", item.transform);
    }
}

function appendProperty(para: TreePara) {
    // append depth, height, children, parent properties to datum
    let hierarchy = d3.hierarchy(para.data);
    hierarchy.sort((a, b) => a.data.name < b.data.name ? -1 : 1)
    // append x, y properties to datum
    let nodes = d3.tree()(hierarchy);
    // get max depth
    let maxDepth = 0;
    nodes.each(d => { if (d.depth > maxDepth) maxDepth = d.depth })
    return nodes
    // .attr("transform", `translate(${root.y},${root.x})`);
}

function drawLinks(g: d3.Selection<SVGGElement, unknown, HTMLElement, any>, nodes: d3.HierarchyPointNode<unknown>) {
    let linkFn = d3.linkHorizontal<any, any>()
        .x(d => d.y)
        .y(d => d.x);

    const link = g
        .append("g")
        .attr("fill", "none")
        .attr("stroke", "#555")
        .attr("stroke-opacity", 0.4)
        .attr("stroke-width", 0.005)
        .selectAll("path")
        .data(nodes.links())
        .join("path")
        .attr("d", linkFn);
}
function drawNodes(upperG: d3.Selection<SVGGElement, unknown, HTMLElement, any>, nodes: d3.HierarchyPointNode<unknown>) {
    // set font property to node
    let g = upperG.append("g")
        .attr("font-family", "sans-serif")
        .attr("font-size", 0.04)
        .attr("stroke-linejoin", "round")
        .attr("stroke-width", 0.006);

    const node = g.selectAll("g")
        .data(nodes.descendants())
        .join("g")
        .attr("transform", (d: Position) => `translate(${d.y},${d.x})`);

    node.append("circle")
        .attr("fill", (d) => (d.children ? "#048000" : "#07cc00"))
        .attr("r", 0.03);

    node.append("text")
        .attr("y", "0.38em")
        .attr("x", (d) => (d.children ? "-0.04" : "0.04"))
        .attr("text-anchor", (d) => (d.children ? "end" : "start"))
        .text((d) => ((d.data) as Node).name)
        .clone(true)
        .lower()
        .attr("stroke", "white");
}

