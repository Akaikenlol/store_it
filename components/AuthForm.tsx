"use client";

import React, { useState } from "react";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";

import { Button } from "@/components/ui/button";
import {
	Form,
	FormControl,
	FormField,
	FormItem,
	FormLabel,
	FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import Image from "next/image";
import Link from "next/link";
import { createAccount } from "@/lib/actions/user.actions";

type FormType = "sign-in" | "sign-up";

const authFormSchema = (formType: FormType) => {
	return z.object({
		email: z.string().email(),
		fullName:
			formType === "sign-up"
				? z.string().min(2).max(50)
				: z.string().optional(),
	});
};

const AuthForm = ({ type }: { type: FormType }) => {
	// 1. Create a state variable called `loading` with the initial value of `false`
	const [isLoading, setIsLoading] = useState(false);
	const [errorMessage, setErrorMessage] = useState("");
	const [accountId, setAccountId] = useState(null);

	const formSchema = authFormSchema(type);

	// 2. Create a form using the `useForm` hook
	const form = useForm<z.infer<typeof formSchema>>({
		resolver: zodResolver(formSchema),
		defaultValues: {
			email: "",
			fullName: "",
		},
	});

	// 3. Create an `onSubmit` function that accepts the form values as an argument
	// 4. Inside the `onSubmit` function, log the form values
	// 5. Log the form values in the `onSubmit` function
	const onSubmit = async (values: z.infer<typeof formSchema>) => {
		console.log(values);
		setIsLoading(true);
		setErrorMessage("");

		try {
			const user = await createAccount({
				fullName: values.fullName || "",
				email: values.email,
			});
			setAccountId(user.accountId);
		} catch (error) {
			setErrorMessage("Fail to create account. Please try again.");
		} finally {
			setIsLoading(false);
		}
	};
	return (
		<>
			<Form {...form}>
				<form onSubmit={form.handleSubmit(onSubmit)} className="auth-form">
					<h1 className="form-title">
						{type === "sign-in" ? "Sign In" : "Sign Up"}
					</h1>
					{type === "sign-up" && (
						<FormField
							control={form.control}
							name="fullName"
							render={({ field }) => (
								<FormItem>
									<div className="shad-form-item">
										<FormLabel className="shad-form-label">Full Name</FormLabel>
										<FormControl>
											<Input
												placeholder="Enter your full name"
												className="shad-input"
												{...field}
											/>
										</FormControl>
									</div>
									<FormMessage className="shad-form-message" />
								</FormItem>
							)}
						/>
					)}
					<FormField
						control={form.control}
						name="email"
						render={({ field }) => (
							<FormItem>
								<div className="shad-form-item">
									<FormLabel className="shad-form-label">Email</FormLabel>
									<FormControl>
										<Input
											placeholder="Enter your email"
											className="shad-input"
											{...field}
										/>
									</FormControl>
								</div>
								<FormMessage className="shad-form-message" />
							</FormItem>
						)}
					/>
					<Button
						type="submit"
						className="form-submit-button text-white"
						disabled={isLoading}
					>
						{type === "sign-in" ? "Sign In" : "Sign Up"}
						{isLoading && (
							<Image
								src={"/assets/icons/loader.svg"}
								alt="loader"
								width={24}
								height={24}
								className="ml-2 animate-spin"
							/>
						)}
					</Button>
					{errorMessage && <p className="error-message">*{errorMessage}</p>}
					<div className="body-2 flex justify-center">
						<p className="text-light-100">
							{type === "sign-in"
								? "Don't have an account?"
								: "Already have an account?"}
						</p>
						<Link
							href={type === "sign-in" ? "/sign-up" : "/sign-in"}
							className="ml-1 font-medium text-brand"
						>
							{type === "sign-in" ? "Sign Up" : "Sign In"}
						</Link>
					</div>
				</form>
				{/* OTP VERIFICATION */}
			</Form>
		</>
	);
};

export default AuthForm;
