// Script used to figure out the creation date of each project
var exec = require("child_process").exec;
var fs = require("fs");

// Array of file paths
const files = [
  // "./public/projects/rohittp0/GramUp.mdx",
  // "./public/projects/akanksha-raghav/Minor_Project.mdx",
];

const command = (filePath) => {
  return `git log --follow --format=%ad --date iso-strict ${filePath} | tail -1`;
};

files.forEach((file) => {
  exec(command(file), function (err, stdout, stderr) {
    if (err != null) {
      console.error("Something went wrong");
    } else if (typeof stderr != "string") {
      console.error("Something went wrong");
    } else {
      console.log(file + ": " + stdout);

      var data = fs.readFileSync(file, "utf-8");
      var split = data.split("---");
      var newValue = split[1] + `created: ${stdout}`;
      var updatedFileContent = [split[0], newValue, split[2]].join("---");
      fs.writeFileSync(file, updatedFileContent, "utf-8");
    }
  });
});
