"use server";

import { CreateUserParams, UpdateUserParams } from "@/types";
import { handleError } from "../utils";
import { base } from "../airtableDB/database";
import { FieldSet, Records } from "airtable";

export const minifyRecordData = (record: any) => {
  const newUser = {
    recordId: record.id,
    ...record.fields,
  };
  return newUser;
};

export const getMinifiedRecords = (records: Records<FieldSet>) => {
  return records.map((record: any) => minifyRecordData(record));
};

export const createUser = async (user: CreateUserParams) => {
  try {
    const newUser = await base("user").create({ ...user });
    return minifyRecordData(newUser);
  } catch (err) {
    handleError(err);
  }
};

export const getUserById = async (
  userId = "user_2aDnZqWYGVSOYojKfjVcrxUIoBY"
) => {
  try {
    const user = await base("user")
      .select({
        filterByFormula: `clerkId="${userId}"`,
      })
      .firstPage();
    if (user) {
      return minifyRecordData(user[0]);
    } else {
      return false;
    }
  } catch (err) {
    console.log(err);
  }
};

export const updateUser = async (clerkId: string, user: UpdateUserParams) => {
  try {
  } catch (err) {}
};

export const deleteUser = async (clerkId: string) => {
  try {
    console.log("delete user", clerkId);
    return { message: "user has been deleted" };
  } catch (err) {
    console.log(err);
  }
};
