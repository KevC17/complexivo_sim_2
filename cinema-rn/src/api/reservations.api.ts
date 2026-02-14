import { http } from "./http";
import type { Paginated } from "../types/drf";
import type { Reservations } from "../types/reservations";

export async function listReservationssApi(): Promise<Paginated<Reservations> | Reservations[]> {
  const { data } = await http.get<Paginated<Reservations> | Reservations[]>("/api/reservations/");
  return data;
}