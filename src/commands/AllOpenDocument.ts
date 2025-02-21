import * as vscode from 'vscode';
import { CountOccurencesInString, GetRangeOfTextDocument } from '../Utils/Utils';
import { EmojiMapping } from '../models/EmojiMapping';

export async function MapAllOpenDocuments() {
    let count: number = 0;
    // const modifiedDocuments: vscode.TextDocument[] = [];

    // Get text from open document
    const openTabs = vscode.window.tabGroups.all.flatMap(group => group.tabs);

    // Get Mappings from Settings or something
    const mappings = vscode.workspace.getConfiguration('emoji-mapper').get<EmojiMapping[]>('mappings') ?? [];

    // Create an editable work area
    const workspaceEdit = new vscode.WorkspaceEdit();

    for (const tab of openTabs){
        if (!(tab.input instanceof vscode.TabInputText)) {
            continue;
        }

        // Get the content
        const document = await vscode.workspace.openTextDocument(tab.input.uri);
        let content  = document.getText(); 

        // Replace any Mappings with replacement string
        mappings.forEach(map => {
            count += CountOccurencesInString(content, map.target);
            content = content?.replaceAll(map.target, map.replacement);
        });

        // Show the document in an editor (needed to modify it)
        const fullRange = GetRangeOfTextDocument(document);
        await workspaceEdit.replace(document.uri, fullRange, content);
    }

    // Apply the workspace edit
    await vscode.workspace.applyEdit(workspaceEdit);

    vscode.window.showInformationMessage(`Your document has been emoji mapped ${count} items!`);
}
