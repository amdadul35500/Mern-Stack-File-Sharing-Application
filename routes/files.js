const router = require("express").Router();
const multer = require("multer");
const path = require("path");
const { send } = require("process");
const { v4: uuid4 } = require("uuid");
const File = require("../models/File");
const sendMail = require("../services/emailService");
const emailTemplate = require("../services/emailTemplate");

const storage = multer.diskStorage({
  destination: (req, file, cd) => cd(null, "uploads/"),
  filename: (req, file, cd) => {
    const uniqName = `${Date.now()}-${Math.round(
      Math.random() * 1e9
    )}${path.extname(file.originalname)}`;

    cd(null, uniqName);
  },
});

const upload = multer({
  storage,
  limit: { fileSize: 1000000 * 100 },
}).single("myfile");

router.post("/", (req, res) => {
  // store file
  upload(req, res, async (err) => {
    // validate requst
    if (!req.file) {
      return res.status(404).json({ error: "All fild are require!" });
    }

    if (err) {
      return res.status(500).json({ error: err.message });
    }

    // store into database
    const file = new File({
      filename: req.file.filename,
      uuid: uuid4(),
      path: req.file.path,
      size: req.file.size,
    });

    try {
      const response = await file.save();
      return res
        .status(200)
        .json({ file: `${process.env.APP_BASE_URL}files/${response.uuid}` });
      //http://localhost:3000/files/23hb34bh-sf4h4bm234
    } catch (error) {
      res.status(500).json({ error: "File not save" });
    }
  });
});

router.post("/send", async (req, res) => {
  const { uuid, emailTo, emailFrom } = req.body;

  // valid request
  if (!uuid || !emailTo || !emailFrom) {
    res.status(422).send({ error: "All field are required !" });
  }

  // get data from database
  try {
    const file = await File.findOne({ uuid: uuid });

    if (file.sender) {
      res.status(422).send({ error: "Email alredy sent !" });
    }

    file.sender = emailFrom;
    file.receiver = emailTo;
    const response = await file.save();

    // send mail
    sendMail({
      from: emailFrom,
      to: emailTo,
      subject: "InShare file sharing",
      text: `$${emailFrom} shared a file with you!`,
      html: emailTemplate({
        emailFrom,
        downloadLink: `${process.env.APP_BASE_URL}/files/${file.uuid}`,
        size: parseInt(file.size / 1000) + "KB",
        expires: "24 hours",
      }),
    });

    res.status(200).send({ succuss: "Email Send!" });
  } catch (error) {
    res.status(500).send({ error: "Internal server error !" });
  }
});

module.exports = router;
