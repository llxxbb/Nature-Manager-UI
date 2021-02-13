import hash from "hash-it";
import { D3Node, DataType, NatureData } from "./node";
import { Meta } from "./meta";

export class InstanceQueryCondition {
    id: string = "0";
    meta: Meta = new Meta;
    para: string = "";
    staVer: number = 0;

    toFromInstance() {
        let rtn = new FromInstance;
        rtn.id = this.id;
        rtn.meta = this.meta.name;
        rtn.para = this.para;
        rtn.state_version = this.staVer;
        return rtn;
    }
    static fromInstance(ins: Instance){
        let rtn = new InstanceQueryCondition;
        rtn.id = ins.id;
        rtn.meta = ins.meta;
        rtn.para = ins.data.para;
        rtn.staVer = ins.data.state_version;
        return rtn;
    }
}

export class Instance {
    id: string = "0";
    data: BizObject = new BizObject;
    create_time: Date = new Date;
    meta: Meta = undefined as any as Meta;

    getKey() {
        let para = this.data.para ? this.data.para : "";
        let ver = this.data.state_version ? this.data.state_version : 0
        return this.data.meta + "|" + this.id + "|" + para + "|" + ver
    }
    keyNoMeta() {
        let para = this.data.para ? this.data.para : "";
        let ver = this.data.state_version ? this.data.state_version : 0
        return this.id + "|" + para + "|" + ver
    }

    static toD3Node(raw: Instance, metaMap: Map<String, Meta>) {
        let cIns = Object.assign(new Instance, raw);
        let meta = metaMap.get(cIns.data.meta) as Meta;
        cIns.meta = meta;
        const nd = new NatureData;
        nd.dataType = DataType.INSTANCE;
        nd.data = cIns;
        let node = new D3Node;
        node.setState(meta.isState())
        node.name = meta.levels[meta.levels.length - 1];
        node.setClassForSame(cIns.id == "0" ? "id" + cIns.data.para : "id" + cIns.id);
        node.title = cIns.getKey();
        node.data = nd;
        node.id = hash(cIns.getKey())
        return node;
    }
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
    id: string = "";
    meta: string = "";
    para: string = "";
    state_version = 0;

}