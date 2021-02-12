import { INSTANCE_RECENT_SIZE, INSTANCE_RELATED_AUTO, NATURE_MANAGER_URL } from "@/config";
import { InstanceQueryCondition, Instance, FromInstance } from "@/domain/instance";
import { Meta } from "@/domain/meta";
import { D3Node } from "@/domain/node";
import { Relation } from "@/domain/relation";
import { metaDefined, relationDefined } from "@/testData/natureData";

const axios = require('axios').default;

let allMeta: Meta[];
let metaIdMax = 0;
let metaMap: Map<String, Meta> = new Map;
export class Nature {
    // data for relation mode
    async getRelation() {
        // // mock data for test-----------------------
        // // get meta list
        // allMeta = await getAllMetaMock();
        // // get relation list
        // let relationList = await getAllRelationMock();

        // real data-----------------------
        // get meta list
        allMeta = await getAllMeta();
        // get relation list
        let relationList = await getAllRelation();

        let metaList = allMeta.slice(); // copy it, and not modify the original
        allMeta.forEach(one => {
            one.initD3Node();
            metaMap.set(one.name, one);
        });
        // assembly relation tree-------------------
        // find max id
        metaList.forEach(one => { if (one.id > metaIdMax) metaIdMax = one.id })
        let idIncrease = metaIdMax;
        // process each relation
        relationList.forEach(r => {
            // find relation meta and it's index
            let from = findMeta(metaList, metaMap, r, (m, r) => m.name == r.from_meta);
            let to = findMeta(metaList, metaMap, r, (m, r) => m.name == r.to_meta, true);
            // check
            if (!from.meta || !to.meta) return; // TODO show undefined `Meta` in relation-mode
            if (to.index == from.index) to.index = -1;
            if (to.index == -1) to.meta = fakeMeta(to.meta, r.id, ++idIncrease)
            if (to.index == -2) {
                const node = to.meta.d3node as D3Node;
                node.id = ++idIncrease;
                node.isFake = true;
            }
            // add relation
            to.meta.relation = r;
            (from.meta.d3node as D3Node).addChild(to.meta.d3node as D3Node);
            // remove "to" from metaList
            if (to.index > -1) metaList.splice(to.index, 1)
        })
        // make tree
        let root = makeMetaRootNode(metaList);
        return root;
    }

    // data for domain mode
    getDomain() {
        let unique = new Map<String, D3Node>();
        let root = makeMetaRootNode([]);
        let idSeq = -1;
        allMeta.forEach(one => {
            // init parent
            let path = "/";
            let parent = unique.get(path);
            if (!parent) {
                // only root has no parent
                parent = root;
                unique.set(path, parent);
            }
            // init child
            for (let index = 0; index < one.levels.length; index++) {
                // find parent
                const level = one.levels[index];
                path = path + level + "/";
                let child = unique.get(path);
                if (index < one.levels.length - 1) {
                    if (!child) {
                        child = makeParentDomainNode(one.levels, index, --idSeq)
                        parent.addChild(child);
                        unique.set(path, child);
                    }
                    parent = child;
                } else {
                    if (!child) {
                        child = Object.assign(new D3Node, one.d3node);
                        child.setChildren(undefined);
                        parent.addChild(child);
                        unique.set(path, child);
                    }
                    else {
                        // change fake to false, which created early
                        child.id = one.id;
                        child.isFake = false;
                        child.data = one;
                    }
                }
            }
        })
        return root;
    }

    async getInstance(condition: InstanceQueryCondition) {
        let useVersion = true
        const meta = condition.meta;
        if (meta.isState() && condition.staVer == -1) useVersion = false;
        let instance: Instance = undefined as any as Instance;
        if (useVersion) {
            instance = await getInstanceById(condition.toFromInstance());
        } else {
            // get last version of `State-Meta`
            const data = {
                id: condition.id,
                meta: "",
                key_le: meta.instanceKey(condition.id, condition.para, Number.MAX_SAFE_INTEGER),
            };
            let res = await axios.post(NATURE_MANAGER_URL + "/instance/byKey", data);
            if (res.data.Ok.length > 0) instance = res.data.Ok[0]
        }
        if (!instance) {
            alert("Sorry! not found");
            return null;
        }
        let rtn = Instance.toD3Node(instance, metaMap)
        if (INSTANCE_RELATED_AUTO) return await this.fetchInstanceAuto(rtn);
        return rtn;
    };

    private async fetchInstanceAuto(from: D3Node) {
        // upstream first
        let up = await this.getUpstream(from)
        while (!up.leftNavDone) {
            up = await this.getUpstream(up)
        }
        // fetch downstream
        await this.getDownRecursively(up);
        // return 
        return up;
    }

    private async getDownRecursively(up: D3Node) {
        await this.getDownstream(up);
        if (!up.hasChild()) return;
        const nodes = up.getChildren() as D3Node[];
        for (let index = 0; index < nodes.length; index++) {
            const one = nodes[index];
            await this.getDownRecursively(one)
        }
    }

