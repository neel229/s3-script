import previews from "../previews.json";
import { getObject } from "./s3";

const uploadPreviewFiles = async () => {
	for (const p of previews) {
		const key = p.url.split("/")[3];
		const ext = key.split(".")[1];
		const value = p.voice.value;
		// const uploadKey = `${value}`;
		const fileName = `files/${value}.${ext}`;

		await getObject(key, fileName);
	}
};

uploadPreviewFiles();
