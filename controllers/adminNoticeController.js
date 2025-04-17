const NoticeModel = require("../models/noticeModel");

const addNotice = (req, res, next) => {
  const { title, url, date, type, text, signatory } = req.body;
  if (title == "" || url == "" || date == "") {
    res.status(500).json({
      error: "Need to fill all necessary fields.",
    });
  } else {
    const notice = new NoticeModel(title, url, date, type, text, signatory);
    notice.save();

    res.status(201).json({
      msg: "Notice added successfully!",
    });
  }
};

const updateNotice = (req, res, next) => {
  const { id, title, url, date, type, text, signatory } = req.body;

  if (!id || !url || !title || !date) {
    res.status(500).json({
      error: "Need to fill all necessary fields.",
    });
  } else {
    const notice = new NoticeModel(title, url, date, type, text, signatory);
    notice.id = id;
    notice.save();
    res.status(201).json({
      msg: "Notice updated successfully!",
    });
  }
};

const getAllNotice = (req, res, next) => {
  NoticeModel.getAllNotice((data) => {
    const newDate = data.filter((el) => el.status != 0);

    res.status(200).json({
      data: newDate,
    });
  });
};

const getNotice = (req, res, next) => {
  const { id } = req.params;
  const convertedId = Number(id);

  if (!id) {
    res.status(500).json({
      error: "Need To Pass Id.",
    });
  } else {
    NoticeModel.noticeFindById(convertedId, (data) => {
      res.status(200).json({ data });
    });
  }
};

const deleteNotice = (req, res, next) => {
  const { id } = req.body;
  if (!id) {
    res.status(500).json({
      error: "Need To Pass Id.",
    });
  } else {
    const notice = new NoticeModel();
    notice.id = id;
    notice.status = 0;
    notice.save();
    res.status(201).json({
      msg: "Notice deleted successfully!",
    });
  }
};

module.exports = {
  addNotice,
  updateNotice,
  deleteNotice,
  getAllNotice,
  getNotice,
};
