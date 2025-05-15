const ShareFlatModel = require("../models/shareFlatDetails");
const ShareLandDetailsModel = require("../models/shareLandDetails");
const ShareModel = require("../models/shareModel");

const getAllShares = async (req, res, next) => {
  ShareModel.getAllShares(async (data) => {
    const newData = data.filter((el) => el.status != 0);

    // Fetch land details and project details in parallel
    const flatDetailsPromises = newData.map(async (el) => {
      const [landDetails] = await Promise.all([
        ShareLandDetailsModel.landFindById(el.id),
      ]);

      return {
        ...el,
        land_details: landDetails || {},
      };
    });

    // Wait for all promises to resolve
    const updatedFlats = await Promise.all(flatDetailsPromises);

    res.status(200).json({ data: updatedFlats });
  });
};

const getShare = async (req, res, next) => {
  try {
    const id = req.params.id;

    if (!id) {
      return res.status(400).json({ error: "Need To Pass Id." });
    }

    // Fetch all independent data in parallel
    const [share, landDetails, flatDetails] = await Promise.all([
      ShareModel.shareFindById(id),
      ShareLandDetailsModel.landFindById(id),
      ShareFlatModel.shareFlatFindById(id),
    ]);

    if (!share) {
      return res.status(404).json({ error: "Share not found." });
    }

    let newData = { ...share, land_details: landDetails, flatDetails };

    return res.status(200).json({ data: newData });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: "Internal Server Error." });
  }
};

const addShare = (req, res, next) => {
  const {
    name,
    // project_type,
    location,
    description,
    share_videos,
    project_images,
    map_url,
    project_structure,
    city,
    available,
  } = req.body;
  if (name == "") {
    res.status(500).json({
      error: "Need to fill all necessary fields.",
    });
  } else {
    const share = new ShareModel(
      name,
      // project_type,
      location,
      description,
      share_videos,
      project_images,
      map_url,
      project_structure,
      city,
      available
    );
    share.save((id) =>
      res.status(201).json({
        id,
      })
    );
  }
};

const updateShare = (req, res, next) => {
  const {
    id,
    name,
    // project_type,
    location,
    description,
    share_videos,
    project_images,
    map_url,
    project_structure,
    city,
    available,
  } = req.body;

  if (!id) {
    res.status(500).json({
      error: "Need to fill all necessary fields.",
    });
  } else {
    const share = new ShareModel(
      name,
      // project_type,
      location,
      description,
      share_videos,
      project_images,
      map_url,
      project_structure,
      city,
      available
    );
    share.id = id;
    share.save((id) =>
      res.status(201).json({
        id,
      })
    );
  }
};

const deleteShare = async (req, res, next) => {
  const { id } = req.body;
  if (!id) {
    res.status(500).json({
      error: "Need To Pass Id.",
    });
  } else {
    // const share = new ShareModel();
    // share.id = id;
    // share.status = 0;
    await ShareModel.deleteById(id);
    await ShareLandDetailsModel.deleteByShareId(id);
    await ShareFlatModel.deleteByShareId(id);

    res.status(201).json({
      msg: "Share deleted successfully!",
    });
  }
};

module.exports = {
  getAllShares,
  getShare,
  addShare,
  updateShare,
  deleteShare,
};
