import { getAllEvents, getFilteredEvents } from "@/lib/actions/event.action";
import { handleError } from "@/lib/utils";
import { NextRequest } from "next/server";

export async function GET(
  request: NextRequest,
  { params }: { params: { slug: any } }
) {
  const { searchParams } = new URL(request.nextUrl);

  const query = searchParams?.get("query")!;
  const category = searchParams?.get("category")!;

  let events;
  try {
    query || category
      ? (events = await getFilteredEvents({
          query,
          category,
        }))
      : (events = await getAllEvents());

    return new Response(JSON.stringify(events));
  } catch (err) {
    handleError(err);
  }
}
