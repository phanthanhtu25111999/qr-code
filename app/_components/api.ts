const API_BANKS = "https://api.vietqr.io/v2/banks";
const API_QR = "https://api.vietqr.io/v2/generate";

export const getBanks = async () => {
	const res = await fetch(API_BANKS);
	if (!res.ok) {
		throw new Error("Failed to fetch data");
	}
	return res.json();
};
