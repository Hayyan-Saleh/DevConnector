import express from "express";
import jwtMiddleware from "../../middleware/auth.js";
import Profile from "../../models/Profile.js";
import User from "../../models/User.js";
import { check, validationResult } from "express-validator";
import config from "config";
import request from "request";

const router = express.Router();

// @route    GET api/profile/me
// @desc     Get current users profile
// @access   Private

router.get("/me", jwtMiddleware, async (req, res) => {
  try {
    const profile = await Profile.findOne({ user: req.user.id }).populate(
      "user",
      ["name", "avatar"],
    );
    if (!profile) {
      return res.status(400).json({ msg: "There is no profile for this user" });
    }
    return res.json(profile);
  } catch (err) {
    console.error(err.message);
    return res
      .status(500)
      .json({ error: "Server Error", details: err.message });
  }
});

// @route    POST api/profile
// @desc     Create or update a user profile
// @access   Private

router.post("/", [
  [
    jwtMiddleware,
    [
      check("status", "Status is required").not().isEmpty(),
      check("skills", "Skills is required").not().isEmpty(),
    ],
  ],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const {
      company,
      website,
      location,
      bio,
      status,
      githubusername,
      skills,
      youtube,
      x,
      instagram,
      facebook,
      linkedin,
    } = req.body;

    const profileFields = {};
    profileFields.user = req.user.id;

    if (company) profileFields.company = company;
    if (website) profileFields.website = website;
    if (location) profileFields.location = location;
    if (bio) profileFields.bio = bio;
    if (status) profileFields.status = status;
    if (githubusername) profileFields.githubusername = githubusername;
    if (skills) {
      profileFields.skills = skills.split(",").map((skill) => skill.trim());
    }

    profileFields.social = {};

    if (youtube) profileFields.social.youtube = youtube;
    if (x) profileFields.social.x = x;
    if (facebook) profileFields.social.facebook = facebook;
    if (instagram) profileFields.social.instagram = instagram;
    if (linkedin) profileFields.social.linkedin = linkedin;

    try {
      let profile = await Profile.findOne({ user: req.user.id });
      //   Update
      if (profile) {
        await Profile.findOneAndUpdate(
          { user: req.user.id },
          { $set: profileFields },
          { returnDocument: "after" },
        );

        return res.json(profile);
      }

      //   Create
      profile = new Profile(profileFields);
      await profile.save();
      return res.json(profile);
    } catch (err) {
      console.error(err.message);
      return res
        .status(500)
        .json({ error: "Server Error", details: err.message });
    }
  },
]);

// @route    GET api/profile
// @desc     Get all profiles
// @access   Public

router.get("/", async (req, res) => {
  try {
    const profiles = await Profile.find().populate("user", ["name", "avatar"]);
    return res.json(profiles);
  } catch (err) {
    console.error(err.message);
    return res
      .status(500)
      .json({ error: "Server Error", details: err.message });
  }
});

// @route    GET api/profile/user/:user_id
// @desc     Get a profile by id
// @access   Public

router.get("/user/:user_id", async (req, res) => {
  try {
    const profile = await Profile.findOne({
      user: req.params.user_id,
    }).populate("user", ["name", "avatar"]);
    if (!profile) {
      return res.status(400).json({ msg: "Profile not found" });
    }

    return res.json(profile);
  } catch (err) {
    console.error(err.message);
    if (err.kind == "ObjectId") {
      return res.status(400).json({ msg: "Profile not found" });
    }
    return res
      .status(500)
      .json({ error: "Server Error", details: err.message });
  }
});

// @route    DELETE api/profile
// @desc     Delete profile, user & posts
// @access   Private

router.delete("/", jwtMiddleware, async (req, res) => {
  try {
    // TODO: Remove users posts
    // Remove Profile
    await Profile.deleteOne({ user: req.user.id });
    // Remove User
    await User.deleteOne({ _id: req.user.id });
    return res.json({ msg: "Profile is deleted" });
  } catch (err) {
    console.error(err.message);
    return res
      .status(500)
      .json({ error: "Server Error", details: err.message });
  }
});

