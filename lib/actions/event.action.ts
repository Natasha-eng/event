"use server";

import {
  CreateEventParams,
  DeleteEventParams,
  Event,
  GetAllEventsParams,
  GetEventsByUserParams,
  GetRelatedEventsByCategoryParams,
  UpdateEventParams,
} from "@/types";
import { handleError } from "../utils";
import { getUserById, minifyRecordData } from "./user.actions";
import { base } from "../airtableDB/database";
import { revalidatePath } from "next/cache";

export const minifyRecordEventData = (record: any) => {
  const newRecord = {
    recordId: record.id,
    createdAt: record._rawJson.createdTime,
    ...record.fields,
  };
  return newRecord;
};

export const getMinifiedEventsRecords = (records: any[]) => {
  return records.map((record: any) => minifyRecordEventData(record));
};

export const createEvent = async ({
  event,
  userId,
  path,
}: CreateEventParams) => {
  try {
    const organizer = await getUserById(userId);
    if (!organizer) {
      throw new Error("Organizer not found");
    }

    const newEvent = await base("event").create({
      ...event,
      category: event.title,
      organizer: userId,
      username: organizer.username,
    });
    return minifyRecordEventData(newEvent);
  } catch (err) {
    handleError(err);
  }
};

export const getEventById = async (eventId: string) => {
  try {
    const event = await base("event").find(eventId);
    if (!event) {
      throw new Error("Event not found");
    }
    return minifyRecordEventData(event);
  } catch (err) {
    handleError(err);
  }
};

export const getCategoryById = async (categoryId: string) => {
  try {
    const categoryData = await base("category").find(categoryId);
    const category = minifyRecordData(categoryData);
    return category;
  } catch (err) {
    handleError(err);
  }
};

export const getAllEvents = async () => {
  const limit = 3;
  try {
    const eventsData = await base("event")
      .select({
        // filterByFormula: `AND(REGEX_MATCH(title,"${query}"),REGEX_MATCH(categoryId,"${category}"))`,

        sort: [{ field: "createdAt", direction: "desc" }],
      })
      .firstPage();

    const events = getMinifiedEventsRecords(eventsData);
    const eventsCount = events.length;
    revalidatePath("/");
    return {
      data: JSON.parse(JSON.stringify(events)),
      totalPages: Math.ceil(eventsCount / limit),
    };
  } catch (err) {
    handleError(err);
  }
};

export const getFilteredEvents = async ({
  query = "",
  category = "",
}: GetAllEventsParams) => {
  const limit = 3;
  try {
    const eventsData = await base("event")
      .select({
        filterByFormula: `AND(REGEX_MATCH(title,"${query}"),REGEX_MATCH(categoryId,"${category}"))`,

        sort: [{ field: "createdAt", direction: "desc" }],
      })
      .firstPage();

    const events = getMinifiedEventsRecords(eventsData);
    const eventsCount = events.length;
    revalidatePath("/");
    return {
      data: JSON.parse(JSON.stringify(events)),
      totalPages: Math.ceil(eventsCount / limit),
    };
  } catch (err) {
    handleError(err);
  }
};

export const deleteEvent = async ({ eventId, path }: DeleteEventParams) => {
  try {
    const deletedEvent = await base("event").destroy(eventId);
    if (deletedEvent.recordId) revalidatePath(path);
  } catch (err) {
    handleError(err);
  }
};

export const updateEvent = async ({
  userId,
  eventId,
  event,
  path,
}: UpdateEventParams): Promise<Event | undefined> => {
  try {
    const eventToUpdate = await getEventById(eventId);
    if (!eventToUpdate || eventToUpdate.organizer !== userId) {
      throw new Error("Unauthorized or event not found");
    }
    const updatedEvent = await base("event").update(eventId, {
      ...event,
    });
    revalidatePath(path);
    return minifyRecordEventData(updatedEvent);
  } catch (err) {
    handleError(err);
  }
};

export const getRelatedEventsByCategory = async ({
  categoryId,
  eventId,
  limit = 3,
}: GetRelatedEventsByCategoryParams) => {
  try {
    const eventIdToNumber = Number(eventId);
    const events = await base("event")
      .select({
        filterByFormula: `AND(categoryId="${categoryId}",NOT(_id=${eventIdToNumber}))`,
      })
      .firstPage();
    const totalPages = Math.ceil(events.length / limit);
    const relatedEvents = getMinifiedEventsRecords(events);
    return {
      data: relatedEvents,
      totalPages,
    };
  } catch (err) {
    handleError(err);
  }
};

type OrganizedData = { data: Event[]; totalPages: number };

export const getEventsByUser = async ({
  userId,
  limit = 3,
  page,
}: GetEventsByUserParams): Promise<OrganizedData | undefined> => {
  try {
    const eventsData = await base("event")
      .select({
        filterByFormula: `organizer="${userId}"`,
      })
      .firstPage();

    const organizedEvents = getMinifiedEventsRecords(eventsData);
    const totalPages = Math.ceil(organizedEvents.length / limit);

    return {
      data: organizedEvents,
      totalPages,
    };
  } catch (err) {
    handleError(err);
  }
};
