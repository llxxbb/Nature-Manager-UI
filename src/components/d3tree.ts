import * as d3 from "d3";
export class Position {
    x: number = 0;
    y: number = 0;
}

export class Node {
    name: string = "";
    children: Node[] = [];
    _children: Node[] = [];
}

export class SvgSize {
    width: number = 0;
    height: number = 0;
}

export class TreeEvent {
    nodeClick: any = {};
}
export class TreePara {
    target: string = "";
    size: SvgSize = {} as any;
    data: Node = {} as any;
    event: TreeEvent | null = {} as any;
}

var scale = 1000
export class D3Tree {
    show(para: TreePara) {
        let svg = d3.select(para.target);
        // add viewBox for pan and zoom
        svg.attr("viewBox", `0, 0, ${scale}, ${scale}`);
        let g = svg.append("g");

        let nodes = appendProperty(para);

        // draw line first! otherwise you will see the line goes into the circle
        drawLinks(g, nodes);
        drawNodes(g, nodes, para.event);

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
    hierarchy.sort((a, b) => (a.data.name < b.data.name ? -1 : 1));
    // append x, y properties to datum
    let nodes = d3.tree()(hierarchy);
    nodes.each(n => {
        n.x = n.x * scale
        n.y = n.y * scale
    })
    // get max depth
    let maxDepth = 0;
    nodes.each((d) => {
        if (d.depth > maxDepth) maxDepth = d.depth;
    });
    return nodes;
    // .attr("transform", `translate(${root.y},${root.x})`);
}

function drawLinks(g: d3.Selection<SVGGElement, unknown, HTMLElement, any>, nodes: d3.HierarchyPointNode<unknown>) {
    let linkFn = d3.linkHorizontal<any, any>()
        .x((d) => d.y)
        .y((d) => d.x);

    const link = g.append("g")
        .attr("fill", "none")
        .attr("stroke", "#555")
        .attr("stroke-opacity", 0.4)
        .attr("stroke-width", 0.005 * scale)
        .selectAll("path")
        .data(nodes.links())
        .join("path")
        .attr("d", linkFn);
}
function drawNodes(upperG: d3.Selection<SVGGElement, unknown, HTMLElement, any>,
    nodes: d3.HierarchyPointNode<unknown>,
    event: TreeEvent | null
) {
    // set font property to node
    let g = upperG.append("g")
        .attr("font-family", "sans-serif")
        .attr("font-size", 0.04 * scale)
        .attr("stroke-linejoin", "round")
        .attr("stroke-width", 0.006 * scale);

    const node = g.selectAll("g")
        .data(nodes.descendants())
        .join("g")
        .attr("transform", (d: Position) => `translate(${d.y},${d.x})`);

    // bottom circle
    node.append("circle")
        .attr("fill", "#07cc00")
        .attr("r", 0.03 * scale)

    node.append("text")
        .attr("y", `${0.015 * scale}`)
        // distance from text to circle
        .attr("x", (d) => (d.children ? `${-0.04 * scale}` : `${0.04 * scale}`))
        .attr("text-anchor", (d) => (d.children ? "end" : "start"))
        .text((d) => (d.data as Node).name)
        .clone(true)
        // stroke no text inner
        .lower()
        .attr("stroke", "white")

    // add folder icon
    node.append("foreignObject")
        .attr("x", `${-0.025 * scale}`)
        .attr("y", `${-0.025 * scale}`)
        .attr("width", `${0.05 * scale}`)
        .attr("height", `${0.05 * scale}`)
        .html(d => {
            if (d.children) return '<i class="fas fa-folder-open"></i>'
            else if ((d.data as Node)._children) return '<i class="fas fa-folder"></i>'
            return null
        })

    // top circle
    node.append("circle")
        .attr("r", 0.03 * scale)
        .attr("opacity", 0)
        .on("click", event ? event.nodeClick : null);

}
