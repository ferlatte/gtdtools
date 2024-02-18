#! /usr/bin/osascript -l JavaScript
// -*- mode: JavaScript -*-

// Turns out that project.completed() only counted "done", which meant
// that dropped project were getting counted as active. Explicitly use
// the status property to test for the state we actually want.
function isProjectActive(project) {
  return project.status() === "active status";
}

function isProjectPaused(project) {
  return project.status() === "on hold status";
}

function isProjectPausedOrActive(project) {
  return isProjectPaused(project) || isProjectActive(project);
}

function getAreaNames(doc) {
  let folders = doc.flattenedFolders();
  let areaFolder = folders.find(f => f.name() === "Areas of Focus");
  let areaNames = [];
  let projects = areaFolder.flattenedProjects();
  for (let project of projects) {
    areaNames.push(project.name());
  }
  return areaNames;
}

function getActiveProjects(doc) {
  let projects = doc.flattenedProjects();
  return projects.filter(isProjectActive);
}

function getActiveOrPausedProjects(doc) {
  let projects = doc.flattenedProjects();
  return projects.filter(isProjectPausedOrActive);
}
function getProjectNames(projects) {
  let projectNames = [];
  for (let project of projects) {
    projectNames.push(project.name());
  }
  return projectNames;
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
    config.areas = false;
    config.projects = true;
  }
  return config;
}

/* exported run */
function run(argv) {
  let config = parseArgv(argv);
  let ofApp = Application("OmniFocus");
  if (! ofApp) {
    console.log("Couldn't find OmniFocus");
    return;
  }
  ofApp.includeStandardAdditions = true;
  ofApp.strictPropertyScope = true;
  ofApp.strictCommandScope = true;
  ofApp.strictParameterType = true;
  let doc = ofApp.defaultDocument();

  let names = [];
  let areaNames = getAreaNames(doc);
  let projectNames = getProjectNames(getActiveOrPausedProjects(doc));
    if (config.projects) {
      names = projectNames.filter(n => ! areaNames.includes(n));
  }
  if (config.areas) {
    names = areaNames;
  }
  names.sort();
  return names.join("\n");
}
