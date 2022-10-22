// The module 'vscode' contains the VS Code extensibility API
// Import the module and reference it with the alias vscode in your code below
import * as vscode from "vscode";
import { generateConsoleStatement } from "./core/generateConsoleStatement";
import { getSetting } from "./core/setting";
import { jsHandler, Position } from "./handler/jsHandler";

// This method is called when your extension is activated
// Your extension is activated the very first time the command is executed
export function activate(context: vscode.ExtensionContext) {
  // Use the console to output diagnostic information (console.log) and errors (console.error)
  // This line of code will only be executed once when your extension is activated
  console.log("console-generator is now active!");
  const commandMap = {
    "console-generator.generate-console": generatorHandler,
    "console-generator.delete-file-console": deleteFileHandler,
  };
  if (!!getSetting("enable")) {
    // The command has been defined in the package.json file
    // Now provide the implementation of the command with registerCommand
    // The commandId parameter must match the command field in package.json
    Object.entries(commandMap).forEach(([cmd, handler]) => {
      const disposable = vscode.commands.registerCommand(cmd, () => {
        // The code you place here will be executed every time your command is executed
        // Display a message box to the user
        handler();
      });
      context.subscriptions.push(disposable);
    });
  }
}
function getPosition(selectionPos: Position, document: vscode.TextDocument) {
  return new vscode.Position(selectionPos.line, 0);
}
function generatorHandler() {
  const editor = vscode.window.activeTextEditor;
  if (editor) {
    const curPos = editor.selection.active;
    // 获取从0开始的偏移量
    const offset = editor.document.offsetAt(curPos);
    // 获取当前文件的语言
    const language = editor.document.languageId;
    // TODO 如果是选中单词，则直接生成console,如果是只有光标，则需要根据此法环境自动对应的console
    const { identifier, position } = jsHandler.generate(
      editor.document.getText(),
      offset
    );
    // 可能不合法为空
    if (!position) return;
    editor.edit((editBuilder) => {
      let newline = false;
      // 如果插入到最后一行，需要手动添加\n，否则不会换行
      if (position.line === editor.document.lineCount) {
        newline = true;
      }
      const finalPos = getPosition(position, editor.document);
      editBuilder.insert(
        // TODO 根据词法语义生成
        // 在当前选中行下一行生成一个console
        finalPos,
        generateConsoleStatement(identifier, {
          newline,
          indent:
            // 这里自动获取第一个非空白字符的索引作为缩进
            editor.document.lineAt(finalPos.line)
              .firstNonWhitespaceCharacterIndex,
        })
      );
    });
  }
}
function deleteFileHandler() {
  const editor = vscode.window.activeTextEditor;
  if (editor) {
    const curPos = editor.selection.active;
    // 获取从0开始的偏移量
    const offset = editor.document.offsetAt(curPos);
    // 获取当前文件的语言
    const language = editor.document.languageId;
    const positions = jsHandler.delete(editor.document.getText());
    // 可能不合法为空
    if (!positions.length) return;
    editor.edit((editBuilder) => {
      positions.forEach(([start, end]) => {
        editBuilder.delete(
          new vscode.Range(
            new vscode.Position(start.line - 1, start.column),
            new vscode.Position(end.line - 1, end.column)
          )
        );
      });
    });
    vscode.window.showInformationMessage(
      `已删除${positions.length}条console语句`
    );
  }
}
// This method is called when your extension is deactivated
export function deactivate() {}
