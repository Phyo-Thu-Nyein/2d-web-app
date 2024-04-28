export interface TwoHistory {
    child?: Child[];
    date?:  Date;
}

export interface Child {
    time?:       string;
    set?:        string;
    value?:      string;
    twod?:       string;
    history_id?: string;
}
