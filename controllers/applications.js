const express = require("express");
const router = express.Router();

const User = require("../models/user.js");

router.get("/", async (req, res) => {
  try {
    const currentUser = await User.findById(req.session.user._id);

    res.render("applications/index.ejs", {
      applications: currentUser.applications,
    });
  } catch (error) {
    console.log(error);
    res.redirect("/");
  }
});

router.get("/new", (req, res) => {
  res.render("applications/new.ejs");
});

router.get("/:applicationId", async (req, res) => {
  try {
    const currentUser = await User.findById(req.session.user._id);
    const applicationData = currentUser.applications.id(
      req.params.applicationId
    );

    res.render("applications/show.ejs", {
      application: applicationData,
    });
  } catch (error) {
    console.log(error);
    res.redirect("/");
  }
});

router.post("/", async (req, res) => {
  try {
    const currentUser = await User.findById(req.session.user._id);
    currentUser.applications.push(req.body);

    await currentUser.save();

    res.redirect("/applications");
  } catch (error) {
    console.log(error);
    res.redirect("/");
  }
});

router.delete("/:applicationId", async (req, res) => {
  try {
    const currentUser = await User.findById(req.session.user._id);
    currentUser.applications.id(req.params.applicationId).deleteOne();

    await currentUser.save();

    res.redirect("/applications");
  } catch (error) {
    console.log(error);
    res.redirect("/");
  }
});

router.get("/:applicationId/edit", async (req, res) => {
  try {
    const currentUser = await User.findById(req.session.user._id);
    const application = currentUser.applications.id(req.params.applicationId);
    res.render("applications/edit.ejs", {
      application: application,
    });
  } catch (error) {
    console.log(error);
    res.redirect("/");
  }
});

router.put("/:applicationId", async (req, res) => {
  const currentUser = await User.findById(req.session.user._id);
  const application = currentUser.applications.id(req.params.applicationId);

  application.set(req.body);

  await currentUser.save();

  res.redirect(`/applications/${req.params.applicationId}`);
});

module.exports = router;
