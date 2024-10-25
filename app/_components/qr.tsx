"use client";

import React, { useEffect, useState } from "react";
import { getBanks } from "./api";
import Image from "next/image";

const MY_BANKS = [
	{
		id: 1,
		bin: "970422",
		accountNumber: "0333829762",
		accountName: "PHAN THANH TU",
		shortName: "MBBank",
	},
	{
		id: 2,
		bin: "970403",
		accountNumber: "060286834895",
		accountName: "PHAN THANH TU",
		shortName: "Sacombank",
	},
	{
		id: 3,
		bin: "970407",
		accountNumber: "19072590042015",
		accountName: "PHAN THANH TU",
		shortName: "Techcombank",
	},
	{
		id: 4,
		bin: "970423",
		accountNumber: "00006480830",
		accountName: "PHAN THANH TU",
		shortName: "TPBank",
	},
	{
		id: 5,
		bin: "970436",
		accountNumber: "9973982516",
		accountName: "NGO THANH THI",
		shortName: "VCB - MUA BÁN PREMIUM",
	},
	{
		id: 0,
		shortName: "None",
		accountNumber: "Tùy chỉnh",
	},
];

const QR = () => {
	const [banks, setBanks] = useState([]);
	const [ip_id, setId] = useState(1);
	const [ip_bankBin, setBankBin] = useState(MY_BANKS[0].bin);
	const [ip_accountNumber, setAccountNumber] = useState(MY_BANKS[0].accountNumber);
	const [ip_accountName, setAccountName] = useState(MY_BANKS[0].accountName);
	const [ip_amount, setAmount] = useState("");
	const [ip_description, setDescription] = useState("");
	const [img, setImg] = useState("");
	const [error, setError] = useState(false);

	useEffect(() => {
		getBanks().then((data) => {
			if (data.code === "00") {
				setBanks(data.data);
			}
		});
	}, []);

	const onGenerate = () => {
		if (!ip_accountNumber) {
			setError(true);
		} else {
			const amount = ip_amount ? `amount=${ip_amount}` : "";
			const description = ip_description ? `addInfo=${ip_description}` : "";
			const name = ip_accountName ? `accountName=${ip_accountName}` : "";
			setImg(
				`https://img.vietqr.io/image/${ip_bankBin}-${ip_accountNumber}-print.jpg?${amount}&${description}&${name}`
			);
		}
	};

	const handleBankBinChange = (e: any) => {
		setBankBin(e.target.value);
		setId(0);
		setAccountNumber("");
		setAccountName("");
	};

	const handleBankOptionChange = (e: any) => {
		setId(+e.target.value);
		if (+e.target.value !== 0) {
			const bank = MY_BANKS.find((b) => b.id === +e.target.value);
			setBankBin(bank?.bin || "");
			setAccountName(bank?.accountName || "");
			setAccountNumber(bank?.accountNumber || "");
		} else {
			setAccountName("");
			setAccountNumber("");
		}
	};

	const handleAccountNumberChange = (e: any) => {
		if (error) {
			setError(false);
		}
		setId(0);
		setAccountNumber(e.target.value);
		setAccountName("");
	};

	const handleAmountChange = (e: any) => {
		setAmount(e.target.value);
	};

	const handleDescriptionChange = (e: any) => {
		setDescription(e.target.value);
	};

	return (
		<main className="flex flex-col gap-4 justify-center">
			<div className="custom-select">
				<select onChange={handleBankOptionChange} className="appearance-none" value={ip_id}>
					{MY_BANKS.map((bank) => (
						<option key={bank.id} value={bank.id}>
							{bank.shortName} - {bank.accountNumber}
						</option>
					))}
				</select>
			</div>
			<div className="custom-select">
				<select onChange={handleBankBinChange} className="appearance-none" value={ip_bankBin}>
					{banks?.map((bank: any) => (
						<option key={bank.bin} value={bank.bin}>
							{bank.shortName} - {bank.name}
						</option>
					))}
				</select>
			</div>
			<input
				autoFocus
				className={error ? "error" : ""}
				type="text"
				placeholder="STK"
				value={ip_accountNumber}
				onChange={handleAccountNumberChange}
			/>
			<input type="number" placeholder="Số tiền" value={ip_amount} onChange={handleAmountChange} />
			<input type="text" placeholder="Lời nhắn" value={ip_description} onChange={handleDescriptionChange} />
			<button onClick={onGenerate}>Tạo mã</button>
			{img && (
				<div className="flex justify-center">
					<Image src={img} width={500} height={500} alt="QR CODE" />
				</div>
			)}
		</main>
	);
};

export default QR;
