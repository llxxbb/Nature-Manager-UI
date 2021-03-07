import { DOMAIN_SEPARATOR } from "@/config";
import { D3Node, DataType, NatureData } from "./node";
import { Relation } from "./relation";

export class MetaConfig {
    "is_state" = false;		// 缺省false, 如果`Meta`的 `state` 属性为空但又需要成为状态数据时，可以将这个属性设置为true。如一个计数器 `Meta` 是需要状态的。
    "master" = null;
    "multi_meta" = [];
    "cache_saved" = false;
    "only_one" = false;
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
    configObj: MetaConfig = new MetaConfig;
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
        const node = new D3Node;
        node.id = this.id;
        node.setState(this.isState());
        // the css class does not exists, just to identify the same
        node.setClassForSame("id" + this.id);
        node.name = this.levels[this.levels.length - 1];
        node.title = this.name;
        node.nodeType = this.meta_type;
        this.d3node = node;
        // append self to node-------------------
        const data = new NatureData;
        data.data = this;
        data.dataType = DataType.META;
        this.d3node.data = data;
        node.disabled = this.flag == 1? false: true;
        return this;
    }
    init() {
        this.name = this.meta_type + ":" + this.meta_key + ":" + this.version
        this.levels = this.meta_key.split(DOMAIN_SEPARATOR);
        if (this.config.trim().length > 0) this.configObj = JSON.parse(this.config);
        if (this.states.trim().length > 0) this.configObj.is_state = true;
    }

    static fromName(name: string) {
        const parts = name.split(":");
        let rtn = new Meta;
        rtn.meta_type = parts[0];
        rtn.meta_key = parts[1];
        rtn.version = Number.parseInt(parts[2]);
        rtn.levels = rtn.meta_key.split(DOMAIN_SEPARATOR);
        rtn.name = name;
        rtn.id = - 1;
        rtn.initD3Node();
        return rtn;
    }

    isState(): boolean {
        return this.configObj.is_state;
    }

    instanceKey(id: string, para: string, staVer: number) {
        return this.name + "|" + id + "|" + para + "|" + staVer
    }
}