    // fetch upstream
    async getUpstream(currentNode: D3Node) {
        currentNode.leftNavDone = true;
        let instance = currentNode.data.data as Instance
        let from = instance.data.from;
        if (!from) return currentNode;
        let rtnRaw = await getInstanceById(from);
        let rtn = Instance.toD3Node(rtnRaw, metaMap);
        rtn.addChild(currentNode)
        return rtn;
    }

    // fill downstream
    async getDownstream(currentNode: D3Node) {
        // fetch data
        let res = await axios.post(NATURE_MANAGER_URL + "/instance/downstream", (currentNode.data.data as Instance).getKey());
        let rtnRaw: Instance[] = res.data.Ok
        rtnRaw.forEach(d => {
            let one = Instance.toD3Node(d, metaMap)
            currentNode.addChild(one);
            one.leftNavDone = true;
        })
        currentNode.rightNavDone = true;
        const root = currentNode.findRoot();
        return root;
    }

    async getRecent(meta: string) {
        const data = {
            meta,
            limit: INSTANCE_RECENT_SIZE
        };
        let res = await axios.post(NATURE_MANAGER_URL + "/instance/byKey", data);
        return res.data.Ok;
    }
}

async function getInstanceById(condition: FromInstance): Promise<Instance> {
    let res = await axios.post(NATURE_MANAGER_URL + "/instance/byId", condition);
    return res.data.Ok;
}

function makeParentDomainNode(levels: string[], end: number, nodeId: number) {
    let rtn = new D3Node
    rtn.id = nodeId;
    rtn.setClassForSame("id" + nodeId);
    rtn.isFake = true;
    rtn.name = levels[end]
    return rtn
}

function makeMetaRootNode(metaList: Meta[]) {
    const children = metaList.map(d => d.d3node);
    let root = new D3Node;
    root.setChildren(children as D3Node[]);
    root.name = "root";
    root.setClassForSame("idRoot");
    return root;
}

function fakeMeta(m: Meta, relationId: number, nodeId: number) {
    var rtn: Meta = Object.assign(new Meta, m);
    rtn.resetD3Node();
    const node = rtn.d3node;
    if (!node) throw new Error("imposable!");
    node.id = nodeId;
    node.isFake = true;
    node.title = rtn.name + "|" + relationId;
    return rtn;
}

function findMeta(metaList: Meta[], metaMap: Map<String, Meta>, r: Relation, predicate: (m: Meta, r: Relation) => boolean, isTo = false) {
    let index = -1; // not found in `metaList`
    let name: string = isTo ? r.to_meta : r.from_meta;
    let meta = metaMap.get(name);
    // check for meta type: Null
    if (isTo) {
        if (!meta) {
            // maybe MetaType::Null
            meta = Meta.fromName(name);
            metaMap.set(name, meta);
            index = -2; // not found and create new, so need not copy it to fake;
        }
        if (meta.meta_type == "N") {
            meta.id = -1;
            return { meta, index }
        };
    }
    // normal check
    let found = metaList.find((m, idx) => {
        if (predicate(m, r)) {
            index = idx;
            return true;
        }
    })
    if (found) return { meta: found, index };
    return { meta, index }
}

async function getAllRelationMock() {
    let rtn: Relation[] = [];
    relationDefined.forEach(one => {
        let m = Object.assign(new Relation, one);
        rtn.push(m);
    })
    return rtn;
}

async function getAllRelation() {
    return await getItems<Relation>("relationIdGreatThan",
        item => {
            let rtn = Object.assign(new Relation, item);
            return rtn;
        }, items => {
            return items[items.length - 1].id;
        });
}

async function getAllMetaMock() {
    let meta: Meta[] = [];
    metaDefined.forEach(one => {
        let m = Object.assign(new Meta, one);
        m.init()
        meta.push(m);
    })
    return meta;
}
async function getAllMeta() {
    return await getItems<Meta>("metaIdGreatThan",
        item => {
            let rtn = Object.assign(new Meta, item);
            rtn.init();
            return rtn;
        }, items => {
            return items[items.length - 1].id;
        });
}

async function getItems<T>(baseUrl: string, toT: (item: T) => T, idFun: (items: T[]) => number) {
    let url = NATURE_MANAGER_URL + "/" + baseUrl;
    let id = 0;
    let size = 1000;
    let go = true;
    let all: T[] = [];
    while (go) {
        let rtnR = await axios.get(url + "/" + id + "/" + size);
        let rtn = rtnR as { data: { Ok: T[] } }
        let dataReturned = rtn.data.Ok;
        dataReturned.forEach(i => {
            let myMeta = toT(i);
            all.push(myMeta)
        })
        if (dataReturned.length < size) break;
        id = idFun(dataReturned);
    }
    return all;
};
