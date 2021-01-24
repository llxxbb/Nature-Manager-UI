import { data } from './../testData/node';
import { Meta } from "@/domain";
import * as d3 from "d3";
import { BaseType, HierarchyPointNode } from "d3";
export class Position {
    x: number = 0;
    y: number = 0;
}
export class SvgSize {
    width: number = 0;
    height: number = 0;
}
export class TreeEvent {
    showMetaMenu?: (e: MouseEvent, d: Meta) => void;
    hideMetaMenu?: () => void;
    showLayoutMenu?: (e: MouseEvent) => void;
    hideLayoutMenu?: () => void;
    nodeMoved?: (source: HierarchyPointNode<Meta>, target: HierarchyPointNode<Meta>) => void
}

export enum Shape {
    circle, rect, rectR
}

export class TreePara {
    target: string = "";
    size: SvgSize = {} as any;
    data: Meta = {} as any;
    event?: TreeEvent;
    shape: Shape = Shape.circle;
}

var Scale = 1000
var ParaData: TreePara
var GForNode: d3.Selection<SVGGElement, unknown, HTMLElement, any>;
var GForLink: d3.Selection<SVGGElement, unknown, HTMLElement, any>;
var CurrentNode: HierarchyPointNode<unknown>;
var SVG: d3.Selection<d3.BaseType, unknown, HTMLElement, any>;
var TargetToDrop: d3.HierarchyPointNode<unknown> | null;
var DragStart: boolean = false;
// make the pointer of mouser out fo the node when drag
var Offset = 40;
export class D3Tree {
    show(para: TreePara) {
        ParaData = para
        SVG = initSvg(para);

        let g = initG(SVG, para);

        let nodes = appendProperty(para);

        // draw line first! otherwise you will see the line goes into the node
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
}

function initSvg(para: TreePara) {
    let svg = d3.select(para.target);
    // add viewBox for pan and zoom
    svg.attr("viewBox", `0, 0, ${Scale}, ${Scale}`)
        .on("click", () => hideContextMenu(para))
        .on("contextmenu", showLayerContextMenu)
    // clear exists node
    svg.select("g").remove();
    return svg;
}

function hideContextMenu(para: TreePara) {
    if (para.event && para.event.hideMetaMenu)
        para.event.hideMetaMenu();
    if (para.event && para.event.hideLayoutMenu)
        para.event.hideLayoutMenu();
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
                hideContextMenu(para)
                g.attr("transform", item.transform);
            }));

    return g;
}

function appendProperty(para: TreePara) {
    // append depth, height, children, parent properties to datum
    let hierarchy = d3.hierarchy(para.data);
    hierarchy.sort((a, b) => (a.data.name < b.data.name ? -1 : 1));
    let tree = d3.tree();
    tree.nodeSize([0.00007 * Scale, 0.0004 * Scale])
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
        .attr("d", linkFn)
        .append("title").text(d => {
            const toMeta = (d.target.data as any as Meta);
            if (toMeta.relation) return toMeta.relation.settings;
            return "";
        })
}

function drawNode(
    upperG: d3.Selection<SVGGElement, unknown, HTMLElement, any>,
    nodes: d3.HierarchyPointNode<unknown>,
) {
    upperG.selectAll("g")
        .data(nodes.descendants(), d => {
            let item = d as HierarchyPointNode<Meta>
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
            const data = (d as unknown as HierarchyPointNode<Meta>);
            return "g" + data.data.id
        })

    dragEvent(enter);

    // draw node
    const nodeItem = enter.append(getShape());
    shapePropertySet(nodeItem)
    nodeItem.attr("stroke", "#079702")
        .attr("stroke-width", `${0.005 * Scale}`)
        .attr("stroke-dasharray", d => {
            if ((d.data as Meta).isFake)
                return `${0.005 * Scale}, ${0.01 * Scale}`
            else return `100,0`
        })
        .attr("fill", "#f1d5d5")
        .attr("id", d => `c${(d.data as Meta).id}`)
        .attr("class", d => { return "id" + ((d.data) as any as Meta).realId })

    appendText(enter)

    // add folder icon
    let folder = enter.filter(d => d.children ? true : false || (d.data as Meta)._children ? true : false);
    addIcon(folder);

    // add Type
    enter.append("text")
        .text((d) => (d.data as Meta).meta_type)
        .attr("y", `${0.015 * Scale}`)
        // distance from text to node
        .attr("x", `${-0.014 * Scale}`)
        .attr("font-weight", `${0.6 * Scale}`)
        .attr("opacity", 0.4)

    enter.attr("transform", (d: Position) => `translate(${d.y},${d.x})`);

    // add tooltip
    enter.append("title").text(d => (d.data as Meta).name)

    const nodeEvent = enter.append(getShape());
    // node event
    shapePropertySet(nodeEvent)
    nodeEvent.attr("opacity", "0")
        .on("click", (e, d) => {
            let { hasChild } = hasChildCheck(d)
            if (hasChild) toggle(e, d)
            else changeNodeStyle(e, d)
        })
        .on("contextmenu", showNodeContextMenu)
        .on("mouseover", (_e, d) => {
            if (DragStart && d != CurrentNode) {
                TargetToDrop = d
            }
            // show same
            const same = d3.selectAll(".id" + (d.data as any as Meta).realId);
            same.attr("class", d => {
                return "same " + "id" + (d as HierarchyPointNode<Meta>).data.realId
            })
        })
        .on("mouseout", (_e, _d) => {
            TargetToDrop = null
            // remove same
            d3.selectAll(".same")
                .attr("class", d => {
                    return "id" + (d as HierarchyPointNode<Meta>).data.realId
                })
        })
    return enter;
}

