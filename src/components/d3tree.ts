import * as d3 from "d3";
import { HierarchyPointNode } from "d3";
export class Position {
    x: number = 0;
    y: number = 0;
}

export class Node {
    name: string = "";
    children?: Node[] = [];
    _children?: Node[] = [];
}

export class SvgSize {
    width: number = 0;
    height: number = 0;
}

export class TreeEvent {
    // folderClick: any = {};
}
export class TreePara {
    target: string = "";
    size: SvgSize = {} as any;
    data: Node = {} as any;
    event?: TreeEvent;
}

var scale = 1000
var paraData: TreePara
var gForNode: d3.Selection<SVGGElement, unknown, HTMLElement, any>;
var gForLink: d3.Selection<SVGGElement, unknown, HTMLElement, any>;
export class D3Tree {
    show(para: TreePara) {
        paraData = para
        let svg = d3.select(para.target);
        // add viewBox for pan and zoom
        svg.attr("viewBox", `0, 0, ${scale}, ${scale}`);
        let g = svg.append("g");
        let nodes = appendProperty(para);

        // draw line first! otherwise you will see the line goes into the circle
        gForLink = g.append("g")
            .attr("fill", "none")
            .attr("stroke", "#555")
            .attr("stroke-opacity", 0.4)
            .attr("stroke-width", 0.005 * scale)
        drawLinks(gForLink, nodes);

        // set font property to node
        gForNode = g.append("g")
            .attr("font-family", "sans-serif")
            .attr("font-size", 0.04 * scale)
            .attr("stroke-linejoin", "round")
            .attr("stroke-width", 0.006 * scale);
        drawNode(gForNode, nodes);

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
    let tree = d3.tree();
    // append x, y properties to datum
    let nodes = tree(hierarchy);
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

    g.selectAll("path")
        .data(nodes.links())
        .join("path")
        .attr("d", linkFn);
}

function drawNode(
    upperG: d3.Selection<SVGGElement, unknown, HTMLElement, any>,
    nodes: d3.HierarchyPointNode<unknown>,
) {
    let merged = upperG.selectAll("g")
        .data(nodes.descendants())
        .join(
            enterData => newNodes(enterData),
            updateData => updateData.attr("transform", (d: Position) => `translate(${d.y},${d.x})`)
        );
}

function newNodes(enterData: d3.Selection<d3.EnterElement, d3.HierarchyPointNode<unknown>, SVGGElement, unknown>) {
    var enter = enterData.append("g");
    enter.append("circle")
        .attr("stroke", "#079702")
        .attr("stroke-width", `${0.005 * scale}`)
        .attr("fill", "#f1d5d5")
        .attr("r", 0.03 * scale);

    enter.append("text")
        .attr("y", `${0.015 * scale}`)
        // distance from text to circle
        .attr("x", (d) => (d.children ? `${-0.04 * scale}` : `${0.04 * scale}`))
        .attr("text-anchor", (d) => (d.children ? "end" : "start"))
        .text((d) => (d.data as Node).name)
        .clone(true)
        // stroke no text inner
        .lower()
        .attr("stroke", "white");

    enter.attr("transform", (d: Position) => `translate(${d.y},${d.x})`);

    // add folder icon
    let folder = enter.filter(d => d.children ? true : false || (d.data as Node)._children ? true : false);
    folder.append("foreignObject")
        .attr("x", `${-0.025 * scale}`)
        .attr("y", `${-0.025 * scale}`)
        .attr("width", `${0.05 * scale}`)
        .attr("height", `${0.05 * scale}`)
        .html(d => {
            let id = (d.data as Node).name
            if (d.children)
                return `<i class="fas fa-folder-open folder-open" id="${id}"></i>`;
            else if ((d.data as Node)._children)
                return `<i class="fas fa-folder folder" id="${id}"></i>`;
            return null;
        })
        .on("click", toggle);
    return enter;
}

function update(para: TreePara) {
    let nodes = appendProperty(para);

    // draw line first! otherwise you will see the line goes into the circle
    drawLinks(gForLink, nodes);
    var circle = drawNode(gForNode, nodes);
}

// Toggle folder.
function toggle(e: MouseEvent, d: HierarchyPointNode<unknown>) {
    let data: Node = d.data as Node
    let one = d3.select(`#${data.name}`)
    if (data.children) {
        data._children = data.children;
        data.children = undefined;
        one.attr("class", "fas fa-folder folder")
        // one.classed("fas fa-folder folder")
    } else {
        data.children = data._children;
        data._children = undefined;
        one.attr("class", "fas fa-folder-open folder-open")
        // one.classed("fas fa-folder-open folder-open")
    }
    update(paraData)
}