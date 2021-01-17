
export class Meta {
    id = 0;
    name: string = "";
    isFake = false;
    realName = "";
    children?: Meta[];
    _children?: Meta[];
    meta_type = "";
    meta_key = "";
    description = "";
    version = 0;
    states = "";
    fields = "";
    config = "";
    flag = 0;
    create_time = new Date;

    fixName() {
        this.name = this.meta_type + ":" + this.meta_key + ":" + this.version
    }

    static fromName(name: string) {
        const parts = name.split(":");
        let rtn = new Meta;
        rtn.meta_type = parts[0];
        rtn.meta_key = parts[1];
        rtn.version = Number.parseInt(parts[2]);
        rtn.name = name;
        return rtn;
    }
}

export class Relation {
    id = 0;
    from_meta = "";
    to_meta = "";
    settings = "";
    flag = 0;
}