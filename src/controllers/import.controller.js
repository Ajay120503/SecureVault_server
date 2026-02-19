const { parseCSV } = require("../services/csvParser.service");
const ActivityLog = require("../models/ActivityLog.model");
const Password = require("../models/Password.model");
const { encryptPassword } =
  require("../services/encryption.service");

const detectCategory =
  require("../utils/categoryDetector");

exports.importCSV = async (req, res) => {
  const rows = await parseCSV(req.file.path);

  let imported = 0;
  let skipped = 0;

  for (const r of rows) {

    const exists = await Password.findOne({
      userId: req.user.id,
      siteName: r.siteName,
      username: r.username,
    });

    if (exists) {
      skipped++;
      continue;
    }

    const { encrypted, iv } =
      encryptPassword(r.password);

    await Password.create({
      userId: req.user.id,
      siteName: r.siteName,
      username: r.username,
      encryptedPassword: encrypted,
      iv,
      category: detectCategory(r.siteName),
    });

     await ActivityLog.create({
        userId: req.user.id,
        action: `Imported password for site ${r.siteName} via CSV`,
        ip: req.ip,
      });

    imported++;
  }

  res.json({
    message: "Import completed",
    imported,
    skippedDuplicates: skipped,
  });
};

exports.extensionImport = async (req, res) => {
  try {
    const passwords = req.body.passwords;

    if (!Array.isArray(passwords)) {
      return res.status(400).json({
        message: "Invalid passwords data",
      });
    }

    let saved = 0;

    for (const p of passwords) {
      const exists = await Password.findOne({
        userId: req.user.id,
        siteName: p.site,
        username: p.username,
      });

      if (exists) continue;

      const { encrypted, iv } =
        encryptPassword(p.password);

      await Password.create({
        userId: req.user.id,
        siteName: p.site,
        username: p.username,
        encryptedPassword: encrypted,
        iv,
        category: detectCategory(p.site),
      });

      await ActivityLog.create({
        userId: req.user.id,
        action: `Imported password for site ${p.site} via Extension`,
        ip: req.ip,
      });

      saved++;
    }

    res.json({
      message: "Extension import success",
      saved,
    });

  } catch (err) {
    console.error(err);
    res.status(500).json({
      message: "Extension import failed",
    });
  }
};

