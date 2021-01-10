import { NATURE_MANAGER_URL } from "@/config";
import { Meta, Relation } from "@/domain";

const axios = require('axios').default;
export class Nature {
    async getAll() {
        // get meta list
        let metaList = await getAllMeta();
        // get relation list
        let relationList = await getAllRelation();
        // make tree
        let mySet = new Set;
        relationList.forEach(r => {
            let from = findMeta(metaList, r, (m, r) => m.name == r.from_meta);
            let to = findMeta(metaList, r, (m, r) => m.name == r.to_meta);
            // check
            if (!from.meta || !to.meta) return;
            mySet.add(from.meta);
            if (mySet.has(to.meta)) to.meta = metaShadow(to.meta, r.id)
            mySet.add(to.meta);
            console.log("from: " + from.meta.name, "to: " + to.meta.name, r)
            // add relation
            if (from.meta.children) from.meta.children.push(to.meta)
            else from.meta.children = [to.meta]
            // remove "to" from metaList
            if (to.index > -1) metaList.splice(to.index, 1)
        })
        console.log(metaList)
        console.log(relationList)
    }
}

function metaShadow(m: Meta, id: number) {
    var rtn = Object.assign(new Meta, m);
    rtn.name = rtn.name + "|" + id;
    return m;
}

function findMeta(metaList: Meta[], r: Relation, predicate: (m: Meta, r: Relation) => boolean) {
    let index = -1;
    let meta = null as any as Meta;
    metaList.find((m, idx) => {
        if (predicate(m, r)) {
            index = idx;
            meta = m;
            return true;
        } else {
            if (m.children) {
                let child = findMeta(m.children, r, predicate);
                if (child.meta) {
                    meta = child.meta;
                    return true;
                } else return false;
            }
            else return false;
        }
    });
    return { meta, index };
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

async function getAllMeta() {
    return await getItems<Meta>("metaIdGreatThan",
        item => {
            let rtn = Object.assign(new Meta, item);
            rtn.fixName();
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
