import * as d3 from "d3";
import { BaseType, HierarchyPointNode } from "d3";
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
    showMenu?: (e: MouseEvent, d: Node) => void;
    hideMenu?: () => void
}
export class TreePara {
    target: string = "";
    size: SvgSize = {} as any;
    data: Node = {} as any;
    event?: TreeEvent;
}

var Scale = 1000
var ParaData: TreePara
var GForNode: d3.Selection<SVGGElement, unknown, HTMLElement, any>;
var GForLink: d3.Selection<SVGGElement, unknown, HTMLElement, any>;
var CurrentNode: HierarchyPointNode<unknown>;
var SVG: d3.Selection<d3.BaseType, unknown, HTMLElement, any>;
export class D3Tree {
    show(para: TreePara) {
        ParaData = para
        SVG = initSvg(para);

        let g = initG(SVG, para);

        let nodes = appendProperty(para);

        // draw line first! otherwise you will see the line goes into the circle
        GForLink = g.append("g")
            .attr("fill", "none")
            .attr("stroke", "#555")
            .attr("stroke-opacity", 0.4)
            .attr("stroke-width", 0.005 * Scale)
        drawLinks(GForLink, nodes);

        // set font property to node
        GForNode = g.append("g")
            .attr("font-family", "sans-serif")
            .attr("font-size", 0.04 * Scale)
            .attr("stroke-linejoin", "round")
            .attr("stroke-width", 0.006 * Scale);
        drawNode(GForNode, nodes);

    }
    update(para: TreePara) {
        d3.select("#All-G").remove()
        this.show(para)
    }
}

function initSvg(para: TreePara) {
    let svg = d3.select(para.target);
    // add viewBox for pan and zoom
    svg.attr("viewBox", `0, 0, ${Scale}, ${Scale}`)
        .on("click", () => {
            if (para.event && para.event.hideMenu)
                para.event.hideMenu();
        });
    return svg;
}

function initG(svg: d3.Selection<d3.BaseType, unknown, HTMLElement, any>, para: TreePara) {
    let g = svg.append("g");
    g.attr("transform", `translate(0,${0.5 * Scale})`);
    g.attr("id", "All-G");

    svg.call(
        d3.zoom<any, any>()
            .extent([[0, 0], [para.size.width, para.size.height]])
            .scaleExtent([0.1, 10])
            .on("zoom", item => {
                if (para.event && para.event.hideMenu)
                    para.event.hideMenu()
                g.attr("transform", item.transform);
            }));

    return g;
}

function appendProperty(para: TreePara) {
    // append depth, height, children, parent properties to datum
    let hierarchy = d3.hierarchy(para.data);
    hierarchy.sort((a, b) => (a.data.name < b.data.name ? -1 : 1));
    let tree = d3.tree();
    tree.nodeSize([0.00007 * Scale, 0.0003 * Scale])
    // append x, y properties to datum
    let nodes = tree(hierarchy);
    nodes.each(n => {
        n.x = n.x * Scale
        n.y = n.y * Scale
    })
    return nodes;
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
    upperG.selectAll("g")
        .data(nodes.descendants(), d => {
            let item = d as HierarchyPointNode<Node>
            return item.data.name
        })
        .join(
            newNodes,
            nodeChanged
        )
}

function newNodes(enterData: d3.Selection<d3.EnterElement, d3.HierarchyPointNode<unknown>, SVGGElement, unknown>) {
    var enter = enterData.append("g")
        .attr("id", d => {
            const data = (d as unknown as HierarchyPointNode<Node>);
            return data.data.name + "_g"
        })

    var drag = d3.drag()
        .on("drag", (e, d) => {
            const one = (d as unknown as HierarchyPointNode<Node>);
            const selected = d3.select(`#${(one).data.name}_g`);
            selected.attr("transform", () => {
                // let x = e.x - one.x
                // let y = e.y - one.y
                // return `translate(${x},${y})`;
                return `translate(${e.x},${e.y})`;
            });
        })

    drag(enter as unknown as d3.Selection<Element, unknown, any, any>)

    // draw circle
    let circle = enter.append("circle");
    circle.attr("stroke", "#079702")
        .attr("stroke-width", `${0.005 * Scale}`)
        .attr("fill", "#f1d5d5")
        .attr("r", 0.03 * Scale)
        .attr("id", d => `${(d.data as Node).name}_c`)

    appendText(enter)

    enter.attr("transform", (d: Position) => `translate(${d.y},${d.x})`);

    // add folder icon
    let folder = enter.filter(d => d.children ? true : false || (d.data as Node)._children ? true : false);
    addIcon(folder);

    // add tooltip
    enter.append("title").text(d => (d.data as Node).name)

    // event and id
    enter.append("circle")
        .attr("opacity", "0")
        .attr("r", 0.03 * Scale)
        .on("click", (e, d) => {
            let { hasChild } = hasChildCheck(d)
            if (hasChild) toggle(e, d)
            else changeCircleStyle(e, d)
        })
        .on("contextmenu", showContextMenu)
        .on("mouseover", (e, d) => {
            // console.log("mouseover", e, d)
        })
        .on("mouseout", (e, d) => {
            // console.log("mouseout", e, d)
        })
    return enter;
}