function getShape(): string {
    if (ParaData.shape == Shape.circle) return "circle";
    else if (ParaData.shape == Shape.rect) return "rect";
    else return "rect";
}

function shapePropertySet(nodeEvent: d3.Selection<d3.BaseType, d3.HierarchyPointNode<unknown>, SVGGElement, unknown>) {
    if (ParaData.shape == Shape.circle) {
        nodeEvent.attr("r", 0.03 * Scale);
    } else if (ParaData.shape == Shape.rect) {
        nodeEvent.attr("width", 0.06 * Scale);
        nodeEvent.attr("height", 0.06 * Scale);
        nodeEvent.attr("x", -0.03 * Scale);
        nodeEvent.attr("y", -0.03 * Scale);
    } else {
        nodeEvent.attr("width", 0.06 * Scale);
        nodeEvent.attr("height", 0.06 * Scale);
        nodeEvent.attr("x", -0.03 * Scale);
        nodeEvent.attr("y", -0.03 * Scale);
        nodeEvent.attr("rx", 0.015 * Scale);
        nodeEvent.attr("ry", 0.015 * Scale);
    }
}

function dragEvent(enter: d3.Selection<SVGGElement, d3.HierarchyPointNode<unknown>, SVGGElement, unknown>) {
    var drag = d3.drag()
        .on("start", (e, d) => {
            changeNodeStyle(e, d as HierarchyPointNode<Meta>)
            const one = (d as HierarchyPointNode<Meta>);
            // the root node can't be moved
            if (one.parent) DragStart = true
        })
        .on("drag", (e, d) => {
            if (!DragStart) return
            const one = (d as unknown as HierarchyPointNode<Meta>);
            const selected = d3.select(`#g${(one).data.id}`);
            selected.attr("transform", () => {
                let x = e.x - one.x + one.y + Offset;
                let y = e.y - one.y + one.x + Offset;
                return `translate(${x},${y})`;
            });
        })
        .on("end", (_e, d) => {
            DragStart = false
            if (!TargetToDrop)
                return;
            console
            let dragged = d as HierarchyPointNode<Meta>;
            let target = TargetToDrop
            TargetToDrop = null
            if (ParaData.event && ParaData.event.nodeMoved)
                ParaData.event?.nodeMoved(dragged, target as HierarchyPointNode<Meta>);
        });

    drag(enter as unknown as d3.Selection<Element, unknown, any, any>);
}

function nodeChanged(updateData: d3.Selection<d3.BaseType, d3.HierarchyPointNode<unknown>, SVGGElement, unknown>): d3.Selection<d3.BaseType, d3.HierarchyPointNode<unknown>, SVGGElement, unknown> | undefined {
    const text = updateData.selectAll(".side");
    setTextPosition(text);

    updateData.attr("transform", (d: Position) => `translate(${d.y},${d.x})`);

    return updateData
}

function appendText<T extends BaseType>(selected: d3.Selection<T, d3.HierarchyPointNode<unknown>, SVGGElement, unknown>) {
    selected.append("text")
        .attr("y", `${0.015 * Scale}`)
        // distance from text to node
        .attr("x", (d) => (d.children ? `${-0.04 * Scale}` : `${0.04 * Scale}`))
        .attr("text-anchor", (d) => (d.children ? "end" : "start"))
        // used to select all text beside node
        .attr("class", "side")
        // set status meta
        .attr("fill", d => {
            const meta = (d.data as any as Meta);
            return meta.isState() ? "#d02b06" : "black"
        })
        .attr("opacity", (d) => ((d.data as any as Meta).isFake ? 0.4 : 1))
        .text(d => {
            const m = (d.data as Meta);
            return m.levels[m.levels.length - 1]
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
            else if ((d.data as Meta)._children)
                return `${require("../assets/caret-down-fill.svg")}`;
            return null;
        })
        .attr("id", d => "i" + (d.data as Meta).id)
}

function changeNodeStyle(_e: MouseEvent, d: HierarchyPointNode<unknown>) {
    if (CurrentNode) {
        let old = d3.select("#c" + (CurrentNode.data as Meta).id)
        old.attr("stroke", "#079702");
    }
    CurrentNode = d
    let nNode = "#c" + (CurrentNode.data as Meta).id;
    let n = d3.select(nNode)
    n.attr("stroke", "#8f3200");
}

function openedCheck(d: unknown) {
    const node = d as unknown as HierarchyPointNode<Meta>;
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
    const node = d as unknown as HierarchyPointNode<Meta>;
    var child = node.data.children;
    if (child && child.length > 0)
        return { hasChild: true, node };
    child = node.data._children;
    if (child && child.length > 0)
        return { hasChild: true, node };
    return { hasChild: false, node };
}

function showNodeContextMenu(e: any, node: d3.HierarchyPointNode<unknown> | unknown) {
    let d = node as HierarchyPointNode<Meta>
    changeNodeStyle(e, d);
    if (ParaData.event && ParaData.event.showMetaMenu)
        ParaData.event.showMetaMenu(e, d.data);
    e.preventDefault();
}

function showLayerContextMenu(e: MouseEvent) {
    if (ParaData.event && ParaData.event.showLayoutMenu)
        ParaData.event.showLayoutMenu(e);
    e.preventDefault();
}

function update(para: TreePara) {
    let nodes = appendProperty(para);

    // draw line first! otherwise you will see the line goes into the node
    drawLinks(GForLink, nodes);
    drawNode(GForNode, nodes);
}

// Toggle folder.
function toggle(e: MouseEvent, node: HierarchyPointNode<unknown> | unknown) {
    let d = node as HierarchyPointNode<Meta>
    changeNodeStyle(e, d)
    let data: Meta = d.data
    let one = d3.select(`#i${data.id}`)
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
