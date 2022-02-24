const router = require("express").Router();
const File = require("../models/File");

router.get("/:uuid", async (req, res) => {
  try {
    const file = await File.findOne({ uuid: req.params.uuid });

    if (!file) {
      res.render("download", {
        error: "Link has been expired!",
      });
    }

    const filePath = `${__dirname}/../${file.path}`;
    res.download(filePath);
  } catch (error) {
    res.render("download", {
      error: "Link has been expired!",
    });
  }
});

module.exports = router;
