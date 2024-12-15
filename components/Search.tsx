"use client";

import Image from "next/image";
import React, { useEffect, useState } from "react";
import { Input } from "./ui/input";
import { set } from "zod";
import { useSearchParams } from "next/navigation";
import { getFiles } from "@/lib/actions/file.actions";
import { Models } from "node-appwrite";

const Search = () => {
	const [query, setQuery] = useState("");
	const searchParams = useSearchParams();
	const searchQuery = searchParams.get("query") || "";
	const [results, setResults] = useState<Models.Document[]>([]);
	const [open, setOpen] = useState(false);

	useEffect(() => {
		const fetchFiles = async () => {
			const files = await getFiles({ searchText: query });
			setResults(files.documents);
			setOpen(true);
		};

		fetchFiles();
	}, []);

	useEffect(() => {
		if (!searchParams) {
			setQuery("");
		}
	}, [searchQuery]);
	return (
		<div className="search">
			<div className="search-input-wrapper">
				<Image
					src={"/assets/icons/search.svg"}
					alt="Search"
					width={24}
					height={24}
				/>
				<Input
					value={query}
					placeholder="Search..."
					className="search-input"
					onChange={(e) => setQuery(e.target.value)}
				/>
			</div>
		</div>
	);
};

export default Search;
