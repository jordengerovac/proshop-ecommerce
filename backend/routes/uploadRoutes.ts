import path from "path";
import express, { Request, Response } from "express";
import multer from "multer";

const router = express.Router();

const storage = multer.diskStorage({
	destination(req: Request, file: any, cb: any) {
		cb(null, "frontend/public/uploads/");
	},
	filename(req: Request, file: any, cb: any) {
		cb(null, `${file.fieldname}-${Date.now()}${path.extname(file.originalname)}`);
	},
});

function fileFilter(eq: Request, file: any, cb: any) {
	const filetypes = /jpe?g|png|webp/;
	const mimetypes = /image\/jpe?g|image\/png|image\/webp/;

	const extname = filetypes.test(path.extname(file.originalname).toLowerCase());
	const mimetype = mimetypes.test(file.mimetype);

	if (extname && mimetype) {
		cb(null, true);
	} else {
		cb(new Error("Images only!"), false);
	}
}

const upload = multer({ storage, fileFilter });
const uploadSingleImage = upload.single("image");

router.post("/", (req: Request, res: Response) => {
	uploadSingleImage(req, res, function (err: any) {
		if (err) {
			return res.status(400).send({ message: err.message });
		}

		res.status(200).send({
			message: "Image uploaded successfully",
			image: `/${(req as any).file.path}`,
		});
	});
});

export default router;
