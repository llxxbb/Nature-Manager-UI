import { HierarchyPointNode } from "d3";

export enum DataType {
    META, INSTANCE
}

export class NatureData {
    dataType = DataType.META;
    data: any;
}

export class D3Node {
    id = 0;
    name: string = "";
    // tooltip
    title = "";
    isFake = false;
    private children?: D3Node[];
    private _children?: D3Node[];
    private textColor = "";
    nodeType = "";
    private classForSame = "";
    linkData = "";
    data?: any;
    leftNavDone = false;
    rightNavDone = false;
    parent: D3Node = undefined as any as D3Node;
    private childSet: Set<Number> = new Set;

    setState(state: boolean) {
        if (state) this.textColor = "#d02b06";
        else this.textColor = "black";
    }
    getTextColor() {
        return this.textColor
    }
    setClassForSame(id: string) {
        this.classForSame = id.replace(/\//g, '-');
    }
    getClassForSame() {
        return this.classForSame
    }

    getChildren() {
        return this.children;
    }
    setChildren(nodes: D3Node[] | undefined) {
        this.children = nodes;
        if (nodes)
            nodes.forEach(d => {
                this.childSet.add(d.id)
                d.parent = this
            });
    }

    findRoot() {
        return D3Node.findRoot(this)
    }
    static findRoot(child: D3Node): D3Node {
        if (child.parent) return D3Node.findRoot(child.parent);
        return child;
    }

    // used to set title position
    openedCheck() {
        if (this.children) return this.children.length == 0 ? false : true;
        return false;
    }

    hasChild() {
        if (this.children && this.children.length > 0)
            return true;
        if (this._children && this._children.length > 0)
            return true;
        return false;
    }

    addChild(child: D3Node) {
        if (this.childSet.has(child.id)) return;
        this.childSet.add(child.id);
        child.parent = this;
        if (this.children) this.children.push(child);
        else if (this._children) this._children.push(child);
        else this.children = [child];
    }

    toggle(close: () => void, open: () => void) {
        if (this.children) {
            this._children = this.children;
            this.children = undefined;
            close();
        } else {
            this.children = this._children;
            this._children = undefined;
            open();
        }
    }

    moveTo(to: D3Node) {
        // remove from parent
        let index = this.parent.children?.indexOf(this) as number;
        if (index > -1) {
            this.parent.children?.splice(index, 1);
            this.parent.childSet.delete(this.id);
        }
        else return;
        // add to target
        to.addChild(this)
    }
}

export class Position {
    x: number = 0;
    y: number = 0;
}
export class SvgSize {
    width: number = 0;
    height: number = 0;
}

export class TreeEvent {
    showMetaMenu?: (e: MouseEvent, d: D3Node) => void;
    hideMetaMenu?: () => void;
    showLayoutMenu?: (e: MouseEvent) => void;
    hideLayoutMenu?: () => void;
    nodeMoved?: (source: HierarchyPointNode<D3Node>, target: HierarchyPointNode<D3Node>) => void
    navigateLeft?: (d: D3Node) => void
    navigateRight?: (d: D3Node) => void
}

export enum Shape {
    circle, rect, rectR
}

export class TreePara {
    target: string = "";
    size: SvgSize = {} as any;
    data: D3Node = {} as any;
    event?: TreeEvent;
    shape: Shape = Shape.circle;
}