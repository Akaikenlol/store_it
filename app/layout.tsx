import type { Metadata } from "next";
import "./globals.css";
import { Poppins } from "next/font/google";

const poppins = {
	subsets: ["latin"],
	weights: ["100", "200", "300", "400", "500", "600", "700", "800", "900"],
	variable: "--font-poppins",
};

export const metadata: Metadata = {
	title: "StoreIt",
	description: "StoreIt - The only storage solution you need.",
};

export default function RootLayout({
	children,
}: Readonly<{
	children: React.ReactNode;
}>) {
	return (
		<html lang="en">
			<body className={`${poppins.variable} font-poppins antialiased`}>
				{children}
			</body>
		</html>
	);
}
