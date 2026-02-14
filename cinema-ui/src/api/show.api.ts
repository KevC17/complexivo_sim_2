import { http } from "./http";
    
export type Paginated<T> = {
  count: number;
  next: string | null;
  previous: string | null;
  results: T[];
};

export type Show = { id: number;
                     movie_title: string;
                     room: string;
                     price: number;
                     available_seats: number };

export async function listShowsApi() {
  const { data } = await http.get<Paginated<Show>>("/api/show/");
  return data; // { count, next, previous, results }
}

export async function createShowApi(movie_title: string, room: string, price: number, available_seats: number) {
  const { data } = await http.post<Show>("/api/show/", { movie_title, room, price, available_seats });
  return data;
}

export async function updateShowApi(id: number, movie_title: string, room: string, price: number, available_seats: number) {
  const { data } = await http.put<Show>(`/api/show/${id}/`, { movie_title, room, price, available_seats });
  return data;
}

export async function deleteShowApi(id: number) {
  await http.delete(`/api/show/${id}/`);
}