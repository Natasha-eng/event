"use server";

import { CreateUserParams, UpdateUserParams } from "@/types";
import { handleError } from "../utils";
// import { base } from "../airtableDB/database";
export const Airtable = require("airtable");
Airtable.configure({
  endpointUrl: "https://api.airtable.com",
  apiKey: process.env.AIRTABLE_API_TOKEN,
});
export const base = Airtable.base([process.env.AIRTABLE_BASE_KEY]);

export const createUser = async (user: CreateUserParams) => {
  try {
    const newUser = await base("user").create(
      { ...user },
      function (err: any, record: any) {
        if (err) {
          console.error(err);
          return;
        }
        console.log("createUser", record.json());
      }
    );

    return JSON.parse(JSON.stringify(newUser));
  } catch (err) {
    handleError(err);
  }
};

export const getUserById = async (userId: string) => {
  try {
    console.log("getUserById", userId);
  } catch (err) {}
};

export const updateUser = async (clerkId: string, user: UpdateUserParams) => {
  try {
    console.log("update user", clerkId, user);
  } catch (err) {}
};

export const deleteUser = async (clerkId: string) => {
  try {
    console.log("delete user", clerkId);
  } catch (err) {}
};
