export interface TwoDigit {
    server_time?: Date;
    live?:        Live;
    result?:      Result[];
    holiday?:     Holiday;
}

export interface Holiday {
    status?: string;
    date?:   Date;
    name?:   string;
}

export interface Live {
    set?:   string;
    value?: string;
    time?:  Date;
    twod?:  string;
    date?:  Date;
}

export interface Result {
    set?:            string;
    value?:          string;
    open_time?:      string;
    twod?:           string;
    stock_date?:     Date;
    stock_datetime?: Date;
    history_id?:     null | string;
}
