import fileReaderStream from "filereader-stream";
import { getBundlr } from "./get-bundlr";

/**
 * Uploads an image to Bundlr.
 *
 *
 * @param {*} fileToUpload The file to be uploaded.
 * @param {*} fileType The mime-type of the file to be uploaded.
 * @returns
 */
export const uploadImage = async (fileToUpload, fileType) => {
	const bundlr = await getBundlr();

	try {
		const dataStream = fileReaderStream(fileToUpload);
		const price = await bundlr.getPrice(dataStream.size);
		const balance = await bundlr.getLoadedBalance();

		if(price.isGreaterThanOrEqualTo(balance)) {
			console.log("Funding node...")
			await bundlr.fund(price);
		} else {
			console.log("funding not needed, sufficient balance");
		}

		const tx = await bundlr.upload(dataStream, {
			tags: [{ name: "Content-Type", value: fileType}]
		});

		const uploadUrl = `https://arweave.net/${tx.id}`
		console.log(`File uploaded to ${uploadUrl}`);
		return uploadUrl;
	} catch (error) {
		console.log("Error upload image:", error);
		return "Error uploading image";
	}

};
