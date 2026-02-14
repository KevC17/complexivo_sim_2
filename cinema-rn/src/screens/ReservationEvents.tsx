import { useEffect, useMemo, useState } from "react";
import { View, Text, TextInput, Pressable, FlatList, StyleSheet } from "react-native";
import { Picker } from "@react-native-picker/picker";

import { listReservationssApi } from "../api/reservations.api";
import { listMovieCatalogsApi } from "../api/movie-catalog.api";
import { listReservationEventssApi, createReservationEventsApi, deleteReservationEventsApi } from "../api/reservation-events.api";

import type { Reservations } from "../types/reservations";
import type { MovieCatalog } from "../types/movie-catalog";
import type { ReservationEvents } from "../types/reservation-events";
import { toArray } from "../types/drf";


function movieCatalogLabel(st: MovieCatalog): string {
  return st.movie_title;
}

function parseOptionalNumber(input: string): { value?: number; error?: string } {
  const trimmed = input.trim();
  if (!trimmed) return { value: undefined };
  const parsed = Number(trimmed);
  if (Number.isNaN(parsed)) return { error: "Cost debe ser numérico" };
  return { value: parsed };
}

export default function ReservationEventssScreen() {
  const [services, setServices] = useState<ReservationEvents[]>([]);
  const [reservations, setReservationss] = useState<Reservations[]>([]);
  const [movieCatalogs, setMovieCatalogs] = useState<MovieCatalog[]>([]);

  const [selectedReservationsId, setSelectedReservationsId] = useState<number | null>(null);
  const [selectedMovieCatalogId, setSelectedMovieCatalogId] = useState<string>("");

  const [event_type, setEventType] = useState("");
  const [source, setSource] = useState("");
  const [note, setNote] = useState("");
  const [errorMessage, setErrorMessage] = useState("");

  const reservationsById = useMemo(() => {
    const map = new Map<number, Reservations>();
    reservations.forEach((v) => map.set(v.id, v));
    return map;
  }, [reservations]);

  const movieCatalogById = useMemo(() => {
    const map = new Map<string, MovieCatalog>();
    movieCatalogs.forEach((s) => map.set(s.id, s));
    return map;
  }, [movieCatalogs]);

  const loadAll = async (): Promise<void> => {
    try {
      setErrorMessage("");

      const [servicesData, reservationsData, movieCatalogsData] = await Promise.all([
        listReservationEventssApi(),
        listReservationssApi(),
        listMovieCatalogsApi(),
      ]);

      const servicesList = toArray(servicesData);
      const reservationsList = toArray(reservationsData);
      const movieCatalogsList = toArray(movieCatalogsData);

      setServices(servicesList);
      setReservationss(reservationsList);
      setMovieCatalogs(movieCatalogsList);

      if (selectedReservationsId === null && reservationsList.length) setSelectedReservationsId(reservationsList[0].id);
      if (!selectedMovieCatalogId && movieCatalogsList.length) setSelectedMovieCatalogId(movieCatalogsList[0].id);
    } catch {
      setErrorMessage("No se pudo cargar info. ¿Token? ¿baseURL? ¿backend encendido?");
    }
  };

  useEffect(() => { loadAll(); }, []);

  const createService = async (): Promise<void> => {
    try {
      setErrorMessage("");

      if (selectedReservationsId === null) return setErrorMessage("Seleccione una reservacion");
      if (!selectedMovieCatalogId) return setErrorMessage("Seleccione un tipo de catalogo de peliculas");

      const trimmedNotes = event_type.trim() ? event_type.trim() : undefined;
      const { value: parsedCost, error } = parseOptionalNumber(source);
      if (error) return setErrorMessage(error);

      const created = await createReservationEventsApi({
        reservation_id: selectedReservationsId,
        event_type: event_type,
        source: source,
        note: note,
      });

      setServices((prev) => [created, ...prev]);
      setEventType("");
      setSource("");
    } catch {
      setErrorMessage("No se pudo crear vehicle service");
    }
  };

  const removeService = async (id: string): Promise<void> => {
    try {
      setErrorMessage("");
      await deleteReservationEventsApi(id);
      setServices((prev) => prev.filter((s) => s.id !== id));
    } catch {
      setErrorMessage("No se pudo eliminar vehicle service");
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Reservation Events</Text>
      {!!errorMessage && <Text style={styles.error}>{errorMessage}</Text>}

      <Text style={styles.label}>Reservations</Text>
      <View style={styles.pickerWrap}>
        <Picker
          selectedValue={selectedReservationsId ?? ""}
          onValueChange={(value) => setSelectedReservationsId(Number(value))}
          dropdownIconColor="#58a6ff"
          style={styles.picker}
        >
          {reservations.map((v) => (
            <Picker.Item key={v.id} label={v.show_movie_title} value={v.id} />
          ))}
        </Picker>
      </View>

      <Text style={styles.label}>Movie Catalog</Text>
      <View style={styles.pickerWrap}>
        <Picker
          selectedValue={selectedMovieCatalogId}
          onValueChange={(value) => setSelectedMovieCatalogId(String(value))}
          dropdownIconColor="#58a6ff"
          style={styles.picker}
        >
          {movieCatalogs.map((st) => (
            <Picker.Item key={st.id} label={movieCatalogLabel(st)} value={st.id} />
          ))}
        </Picker>
      </View>

      <Text style={styles.label}>Event Type</Text>
      <TextInput
        placeholder="Notas"
        placeholderTextColor="#8b949e"
        value={event_type}
        onChangeText={setEventType}
        style={styles.input}
      />

      <Text style={styles.label}>Source</Text>
      <TextInput
        placeholder="40"
        placeholderTextColor="#8b949e"
        value={source}
        onChangeText={setSource}
        style={styles.input}
      />

      <Text style={styles.label}>Note</Text>
      <TextInput
        placeholder="40"
        placeholderTextColor="#8b949e"
        value={note}
        onChangeText={setNote}
        style={styles.input}
      />

      <Pressable onPress={createService} style={[styles.btn, { marginBottom: 12 }]}>
        <Text style={styles.btnText}>Crear (sin enviar fecha)</Text>
      </Pressable>

      <Pressable onPress={loadAll} style={[styles.btn, { marginBottom: 12 }]}>
        <Text style={styles.btnText}>Refrescar</Text>
      </Pressable>

      <FlatList
        data={services}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => {
          const v = reservationsById.get(item.reservation_id);

          const line1 = v ? v.show_movie_title : `reservations_id: ${item.reservation_id}`;

          const extras: string[] = [];
          if (item.event_type) extras.push(`Notas: ${item.event_type}`);
          if (item.created_at) extras.push(`Fecha: ${item.created_at}`);

          return (
            <View style={styles.row}>
              <View style={{ flex: 1, marginRight: 10 }}>
                <Text style={styles.rowText} numberOfLines={1}>{line1}</Text>
                {extras.map((t, idx) => (
                  <Text key={idx} style={styles.rowSub} numberOfLines={1}>{t}</Text>
                ))}
              </View>

              <Pressable onPress={() => removeService(item.id)}>
                <Text style={styles.del}>Eliminar</Text>
              </Pressable>
            </View>
          );
        }}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#0d1117", padding: 16 },
  title: { color: "#58a6ff", fontSize: 22, fontWeight: "800", marginBottom: 10 },
  error: { color: "#ff7b72", marginBottom: 10 },
  label: { color: "#8b949e", marginBottom: 6, marginTop: 6 },

  pickerWrap: {
    backgroundColor: "#161b22",
    borderRadius: 8,
    borderWidth: 1,
    borderColor: "#30363d",
    marginBottom: 10,
    overflow: "hidden",
  },
  picker: { color: "#c9d1d9" },

  input: {
    backgroundColor: "#161b22",
    color: "#c9d1d9",
    padding: 12,
    borderRadius: 8,
    marginBottom: 10,
    borderWidth: 1,
    borderColor: "#30363d",
  },

  btn: { backgroundColor: "#21262d", borderColor: "#58a6ff", borderWidth: 1, padding: 12, borderRadius: 8 },
  btnText: { color: "#58a6ff", textAlign: "center", fontWeight: "700" },

  row: {
    backgroundColor: "#161b22",
    padding: 12,
    borderRadius: 8,
    marginBottom: 10,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    borderWidth: 1,
    borderColor: "#30363d",
  },
  rowText: { color: "#c9d1d9", fontWeight: "800" },
  rowSub: { color: "#8b949e", marginTop: 2 },
  del: { color: "#ff7b72", fontWeight: "800" },
});