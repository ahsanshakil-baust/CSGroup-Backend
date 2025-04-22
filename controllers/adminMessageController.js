const MessageModel = require("../models/messageModel");
const TeamMemberModel = require("../models/teamMemberModel");

const addMessage = (req, res, next) => {
  const { member_id, message, url } = req.body;
  if (member_id == "" || message == "") {
    res.status(500).json({
      error: "Need to fill all necessary fields.",
    });
  } else {
    const messageObj = new MessageModel(member_id, message, url);
    messageObj.save();

    res.status(201).json({
      msg: "Message added successfully!",
    });
  }
};

const updateMessage = (req, res, next) => {
  const { id, member_id, message, url } = req.body;

  if (!id) {
    res.status(500).json({
      error: "Need to fill all necessary fields.",
    });
  } else {
    const messageObj = new MessageModel(member_id, message, url);
    messageObj.id = id;
    messageObj.save();
    res.status(201).json({
      msg: "Message updated successfully!",
    });
  }
};

const getAllMessage = async (req, res, next) => {
  // MessageModel.getAllMessage((data) => {
  //     const newDate = data.filter((el) => el.status != 0);

  //     res.status(200).json({
  //         data: newDate,
  //     });
  // });

  const message = await new Promise((resolve, reject) => {
    MessageModel.getAllMessage((message) => {
      if (!message) return reject(new Error("No message found"));
      resolve(message);
    });
  });

  const filteredMessage = message.filter((el) => el.status !== 0);

  const memberDetailsPromises = filteredMessage.map(async (el) => {
    const [member] = await Promise.all([
      TeamMemberModel.teamMemberById(parseInt(el?.member_id)),
    ]);

    return {
      ...el,
      ...member,
    };
  });

  const updateData = await Promise.all(memberDetailsPromises);
  res.status(200).json({ data: updateData });
};

const getMessage = (req, res, next) => {
  const { id } = req.params;
  const convertedId = Number(id);

  if (!id) {
    res.status(500).json({
      error: "Need To Pass Id.",
    });
  } else {
    MessageModel.messageFindById(convertedId, (data) => {
      res.status(200).json({ data });
    });
  }
};

const deleteMessage = (req, res, next) => {
  const { id } = req.body;
  if (!id) {
    res.status(500).json({
      error: "Need To Pass Id.",
    });
  } else {
    const message = new MessageModel();
    message.id = id;
    message.status = 0;
    message.save();
    res.status(201).json({
      msg: "Message deleted successfully!",
    });
  }
};

module.exports = {
  addMessage,
  updateMessage,
  deleteMessage,
  getAllMessage,
  getMessage,
};
