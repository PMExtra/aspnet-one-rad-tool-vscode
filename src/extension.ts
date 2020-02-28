// The module 'vscode' contains the VS Code extensibility API
// Import the module and reference it with the alias vscode in your code below
import * as vscode from "vscode";
import * as path from "path";
import * as os from "os";
import { spawn } from "child_process";
import * as AdmZip from "adm-zip";

// this method is called when your extension is activated
// your extension is activated the very first time the command is executed
export function activate(context: vscode.ExtensionContext): void {
  const commandOutput = vscode.window.createOutputChannel("Shell");
  context.subscriptions.push(commandOutput);

  const disposable = vscode.commands.registerCommand(
    "extension.runRadTool",
    (uri: vscode.Uri) => {
      commandOutput.show();
      commandOutput.appendLine("-> code generation is begining...");

      // unzip AspNetOneRadTool.zip to folder
      const zip = new AdmZip(
        path.join(__dirname, "..", "resources/AspNetOneRadTool.zip")
      );

      const tmpDir = os.tmpdir();

      zip.extractAllTo(tmpDir, true);

      // run rad tool
      const exePath = path.join(
        tmpDir,
        "AspNetOneRadTool",
        "AspNetOneRadTool.exe"
      );
      const process = spawn(exePath, [path.basename(uri.fsPath)], {
        cwd: path.dirname(uri.fsPath),
        shell: true
      });
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      function printOutput(data: any): void {
        commandOutput.append(data.toString());
        process.stdin.write("\x0D");
      }
      process.stdout.on("data", printOutput);
      process.stderr.on("data", printOutput);
    }
  );

  context.subscriptions.push(disposable);
}

export function deactivate(): void {
  // this method is called when your extension is deactivated
}
