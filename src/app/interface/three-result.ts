export interface ThreeResults {
    data?:    Datum[];
    result?:  number;
    message?: string;
}

export interface Datum {
    result?:   string;
    datetime?: Date;
}
