// The module 'vscode' contains the VS Code extensibility API
// Import the module and reference it with the alias vscode in your code below
import * as vscode from "vscode";
import { jsHandler, Location } from "./handler/jsHandler";

// This method is called when your extension is activated
// Your extension is activated the very first time the command is executed
export function activate(context: vscode.ExtensionContext) {
  // Use the console to output diagnostic information (console.log) and errors (console.error)
  // This line of code will only be executed once when your extension is activated
  console.log("console-generator is now active!");
  const commandMap = {
    "console-generator.generator": () => {},
  };
  // The command has been defined in the package.json file
  // Now provide the implementation of the command with registerCommand
  // The commandId parameter must match the command field in package.json
  let disposable = vscode.commands.registerCommand(
    "console-generator.generator",
    () => {
      // The code you place here will be executed every time your command is executed
      // Display a message box to the user
      generatorHandler();
    }
  );

  context.subscriptions.push(disposable);
}
function getConsoleString(identifier: string, newLine: boolean = false) {
  return `${newLine ? "\n" : ""}console.log("${identifier}:",${identifier});\n`;
}
function getPosition(selectionPos: Location) {
  console.log("selectionPos.end.line:", selectionPos.end.line);
  return new vscode.Position(selectionPos.end.line, 0);
}
function generatorHandler() {
  const editor = vscode.window.activeTextEditor;
  if (editor) {
    const curPos = editor.selection.active;
    // 获取从0开始的偏移量
    const offset = editor.document.offsetAt(curPos);
    // 获取当前文件的语言
    const language = editor.document.languageId;
    const { identifier, loc } = jsHandler(editor.document.getText(), offset);
    console.log("curPos:", curPos, "offset:", offset, loc);
    // 可能不合法为空
    if (!loc) return;
    editor.edit((editBuilder) => {
      let newLine = false;
      // 如果插入到最后一行，需要手动添加\n，否则不会换行
      if (loc.end.line === editor.document.lineCount) {
        newLine = true;
      }
      editBuilder.insert(
        // TODO 根据词法语义生成
        // 在当前选中行下一行生成一个console
        getPosition(loc),
        getConsoleString(identifier, newLine)
      );
    });
  }
}
// This method is called when your extension is deactivated
export function deactivate() {}
