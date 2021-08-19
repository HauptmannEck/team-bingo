export interface IGame {
    id: number;
    uuid: string;
    name: string;
    desc: string | null;
    passKey: boolean;
}

export interface IWord {
    id: number;
    uuid: string;
    text: string;
}

export interface IBoard {
    id: number;
    gameUuid: string;
    name: string;
    cells: ICell[];
}

export interface ICell {
    wordId: number;
    word: string;
    selected: boolean;
}