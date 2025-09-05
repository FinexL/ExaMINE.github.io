exports.deleteUser = (req, res) => {
  if (req.user.id == req.params.userId || req.user.role === "Admin") {
    res.json("User has been deleted");
  } else {
    res.status(403).json("Not allowed to delete this user");
  }
};
