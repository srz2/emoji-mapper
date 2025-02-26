import * as vscode from 'vscode';
import { FindEmojiPositions, GetRangeOfTextDocument, removeEmojisByIndex } from '../Utils/Utils';

export async function RemoveAllEmojisFroAllOpenDocuments() {
    let count: number = 0;

    // Get text from open document
    const openTabs = vscode.window.tabGroups.all.flatMap(group => group.tabs);

    // Create an editable work area
    const workspaceEdit = new vscode.WorkspaceEdit();

    for (const tab of openTabs){
        if (!(tab.input instanceof vscode.TabInputText)) {
            continue;
        }

        // Get the content
        const document = await vscode.workspace.openTextDocument(tab.input.uri);
        let content  = document.getText();

        content = content
                    .split('\n')
                    .map(line => {
                        const positions = FindEmojiPositions(line);
                
                        // Update counter
                        count += positions.length;
                
                        const newValue = removeEmojisByIndex(line, positions);
                        return newValue;
                    }).join("\n");

        // Show the document in an editor (needed to modify it)
        const fullRange = GetRangeOfTextDocument(document);
        await workspaceEdit.replace(document.uri, fullRange, content);
    }

    // Apply the workspace edit
    await vscode.workspace.applyEdit(workspaceEdit);

    vscode.window.showInformationMessage(`Your document has been emoji mapped ${count} items!`);
}
