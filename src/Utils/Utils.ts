import { Position, Range, TextDocument } from 'vscode';

export function GetRangeOfTextDocument(
    doc: TextDocument
) : Range {
    if (doc === undefined){
        return new Range(new Position(0, 0), new Position(0,0));
    }

    const range = new Range(doc.positionAt(0), doc.positionAt(doc.getText().length));
    return range;
}

export function CountOccurencesInString(
    content: string,
    target: string
) : number {
    let count: number = 0;
    count += content.match(new RegExp(target, "g"))?.length ?? 0;
    return count;
}