// @route    PUT api/profile/experience
// @desc     Add profile experience
// @access   Private

router.put(
  "/experience",
  [
    jwtMiddleware,
    [
      check("title", "Title is required").not().isEmpty(),
      check("company", "Company is required").not().isEmpty(),
      check("from", "From date is required").not().isEmpty(),
    ],
  ],
  async (req, res) => {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
      }
      const { title, company, location, from, to, current, description } =
        req.body;
      const newExp = {
        title,
        company,
        location,
        from,
        to,
        current,
        description,
      };

      const profile = await Profile.findOne({ user: req.user.id });

      profile.experience.unshift(newExp);
      await profile.save();
      return res.json(profile);
    } catch (err) {
      console.error(err.message);
      return res
        .status(500)
        .json({ error: "Server Error", details: err.message });
    }
  },
);

// @route    DELETE api/profile/experience/:exp_id
// @desc     Delete experience from profile
// @access   Private

router.delete("/experience/:exp_id", jwtMiddleware, async (req, res) => {
  try {
    const profile = await Profile.findOne({ user: req.user.id });

    const removeIndex = profile.experience
      .map((exp) => exp.id)
      .indexOf(req.params.exp_id);

    profile.experience.splice(removeIndex, 1);

    await profile.save();
    return res.json(profile);
  } catch (err) {
    console.error(err.message);
    return res
      .status(500)
      .json({ error: "Server Error", details: err.message });
  }
});

// @route    PUT api/profile/education
// @desc     Add profile education
// @access   Private

router.put(
  "/education",
  [
    jwtMiddleware,
    [
      check("school", "School is required").not().isEmpty(),
      check("degree", "Degree is required").not().isEmpty(),
      check("fieldofstudy", "Field of study is required").not().isEmpty(),
      check("from", "From date is required").not().isEmpty(),
    ],
  ],
  async (req, res) => {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
      }
      const { school, degree, fieldofstudy, from, to, current, description } =
        req.body;
      const newEdu = {
        school,
        degree,
        fieldofstudy,
        from,
        to,
        current,
        description,
      };

      const profile = await Profile.findOne({ user: req.user.id });

      profile.education.unshift(newEdu);
      await profile.save();
      return res.json(profile);
    } catch (err) {
      console.error(err.message);
      return res
        .status(500)
        .json({ error: "Server Error", details: err.message });
    }
  },
);

// @route    DELETE api/profile/education/:edu_id
// @desc     Delete education from profile
// @access   Private

router.delete("/education/:edu_id", jwtMiddleware, async (req, res) => {
  try {
    const profile = await Profile.findOne({ user: req.user.id });

    const removeIndex = profile.education
      .map((edu) => edu.id)
      .indexOf(req.params.edu_id);

    profile.education.splice(removeIndex, 1);

    await profile.save();
    return res.json(profile);
  } catch (err) {
    console.error(err.message);
    return res
      .status(500)
      .json({ error: "Server Error", details: err.message });
  }
});

// @route    GET api/profile/github/:username
// @desc     Get user repos from Github
// @access   Public

router.get("/github/:username", async (req, res) => {
  try {
    const options = {
      uri: `https://api.github.com/users/${req.params.username}/repos?per_page=5&sort=create:asc&client_id=${config.get("githubClientId")}&client_secret=${config.get("githubSecret")}`,
      method: "GET",
      headers: { "user-agent": "node.js " },
    };

    request(options, (error, response, body) => {
      if (error) console.error(error);
      if (response.statusCode !== 200) {
        return res.status(404).json({ msg: "No github profile found" });
      }

      return res.json(JSON.parse(body));
    });
  } catch (err) {
    console.error(err.message);
    return res
      .status(500)
      .json({ error: "Server Error", details: err.message });
  }
});

export default router;
