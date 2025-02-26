import * as vscode from 'vscode';
import { GetRangeOfTextDocument, FindEmojiPositions, removeEmojisByIndex } from '../Utils/Utils';

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
