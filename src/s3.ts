import {
	S3Client,
	CreateBucketCommand,
	GetObjectCommand,
	PutObjectCommand,
} from "@aws-sdk/client-s3";
import fs from "fs";

const REGION = "us-east-1";

// create s3 client
export const s3Client = new S3Client({
	region: REGION,
});

export const createBucket = async () => {
	try {
		const response = await s3Client.send(
			new CreateBucketCommand({
				Bucket: "tts-voice-preview",
			})
		);
		console.log("Success: ", response);
	} catch (err) {
		console.error("Error: ", err);
	}
};

// fetches s3 file
export const getObject = async (key: string, fileName: string) => {
	let writeAbleStream = fs.createWriteStream(fileName);
	const bucketParams = {
		Bucket: "listnraudio-dev",
		Key: key,
	};
	try {
		const response: any = await s3Client.send(
			new GetObjectCommand(bucketParams)
		);
		response.Body.pipe(writeAbleStream);
		writeAbleStream.on("finish", () =>
			console.log(`done fetching file ${fileName}`)
		);
	} catch (err) {
		console.log("Error", err);
	}
};

// upload files to s3
export const uploadObject = async (key: string, filename: string) => {
	// read file and upload to s3
	fs.readFile(filename, async (err, data) => {
		if (err) throw new Error(`error reading file: ${filename}`);
		const uploadParams = {
			Bucket: "tts-voice-preview",
			Key: key,
			Body: data,
		};

		try {
			// upload file
			const response = await s3Client.send(new PutObjectCommand(uploadParams));
			console.log(`Successfully uploaded ${key}: `, response.$metadata);
		} catch (err) {
			console.error("Error for file: ", filename, err);
		}
	});
};