function nodeChanged(updateData: d3.Selection<d3.BaseType, d3.HierarchyPointNode<unknown>, SVGGElement, unknown>): d3.Selection<d3.BaseType, d3.HierarchyPointNode<unknown>, SVGGElement, unknown> | undefined {
    const text = updateData.selectAll("text");
    setTextPosition(text);

    updateData.attr("transform", (d: Position) => `translate(${d.y},${d.x})`);

    return updateData
}

function appendText<T extends BaseType>(selected: d3.Selection<T, d3.HierarchyPointNode<unknown>, SVGGElement, unknown>) {
    selected.append("text")
        .attr("y", `${0.015 * Scale}`)
        // distance from text to circle
        .attr("x", (d) => (d.children ? `${-0.04 * Scale}` : `${0.04 * Scale}`))
        .attr("text-anchor", (d) => (d.children ? "end" : "start"))
        .text((d) => {
            const name = (d.data as Node).name;
            return name
        })
        .clone(true)
        // stroke no text inner
        .lower()
        .attr("stroke", "white");
}

function setTextPosition(text: d3.Selection<d3.BaseType, unknown, d3.BaseType, d3.HierarchyPointNode<unknown>>) {
    text.attr("x", d => {
        var { opened } = openedCheck(d);
        return opened ? -0.04 * Scale : 0.04 * Scale;
    })
        .attr("text-anchor", d => {
            var { opened } = openedCheck(d);
            return opened ? "end" : "start";
        });
}

function addIcon<T extends BaseType>(folder: d3.Selection<T, d3.HierarchyPointNode<unknown>, SVGGElement, unknown>) {
    return folder.append("image")
        .attr("x", `${-0.025 * Scale}`)
        .attr("y", `${-0.025 * Scale}`)
        .attr("width", `${0.05 * Scale}`)
        .attr("height", `${0.05 * Scale}`)
        .attr("href", d => {
            if (d.children)
                return `${require("../assets/caret-right-fill.svg")}`;
            else if ((d.data as Node)._children)
                return `${require("../assets/caret-down-fill.svg")}`;
            return null;
        })
        .attr("id", d => (d.data as Node).name + "_i")
}

function changeCircleStyle(e: MouseEvent, d: HierarchyPointNode<unknown>) {
    if (CurrentNode) {
        let old = d3.select("#" + (CurrentNode.data as Node).name + "_c")
        old.attr("stroke", "#079702");
    }
    CurrentNode = d
    let nCircle = "#" + (CurrentNode.data as Node).name + "_c";
    let n = d3.select(nCircle)
    n.attr("stroke", "#8f3200");
}

function openedCheck(d: unknown) {
    const node = d as unknown as HierarchyPointNode<Node>;
    var child = node.data.children;
    var opened;
    if (child) {
        opened = child.length == 0 ? false : true;
    } else {
        opened = false;
    }
    return { opened, node };
}

function hasChildCheck(d: unknown) {
    const node = d as unknown as HierarchyPointNode<Node>;
    var child = node.data.children;
    var hasChild;
    if (child && child.length > 0)
        return { hasChild: true, node };
    child = node.data._children;
    if (child && child.length > 0)
        return { hasChild: true, node };
    return { hasChild: false, node };
}

function showContextMenu(e: any, node: d3.HierarchyPointNode<unknown> | unknown) {
    let d = node as HierarchyPointNode<Node>
    changeCircleStyle(e, d);
    if (ParaData.event && ParaData.event.showMenu)
        ParaData.event.showMenu(e, d.data);
    e.preventDefault();
}

function update(para: TreePara) {
    let nodes = appendProperty(para);

    // draw line first! otherwise you will see the line goes into the circle
    drawLinks(GForLink, nodes);
    drawNode(GForNode, nodes);
}

// Toggle folder.
function toggle(e: MouseEvent, node: HierarchyPointNode<unknown> | unknown) {
    let d = node as HierarchyPointNode<Node>
    changeCircleStyle(e, d)
    let data: Node = d.data
    let one = d3.select(`#${data.name}_i`)
    if (data.children) {
        data._children = data.children;
        data.children = undefined;
        one.attr("href", `${require("../assets/caret-down-fill.svg")}`)
    } else {
        data.children = data._children;
        data._children = undefined;
        one.attr("href", `${require("../assets/caret-right-fill.svg")}`)
    }
    update(ParaData)
}
