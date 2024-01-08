"use server";

import { CreateCategoryParams } from "@/types";
import { handleError } from "../utils";
import { getMinifiedRecords, minifyRecordData } from "./user.actions";
import { base } from "../airtableDB/database";

export const createCategory = async ({
  categoryName,
}: CreateCategoryParams) => {
  try {
    const newCategory = await base("category").create({ name: categoryName });
    return minifyRecordData(newCategory);
  } catch (err) {
    handleError(err);
  }
};

export const fetchAllCategories = async () => {
  try {
    const allCategories = await base("category")
      .select({
        view: "Grid view",
      })
      .firstPage();
    return getMinifiedRecords(allCategories);
  } catch (err) {
    handleError(err);
  }
};
