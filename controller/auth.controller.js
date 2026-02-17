const tryCatch = require("../config/tryCatch");
const { authService } = require("../services");

const createUser = async (req, res) => {
  const { userName, password, email } = req.body;
  const profileImage = req.file;

  const { response, status } = await tryCatch(
    async () =>
      await authService.createUser({
        userName,
        password,
        email,
        profileImage,
      })
  );
  res.status(status).json(response);
};

const getUser = async (req, res) => {
  const { userId } = req.user;

  const { status, response } = await tryCatch(
    async () => await authService.getUser(userId)
  );

  res.status(status).json(response);
};

const loginUser = async (req, res) => {
  const { email, password } = req.body;

  const { status, response } = await tryCatch(
    async () => await authService.loginUser({ email, password })
  );
  console.log("🚀 ~ loginUser ~ response:", response)

  res.status(status).json(response);
};

const editUser = async (req, res) => {
  const {
    email,
    currentPass,
    newPass,
    userName,
    profileImage: imageURL,
  } = req.body;
  const { userId } = req.user;
  const profileImage = req.file;

  const { response, status } = await tryCatch(
    async () =>
      await authService.editUser({
        email,
        currentPass,
        newPass,
        userName,
        userId,
        profileImage,
        imageURL,
      })
  );
  res.status(status).json(response);
};

const refreshToken = async (req, res) => {
  const { refreshToken } = req.body;

  const { response, status } = await tryCatch(
    async () => await authService.refreshToken(refreshToken)
  );
  res.status(status).json(response);
};

const deleteUser = async (req, res) => {
  const { userId } = req.user;
  const { password } = req.body;

  const { response, status } = await tryCatch(
    async () =>
      await authService.deleteUser({
        userId,
        password,
      })
  );

  res.status(status).json(response);
};

module.exports = {
  createUser,
  getUser,
  loginUser,
  editUser,
  refreshToken,
  deleteUser,
};
