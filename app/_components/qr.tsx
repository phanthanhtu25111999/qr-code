"use client";

import React, { useEffect, useState } from "react";

import { Check, ChevronsUpDown } from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList } from "@/components/ui/command";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";

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
		id: 6,
		bin: "970436",
		accountNumber: "1053414565",
		accountName: "PHAN THANH TU",
		shortName: "VCB",
	},
	{
		id: 7,
		bin: "971005",
		accountNumber: "9704229200871517594",
		accountName: "PHAN THANH TU",
		shortName: "Viettel Money",
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
		id: 8,
		bin: "970432",
		accountNumber: "01MMTTT0059790857",
		accountName: "MOMO - PHAN THANH TU",
		shortName: "Túi Thần Tài",
	},
	{
		id: 9,
		bin: "970423",
		accountNumber: "30584119073",
		accountName: "BIEN THUY TRUC",
		shortName: "TPBank - THUY TRUC",
	},
	{
		id: 10,
		bin: "963388",
		accountNumber: "9021641958460",
		accountName: "BIEN THUY TRUC",
		shortName: "TIMO - THUY TRUC",
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
	const [banks, setBanks] = useState<any[]>([]);
	const [ip_id, setId] = useState(1);
	const [ip_bankBin, setBankBin] = useState(MY_BANKS[0].bin);
	const [ip_accountNumber, setAccountNumber] = useState(MY_BANKS[0].accountNumber);
	const [ip_accountName, setAccountName] = useState(MY_BANKS[0].accountName);
	const [ip_amount, setAmount] = useState("");
	const [ip_description, setDescription] = useState("");
	const [img, setImg] = useState("");
	const [error, setError] = useState(false);
	const [openListBanks, setOpenListBanks] = useState(false);
	const [openMyBanks, setOpenMyBanks] = useState(false);

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

	const handleBankBin = (value: string) => {
		setBankBin(value);
		setId(0);
		setAccountNumber("");
		setAccountName("");
	};

	const handleBankOptionChange = (id: number) => {
		setId(id);
		if (id !== 0) {
			const bank = MY_BANKS.find((b) => b.id === id);
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

	const currentBank = banks?.find((bank) => bank.bin === ip_bankBin);
	const currentMyBank = MY_BANKS.find((bank) => bank.id === ip_id);

	return (
		<main className="flex p-4 md:p-20 flex-col gap-4 justify-center">
			<Popover open={openMyBanks} onOpenChange={setOpenMyBanks}>
				<PopoverTrigger asChild>
					<Button
						variant="outline"
						role="combobox"
						aria-expanded={openMyBanks}
						className="truncate w-full justify-between">
						{currentMyBank?.shortName} - {currentMyBank?.accountNumber}
						<ChevronsUpDown className="opacity-50" />
					</Button>
				</PopoverTrigger>
				<PopoverContent align="start" className="w-[--radix-popover-trigger-width] p-0">
					<Command>
						<CommandInput placeholder="Search bank..." className="h-9" />
						<CommandList>
							<CommandEmpty>No bank found.</CommandEmpty>
							<CommandGroup>
								{MY_BANKS.map((bank) => (
									<CommandItem
										key={bank.id}
										value={`${bank.accountNumber} ${bank.shortName}`}
										onSelect={() => {
											handleBankOptionChange(bank.id);
											setOpenMyBanks(false);
										}}>
										{bank.shortName} - {bank.accountNumber}
										<Check className={cn("ml-auto", ip_id === bank.id ? "opacity-100" : "opacity-0")} />
									</CommandItem>
								))}
							</CommandGroup>
						</CommandList>
					</Command>
				</PopoverContent>
			</Popover>

			<Popover open={openListBanks} onOpenChange={setOpenListBanks}>
				<PopoverTrigger asChild>
					<Button
						variant="outline"
						role="combobox"
						aria-expanded={openListBanks}
						className="truncate w-full justify-between">
						{ip_bankBin ? `${currentBank?.shortName} - ${currentBank?.name}` : "Select bank..."}
						<ChevronsUpDown className="opacity-50" />
					</Button>
				</PopoverTrigger>
				<PopoverContent align="start" className="w-[--radix-popover-trigger-width] p-0">
					<Command>
						<CommandInput placeholder="Search bank..." className="h-9" />
						<CommandList>
							<CommandEmpty>No bank found.</CommandEmpty>
							<CommandGroup>
								{banks.map((bank) => (
									<CommandItem
										key={bank.bin}
										value={`${bank.name} ${bank.shortName}`}
										onSelect={() => {
											handleBankBin(bank.bin);
											setOpenListBanks(false);
										}}>
										{bank.shortName} - {bank.name}
										<Check className={cn("ml-auto", ip_bankBin === bank.bin ? "opacity-100" : "opacity-0")} />
									</CommandItem>
								))}
							</CommandGroup>
						</CommandList>
					</Command>
				</PopoverContent>
			</Popover>
			<Input
				autoFocus
				className={error ? "border-red-500" : ""}
				type="text"
				placeholder="STK"
				value={ip_accountNumber}
				onChange={handleAccountNumberChange}
			/>
			<Input type="number" placeholder="Số tiền" value={ip_amount} onChange={handleAmountChange} />
			<Input type="text" placeholder="Lời nhắn" value={ip_description} onChange={handleDescriptionChange} />

			<Button onClick={onGenerate}>Tạo mã</Button>
			{img && (
				<div className="flex justify-center">
					<Image src={img} width={500} height={500} alt="QR CODE" />
				</div>
			)}
		</main>
	);
};

export default QR;
