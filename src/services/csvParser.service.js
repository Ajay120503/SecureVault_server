const fs = require("fs");
const csv = require("csv-parser");

const detectFields = (row) => {
  return {
    siteName:
      row.name ||
      row.url ||
      row.origin ||
      row.website ||
      "",

    username:
      row.username ||
      row["user name"] ||
      row.login ||
      "",

    password:
      row.password ||
      row["password value"] ||
      row.pass ||
      ""
  };
};

exports.parseCSV = (path) => {
  return new Promise((resolve) => {
    const results = [];

    fs.createReadStream(path)
      .pipe(csv())
      .on("data", (row) => {
        const mapped = detectFields(row);

        if (mapped.password)
          results.push(mapped);
      })
      .on("end", () => resolve(results));
  });
};
