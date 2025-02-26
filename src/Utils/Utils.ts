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

export function FindEmojiPositions(text: string): number[] {
    // Updated regex to capture entire emoji sequences
    const emojiRegex = /(\p{Extended_Pictographic}(\p{Join_Control}\p{Extended_Pictographic})*)/gu;
    const positions: number[] = [];

    let match;
    while ((match = emojiRegex.exec(text)) !== null) {
        positions.push(match.index!);
    }

    return positions;
}

export function removeEmojisByIndex(value: string, indices: number[]): string {
    // Ensure indices correspond to actual grapheme clusters
    let graphemes: string[] = [];
    let indexMap: number[] = [];
    
    let segmenter = new Intl.Segmenter("en", { granularity: "grapheme" });
    let currentIndex = 0;
    
    for (let segment of segmenter.segment(value)) {
        graphemes.push(segment.segment);
        indexMap.push(currentIndex);
        currentIndex += segment.segment.length;
    }
    
    // Sort indices in descending order to avoid shifting issues
    indices.sort((a, b) => b - a);
    
    // Convert provided indices to corresponding grapheme index
    let graphemeIndices = indices.map(i => indexMap.indexOf(i)).filter(i => i !== -1);
    
    // Remove graphemes at specified indices
    for (let index of graphemeIndices) {
        if (index >= 0 && index < graphemes.length) {
            graphemes.splice(index, 1);
        }
    }
    
    // Join the array back into a string
    return graphemes.join('');
}
