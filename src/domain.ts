import { now } from "d3";
import { D3Node } from "./service/d3tree";

export enum DataType {
    META, INSTANCE
}

export class NatureData {
    dataType = DataType.META;
    data: any;
}
export class Meta {
    id = 0;
    name: string = "";
    levels: string[] = []
    meta_type = "";
    meta_key = "";
    description = "";
    version = 0;
    states = "";
    fields = "";
    config = "";
    relation?: Relation;
    flag = 0;
    create_time = new Date;
    d3node?: D3Node = undefined;

    resetD3Node() {
        this.d3node = undefined;
        this.initD3Node();
    }


    initD3Node() {
        if (this.d3node) return;
        let color = "black"
        if (this.isState()) color = "#d02b06"
        const node = new D3Node;
        node.id = this.id;
        node.textColor = color;
        // the css class does not exists, just to identify the same
        node.classForSame = "id" + this.id;
        node.name = this.levels[this.levels.length - 1];
        node.title = this.name;
        node.nodeType = this.meta_type;
        this.d3node = node;
        // append self to node-------------------
        const data = new NatureData;
        data.data = this;
        data.dataType = DataType.META;
        this.d3node.data = data;
        return this;
    }
    init() {
        this.name = this.meta_type + ":" + this.meta_key + ":" + this.version
        this.levels = this.meta_key.split("/");
    }

    static fromName(name: string) {
        const parts = name.split(":");
        let rtn = new Meta;
        rtn.meta_type = parts[0];
        rtn.meta_key = parts[1];
        rtn.version = Number.parseInt(parts[2]);
        rtn.levels = rtn.meta_key.split("/");
        rtn.name = name;
        rtn.id = - 1;
        rtn.initD3Node();
        return rtn;
    }

    isState(): boolean {
        return this.states.trim().length > 0
    }

    instanceKey(id: string, para: string, staVer: number) {
        return this.name + "|" + id + "|" + para + "|" + staVer
    }
}

export class Relation {
    id = 0;
    from_meta = "";
    to_meta = "";
    settings = "";
    flag = 0;
}

export class InstanceQueryCondition {
    id: string = "0";
    meta: Meta = new Meta;
    para: string = "";
    staVer: number = 0;
}

export class Instance {
    id: string = "0";
    data: BizObject = new BizObject;
    create_time: Date = new Date;
}

export class BizObject {
    meta: string = "";
    content: string = "";
    context: Map<String, String> = new Map;
    sys_context: Map<String, String> = new Map;
    states: Set<String> = new Set;
    state_version: number = 0;
    from?: FromInstance;
    para: string = "";
}

export class FromInstance {
    id: String = "";
    meta: String = "";
    para: String = "";
    state_version = 0;

}