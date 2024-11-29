"use server";

import { ID, Query } from "node-appwrite";
import { createAdminClient } from "../appwrite";
import { appwriteConfig } from "../appwrite/config";
import { parseStringify } from "../utils";
import { cookies } from "next/headers";

// Create account flow
// 1. User enters full name and email
// 2. Check if the user already exists using the email
// 3. Send OTP to user's email
// 4. Crate a new user document if the user is a new user
// 5. Return the user's accountId that will be used to complete the login
// 6. Verify OTP and authenticate to login

const getUserByEmail = async (email: string) => {
	const { databases } = await createAdminClient();

	const result = await databases.listDocuments(
		appwriteConfig.databaseId,
		appwriteConfig.usersCollectionId,
		[Query.equal("email", [email])]
	);

	return result.total > 0 ? result.documents[0] : null;
};

const handleError = (error: unknown, message: string) => {
	console.log(error, message);
	throw error;
};

export const sendEmailOTP = async ({ email }: { email: string }) => {
	const { account } = await createAdminClient();

	try {
		const session = await account.createEmailToken(ID.unique(), email);

		return session.userId;
	} catch (error) {
		handleError(error, "Failed to send email OTP");
	}
};

export const createAccount = async ({
	fullName,
	email,
}: {
	fullName: string;
	email: string;
}) => {
	const existingUser = await getUserByEmail(email);

	const accountId = await sendEmailOTP({ email });
	if (!accountId) throw new Error("Failed to send an OTP");

	if (!existingUser) {
		const { databases } = await createAdminClient();

		await databases.createDocument(
			appwriteConfig.databaseId,
			appwriteConfig.usersCollectionId,
			ID.unique(),
			{
				fullName,
				email,
				avatar:
					"https://static.vecteezy.com/system/resources/previews/021/548/095/original/default-profile-picture-avatar-user-avatar-icon-person-icon-head-icon-profile-picture-icons-default-anonymous-user-male-and-female-businessman-photo-placeholder-social-network-avatar-portrait-free-vector.jpg",
				accountId,
			}
		);
	}
	return parseStringify(accountId);
};

export const verifySecret = async ({
	accountId,
	password,
}: {
	accountId: string;
	password: string;
}) => {
	try {
		const { account } = await createAdminClient();

		const session = await account.createSession(accountId, password);

		(await cookies()).set("appwrite-session", session.secret, {
			path: "/",
			httpOnly: true,
			sameSite: "strict",
			secure: true,
		});

		return parseStringify({ sessionId: session.$id });
	} catch (error) {
		handleError(error, "Failed to verify OTP");
	}
};

export const signInUser = async ({ email }: { email: string }) => {
	try {
		const existingUser = await getUserByEmail(email);

		// User exists, send OTP
		if (existingUser) {
			await sendEmailOTP({ email });
			return parseStringify({ accountId: existingUser.accountId });
		}

		return parseStringify({ accountId: null, error: "User not found" });
	} catch (error) {
		handleError(error, "Failed to sign in user");
	}
};
