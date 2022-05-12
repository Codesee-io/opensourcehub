const fs = require("fs");

// Copy the contents of .env.sample to a .env file, but only if it doesn't
// already exist
try {
  if (!process.env.NODE_ENV !== "production") {
    fs.copyFileSync(".env.sample", ".env", fs.constants.COPYFILE_EXCL);
    console.info("Created a .env file");
  }
} catch (err) {}
