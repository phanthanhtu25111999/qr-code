"use client";

import React, { useEffect, useState } from "react";
import { getBanks } from "./api";
import Image from "next/image";

const QR = () => {
	const [banks, setBanks] = useState([]);
	const [ip_bankName, setBankName] = useState("");
	const [ip_accountNumber, setAccountNumber] = useState("");
	const [ip_amount, setAmount] = useState("");
	const [ip_description, setDescription] = useState("");
	const [img, setImg] = useState("");
	const [error, setError] = useState(false);

	useEffect(() => {
		getBanks().then((data) => {
			if (data.code === "00") {
				setBanks(data.data);
				setBankName(data.data[0].bin);
			}
		});
	}, []);

	const onGenerate = () => {
		if (!ip_accountNumber) {
			setError(true);
		} else {
			const amount = ip_amount ? `amount=${ip_amount}` : "";
			const description = ip_description ? `addInfo=${ip_description}` : "";
			setImg(`https://img.vietqr.io/image/${ip_bankName}-${ip_accountNumber}-print.jpg?${amount}&${description}`);
		}
	};

	const onDefault = () => {
		setBankName("970422");
		setAccountNumber("0333829762");
	};

	const handleBankNameChange = (e: any) => {
		setBankName(e.target.value);
	};

	const handleAccountNumberChange = (e: any) => {
		if (error) {
			setError(false);
		}
		setAccountNumber(e.target.value);
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
				<select onChange={handleBankNameChange} className="appearance-none" value={ip_bankName}>
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
			<button className="default" onClick={onDefault}>
				MB - 0333829762
			</button>
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
