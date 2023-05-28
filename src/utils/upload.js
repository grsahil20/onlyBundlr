import { getBundlr } from "./get-bundlr";

/**
 * Function to upload metadata to Bundlr. The function signature is defined
 * by Lens. The Lens React hooks automatically generate metadata, which
 * is passed to this function for upload. This function then returns an URL
 * to the uploaded metadata which is automatically posted to Lens.
 *
 * @param {*} data Data to be uploaded, JSON formatted metadata
 * @returns A URL to the recently uploaded metadata.
 */
export const upload = async (data) => {
	data.appId = "onlybundlr";

	const bundlr = await getBundlr();

	try {
		const stringifiedData = JSON.stringify(data);

		const price = await bundlr.getPrice(
			new Blob([stringifiedData]).size
		);
		const balance = await bundlr.getLoadedBalance();

		if(price.isGreaterThanOrEqualTo(balance)) {
			console.log("Funding node...")
			await bundlr.fund(price);
		} else {
			console.log("funding not needed, sufficient balance");
		}

		const tx = await bundlr.upload(stringifiedData, {
			tags: [{ name: "Content-Type", value: "application/json"}]
		});

		const uploadUrl = `https://arweave.net/${tx.id}`
		console.log(`JSON uploaded to ${uploadUrl}`);

		return uploadUrl;
	} catch (error) {
		console.log("Error uploading:", error);
		return "Error uploading";
	}

};
