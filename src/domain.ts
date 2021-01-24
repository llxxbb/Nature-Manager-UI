
export class Meta {
    id = 0;
    name: string = "";
    levels: string[] = []
    isFake = false;
    // id in meta table. used to point out the fake `meta` and the real `meta` are same
    // MetaType::Null is -1
    // domain-parent is negative less than -1.
    realId = 0;
    children?: Meta[];
    _children?: Meta[];
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

    init() {
        this.name = this.meta_type + ":" + this.meta_key + ":" + this.version
        this.levels = this.meta_key.split("/");
        this.realId = this.id
    }

    static fromName(name: string) {
        const parts = name.split(":");
        let rtn = new Meta;
        rtn.meta_type = parts[0];
        rtn.meta_key = parts[1];
        rtn.version = Number.parseInt(parts[2]);
        rtn.levels = rtn.meta_key.split("/");
        rtn.name = name;
        return rtn;
    }

    canQueryInstance(): boolean {
        return this.realId > 0;
    }
}

export class Relation {
    id = 0;
    from_meta = "";
    to_meta = "";
    settings = "";
    flag = 0;
}