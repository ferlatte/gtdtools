#! /usr/bin/osascript -l JavaScript
// -*- mode: JavaScript -*-

// Turns out that project.completed() only counted "done", which meant
// that dropped project were getting counted as active. Explicitly use
// the status property to test for the state we actually want.
function isProjectActive(project) {
  return project.status() === "active status";
}

function isProjectOnHold(project) {
  return project.status() === "on hold status";
}

function isProjectAlive(project) {
  return isProjectActive(project) || isProjectOnHold(project)
}

function run(argv) {
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
  projects = doc.flattenedProjects();
  activeProjects = projects.filter(isProjectAlive);
  let projectNames = [];
  for (let project of activeProjects) {
    projectNames.push(project.name());
  }
  projectNames.sort();
  return projectNames.join("\n");
}
