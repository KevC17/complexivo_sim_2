import { http } from "./http";
import type { ReservationEvents } from "../types/reservation-events";
import type { Paginated } from "../types/drf";

export type ReservationEventsCreatePayload = {
  reservation_id: number;
  event_type: string;
  source: string;
  note: string;
};

export async function listReservationEventssApi(): Promise<Paginated<ReservationEvents> | ReservationEvents[]> {
  const { data } = await http.get<Paginated<ReservationEvents> | ReservationEvents[]>("/api/reservation-events/");
  return data;
}

export async function createReservationEventsApi(payload: ReservationEventsCreatePayload): Promise<ReservationEvents> {
  const { data } = await http.post<ReservationEvents>("/api/reservation-events/", payload);
  return data;
}

export async function deleteReservationEventsApi(id: string): Promise<void> {
  await http.delete(`/api/reservation-events/${id}/`);
}