
export class Meta {
    id = 0;
    name: string = "";
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
}

export class Relation {
    id = 0;
    from_meta = "";
    to_meta = "";
    settings = "";
    flag = 0;
}