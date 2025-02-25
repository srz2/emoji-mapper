import * as vscode from 'vscode';
import { CountOccurencesInString, GetRangeOfTextDocument, FindEmojiPositions } from '../Utils/Utils';

export function RemoveAllEmojisFromDocument() {
    // Get text from open document
    const doc = vscode.window.activeTextEditor?.document;
    if (doc === undefined) {
         return;
    }
    let lines  = doc.getText()?.split('\n');
    
    let count: number = 0;
    const newContent = lines.map(line => {
        const positions = FindEmojiPositions(line);

        // Update counter
        count += positions.length;

        const newValue = removeEmojisByIndex(line, positions);
        return newValue;
    }).join('\n');

    // Put back the text to the open document
    const range = GetRangeOfTextDocument(doc);
    vscode.window.activeTextEditor?.edit(builder => builder.replace(range, newContent));

    vscode.window.showInformationMessage(`Your document has been emoji mapped! Removed ${count} items!`);
}

function removeEmojisByIndex(value: string, indices: number[]): string {
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
