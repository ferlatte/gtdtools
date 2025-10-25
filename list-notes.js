#! /usr/bin/osascript -l JavaScript
// -*- mode: JavaScript -*-

function findFolderNamed(app_or_folder, name) {
  let folders = app_or_folder.folders();
  // I don't know why for (let x of folders) doesn't work, but it doesn't.
  // Need to explicitly index the folders array.
  for (let i = 0; i < folders.length; i += 1) {
    if (folders[i].name() === name) {
      return folders[i];
    }
  }
  return undefined;
}

function parseArgv(argv) {
  let config = {
    projects: true,
    areas: false
  };
  if (argv.length === 0) {
    return config;
  }
  if (argv[0] === '-a') {
    config.areas = true;
    config.projects = false;
  }
  if (argv[0] === '-p') {
    config.projects = true;
    config.areas = false;
  }
  return config;
}

/* exported run */
function run(argv) {
  let config = parseArgv(argv);

  let notesApp = Application("Notes");
  if (! notesApp) {
    console.log("Couldn't find Notes");
    return;
  }
  notesApp.includeStandardAdditions = true;
  notesApp.strictPropertyScope = true;
  notesApp.strictCommandScope = true;
  notesApp.strictParameterType = true;
  let personalFolder = undefined;
  personalFolder = findFolderNamed(notesApp, "Personal")

  let srcFolder = undefined;
  if (config.projects) {
    srcFolder = findFolderNamed(personalFolder, "Projects");
  }
  if (config.areas) {
    srcFolder = findFolderNamed(personalFolder, "Areas of Focus");
  }
  let names = [];
  let srcFolders = srcFolder.folders();
  for (let i = 0; i < srcFolders.length; i += 1) {
    let f = srcFolders[i];
    names.push(f.name());
  }
  names.sort();
  return names.join("\n");
}
