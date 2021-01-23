import { NATURE_MANAGER_URL } from "@/config";
import { Meta, Relation } from "@/domain";
import { metaDefined, relationDefined } from "@/testData/natureData";

const axios = require('axios').default;

let allMeta: Meta[];
let metaIdMax = 0;
export class Nature {
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

        let metaList = allMeta.slice();
        // assembly relation tree-------------------
        // find max id
        metaList.forEach(one => { if (one.id > metaIdMax) metaIdMax = one.id })
        let idIncrease = metaIdMax;
        // process each relation
        relationList.forEach(r => {
            // find relation meta
            let from = findMeta(metaList, r, (m, r) => m.name == r.from_meta);
            let to = findMeta(metaList, r, (m, r) => m.name == r.to_meta, true);
            // check
            if (!from.meta || !to.meta) return;
            if (to.index == from.index) to.index = -1;
            if (to.index == -1) to.meta = fakeMeta(to.meta, r.id, ++idIncrease)
            // add relation
            to.meta.relation = r;
            addChild(from.meta, to.meta);
            // remove "to" from metaList
            if (to.index > -1) metaList.splice(to.index, 1)
        })
        // make tree
        let root = makeRootMeta(metaList);
        return root;
    }

    getDomain() {
        let unique = new Map<String, Meta>();
        let root = makeRootMeta([]);
        let idSeq = metaIdMax;
        allMeta.forEach(one => {
            let path = "/";
            for (let index = 0; index < one.levels.length; index++) {
                // find parent
                let parent = unique.get(path);
                if (!parent) {
                    // only root has no parent
                    parent = root;
                    unique.set(path, parent);
                }
                const level = one.levels[index];
                path = path + level + "/";
                let child = unique.get(path);
                if (child) continue;
                if (index < one.levels.length - 1)
                    child = makeFakeMeta(one.levels, index, ++idSeq)
                else {
                    child = Object.assign(new Meta, one);
                    child.children = undefined;
                }
                addChild(parent, child)
                unique.set(path, child);
            }
        })
        return root;
    }
}

function makeFakeMeta(levels: string[], end: number, id: number) {
    let rtn = new Meta
    rtn.id = id;
    rtn.isFake = true;
    rtn.meta_key = levels.slice(0, end + 1).join("/")
    rtn.init()
    return rtn
}

function addChild(parent: Meta, child: Meta) {
    if (parent.children)
        parent.children.push(child);
    else
        parent.children = [child];
}

function makeRootMeta(children: Meta[]) {
    let root = new Meta;
    root.children = children;
    root.name = "root";
    root.meta_key = "root";
    root.levels = ["root"];
    return root;
}

function fakeMeta(m: Meta, id: number, metaId: number) {
    var rtn = Object.assign(new Meta, m);
    rtn.realId = m.meta_type == "N" ? metaId : m.id;
    rtn.children = undefined;
    rtn.isFake = true;
    rtn.name = rtn.name + "|" + id;
    rtn.id = metaId;
    return rtn;
}

function findMeta(metaList: Meta[], r: Relation, predicate: (m: Meta, r: Relation) => boolean, isTo = false) {
    // check for meta type: Null
    if (isTo) {
        let toM = Meta.fromName(r.to_meta);
        if (toM.meta_type == "N") return { meta: toM, index: -1 };
    };
    // normal check
    return findOneLayer(metaList, predicate, r);
}

function findOneLayer(metaList: Meta[], predicate: (m: Meta, r: Relation) => boolean, r: Relation) {
    let index = -1; // -1 not found in top level
    let found = metaList.find((m, idx) => {
        if (predicate(m, r)) {
            index = idx;
            found = m;
            return true;
        }
    })
    if (found) return { meta: found, index };
    for (let idx = 0; idx < metaList.length; idx++) {
        let m = metaList[idx];
        if (!m.children) continue;
        let fOne: { meta: Meta | null, index: number } = findOneLayer(m.children, predicate, r)
        if (fOne.meta) return { meta: fOne.meta, index: -1 }
    }
    return { meta: null, index: -1 };
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
        let meta = rtn.data.Ok;
        meta.forEach(i => {
            let myMeta = toT(i);
            all.push(myMeta)
        })
        if (meta.length < size) break;
        id = idFun(meta);
    }
    return all;
};
