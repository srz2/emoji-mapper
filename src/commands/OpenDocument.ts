import * as vscode from 'vscode';
import { CountOccurencesInString, GetRangeOfTextDocument, GetMapping } from '../Utils/Utils';

export function MapOpenDocument() {
    // Get text from open document
    const doc = vscode.window.activeTextEditor?.document;
    if (doc === undefined) {
         return;
    }
    let content  = doc.getText();

    // Get Mappings
    const mappings = GetMapping();

    // Replace any Mappings with replacement string
    let count: number = 0;
    mappings.forEach(map => {
        count += CountOccurencesInString(content, map.target);
        content = content?.replaceAll(map.target, map.replacement);
    });

    // Put back the text to the open document
    const range = GetRangeOfTextDocument(doc);
    vscode.window.activeTextEditor?.edit(builder => builder.replace(range, content));

    vscode.window.showInformationMessage(`Your document has been emoji mapped! Replaced ${count} items!`);
}
