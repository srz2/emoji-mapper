import * as vscode from 'vscode';
import { CountOccurencesInString, GetRangeOfTextDocument } from '../Utils/Utils';
import { EmojiMapping } from '../models/EmojiMapping';

export function MapOpenDocument() {
    // Get text from open document
    const doc = vscode.window.activeTextEditor?.document;
    if (doc === undefined) {
         return;
    }
    let content  = doc.getText();

    // Get Mappings from Settings or something
    const mappings = vscode.workspace.getConfiguration('emoji-mapper').get<EmojiMapping[]>('mappings') ?? [];

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
