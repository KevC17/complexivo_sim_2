import { http } from "./http";
    
export type Paginated<T> = {
  count: number;
  next: string | null;
  previous: string | null;
  results: T[];
};

export type Reservations = {
  id: number;
  show_id: number;
  show_movie_title: string;
  customer_name: string;
  seats: number;
  status: string;
  created_at: string;
};

export async function listReservationssPublicApi() {
  const { data } = await http.get<Paginated<Reservations>>("/api/reservations/");
  return data; // { ... , results: [] }
}

export async function listReservationssAdminApi() {
  const { data } = await http.get<Paginated<Reservations>>("/api/reservations/");
  return data;
}

export async function createReservationsApi(payload: Omit<Reservations, "id">) {
  const { data } = await http.post<Reservations>("/api/reservations/", payload);
  return data;
}

export async function updateReservationsApi(id: number, payload: Partial<Reservations>) {
  const { data } = await http.put<Reservations>(`/api/reservations/${id}/`, payload);
  return data;
}

export async function deleteReservationsApi(id: number) {
  await http.delete(`/api/reservations/${id}/`);
}