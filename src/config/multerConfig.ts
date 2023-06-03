import * as multer from "multer";

type UploadDirsUrl = {
  post: string;
  profile: string;
}

let parentDirUrl = "assets"

const uploadDirsUrl: UploadDirsUrl = {
  "post": `${parentDirUrl}/posts`,
  "profile": `${parentDirUrl}/profiles`,
}

const storage = multer.diskStorage({
  destination: function (req, file, cb) {

    const multerErrorCode: multer.ErrorCode = 'LIMIT_UNEXPECTED_FILE'
    const multerError = new multer.MulterError(multerErrorCode);
    console.log(req.body)
    if (!req.body.pictureCategory) {
      multerError.message = "Picture category is required"
      return cb(multerError, "");
    }

    let pictureCategory: keyof UploadDirsUrl = req.body?.pictureCategory as keyof UploadDirsUrl

    let uploadDir = uploadDirsUrl[pictureCategory] || ""

    if (uploadDir === "") {
      multerError.message = "Picture category is not valid"
      return cb(multerError, "");
    }

    cb(null, uploadDir);
  },
  filename: function (req, file, cb) {
    const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
    const fileExtension = file.originalname.split(".").pop();
    const fileName = uniqueSuffix + "." + fileExtension;
    cb(null, fileName);
  },
});

export const upload = multer({storage});
