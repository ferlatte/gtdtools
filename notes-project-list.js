#! /usr/bin/osascript -l JavaScript
// -*- mode: JavaScript -*-

function findFolderNamed(app, name) {
  let folders = app.folders();
  // I don't know why for (let x of folders) doesn't work, but it doesn't.
  // Need to explicitly index the folders array.
  for (let i = 0; i < folders.length; i += 1) {
    if (folders[i].name() === name) {
      return folders[i];
    }
  }
  return undefined;
}

function run(argv) {
  let notesApp = Application("Notes");
  if (! notesApp) {
    console.log("Couldn't find Notes");
    return;
  }
  notesApp.includeStandardAdditions = true;
  notesApp.strictPropertyScope = true;
  notesApp.strictCommandScope = true;
  notesApp.strictParameterType = true;

  projectFolder = findFolderNamed(notesApp, "Projects");
  let names = [];
  let projectFolders = projectFolder.folders();
  for (let i = 0; i < projectFolders.length; i += 1) {
    f = projectFolders[i];
    names.push(f.name());
  }
  names.sort();
  return names.join("\n");
}
