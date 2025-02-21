import * as vscode from 'vscode';

import { Position, Range, TextDocument } from 'vscode';
import { EmojiMapping } from '../models/EmojiMapping';

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

export function GetMapping(

) : EmojiMapping[] {
    // Get Mappings from Settings or something
    const mappings = vscode.workspace.getConfiguration('emoji-mapper').get<EmojiMapping[]>('mappings') ?? [];

    // Filter out incorrect targets
    const filteredMappings = mappings.filter(x =>
        x.target.match(new RegExp(/(\u00a9|\u00ae|[\u2000-\u3300]|\ud83c[\ud000-\udfff]|\ud83d[\ud000-\udfff]|\ud83e[\ud000-\udfff])/g)));

    return filteredMappings;    
}
