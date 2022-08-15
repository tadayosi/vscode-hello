// The module 'vscode' contains the VS Code extensibility API
// Import the module and reference it with the alias vscode in your code below
import * as vscode from 'vscode';

class MakefileSymbolProvider implements vscode.DocumentSymbolProvider {
  private readonly targetPattern = /^([^#\s]+):/;

  provideDocumentSymbols(document: vscode.TextDocument, token: vscode.CancellationToken)
    : Thenable<vscode.SymbolInformation[]> {
    return new Promise((resolve, reject) => {
      const symbols = [];

      for (let i = 0; i < document.lineCount; i++) {
        const line = document.lineAt(i);
        const match = line.text.match(this.targetPattern);
        if (match) {
          const target = match[1];
          if (target === '.PHONY') {
            continue;
          }
          symbols.push(new vscode.SymbolInformation(
            target,
            vscode.SymbolKind.Field,
            '',
            new vscode.Location(document.uri, line.range)
          ));
        }
      }

      resolve(symbols);
    });
  }
}

// this method is called when your extension is activated
// your extension is activated the very first time the command is executed
export function activate(context: vscode.ExtensionContext) {

  // Use the console to output diagnostic information (console.log) and errors (console.error)
  // This line of code will only be executed once when your extension is activated
  console.log('Extension "vscode-hello" is activated');

  // The command has been defined in the package.json file
  // Now provide the implementation of the command with registerCommand
  // The commandId parameter must match the command field in package.json
  const hello = vscode.commands.registerCommand('vscode-hello.hello', () => {
    // The code you place here will be executed every time your command is executed
    // Display a message box to the user
    vscode.window.showInformationMessage('[vscode-hello] Hello!');
  });

  const makefile = vscode.languages.registerDocumentSymbolProvider(
    { language: 'makefile' }, new MakefileSymbolProvider()
  );

  context.subscriptions.push(hello, makefile);
}

// this method is called when your extension is deactivated
export function deactivate() {
  console.log('Extension "vscode-hello" is deactivated');
}
