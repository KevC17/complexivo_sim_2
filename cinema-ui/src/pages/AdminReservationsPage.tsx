import { useEffect, useState } from "react";
import {
  Container, Paper, Typography, TextField, Button, Stack,
  Table, TableHead, TableRow, TableCell, TableBody, IconButton, Alert,
  FormControl, InputLabel, Select, MenuItem
} from "@mui/material";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";

import { type Show, listShowsApi } from "../api/show.api";
import { type Reservations, listReservationssAdminApi, createReservationsApi, updateReservationsApi, deleteReservationsApi } from "../api/reservations.api";

export default function AdminReservationssPage() {
  const [items, setItems] = useState<Reservations[]>([]);
  const [shows, setShows] = useState<Show[]>([]);
  const [error, setError] = useState("");

  const [editId, setEditId] = useState<number | null>(null);
  const [show, setShow] = useState<number>(0);
  const [show_movie_title, setShowMovieTitle] = useState("");
  const [customerName, setCustomerName] = useState("");
  const [seats, setSeats] = useState<number | null>(null);
  const [status, setStatus] = useState("");

  const load = async () => {
    try {
      setError("");
      const data = await listReservationssAdminApi();
      setItems(data.results); // DRF paginado
    } catch {
      setError("No se pudo cargar vehículos. ¿Login? ¿Token admin?");
    }
  };

  const loadShows = async () => {
    try {
      const data = await listShowsApi();
      setShows(data.results); // DRF paginado
      if (!show && data.results.length > 0) setShow(data.results[0].id);
    } catch {
      // si falla, no bloquea la pantalla
    }
  };

  useEffect(() => { load(); loadShows(); }, []);

  const save = async () => {
    try {
      setError("");
      if (!show) return setError("Seleccione una show");
      if (!customerName.trim() || !show) return setError("Modelo y placa son requeridos");

      const payload = {
        show_id: Number(show),
        show_movie_title: show_movie_title.trim(),
        customer_name: customerName.trim(),
        seats: Number(seats),
        status: status.trim(),
      };

      if (editId) await updateReservationsApi(editId, payload);
      else await createReservationsApi(payload as any);

      setEditId(null);
      setShow(0);
      setShowMovieTitle("");
      setCustomerName("");
      setSeats(0);
      setStatus("");
      await load();
    } catch {
      setError("No se pudo guardar vehículo. ¿Token admin?");
    }
  };

  const startEdit = (v: Reservations) => {
    setEditId(v.id);
    setShow(v.show_id);
    setShowMovieTitle(v.show_movie_title);
    setCustomerName(v.customer_name);
    setSeats(v.seats);
    setStatus(v.status);
  };

  const remove = async (id: number) => {
    try {
      setError("");
      await deleteReservationsApi(id);
      await load();
    } catch {
      setError("No se pudo eliminar vehículo. ¿Token admin?");
    }
  };

  return (
    <Container sx={{ mt: 3 }}>
      <Paper sx={{ p: 3 }}>
        <Typography variant="h5" sx={{ mb: 2 }}>Admin Reservations (Privado)</Typography>

        {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}

        <Stack spacing={2} sx={{ mb: 2 }}>
          <Stack direction={{ xs: "column", md: "row" }} spacing={2}>

            <FormControl sx={{ width: 260 }}>
              <InputLabel id="show-label">Show</InputLabel>
              <Select
                labelId="show-label"
                label="Show"
                value={show}
                onChange={(e) => setShow(Number(e.target.value))}
              >
                {shows.map((m) => (
                  <MenuItem key={m.id} value={m.id}>
                    {m.movie_title} (#{m.id})
                  </MenuItem>
                ))}
              </Select>
            </FormControl>

            <TextField label="Show Movie Title" value={show_movie_title} onChange={(e) => setShowMovieTitle(e.target.value)} fullWidth />
            <TextField label="Customer Name" value={customerName} onChange={(e) => setCustomerName(e.target.value)} fullWidth />
            
          </Stack>

          <Stack direction={{ xs: "column", md: "row" }} spacing={2}>
            <TextField label="Seats" type="number" value={seats} onChange={(e) => setSeats(Number(e.target.value))} sx={{ width: 160 }} />
            <InputLabel id="estado-label">Status</InputLabel>
            <Select
                labelId="estado-label"
                label="Status"
                value={status}
                onChange={(e) => setStatus(String(e.target.value))}
            >
                <MenuItem value="RESERVED">RESERVED</MenuItem>
                <MenuItem value="CONFIRMED">CONFIRMED</MenuItem>
                <MenuItem value="CANCELLED">CANCELLED</MenuItem>
            </Select>
            <Button variant="contained" onClick={save}>{editId ? "Actualizar" : "Crear"}</Button>
            <Button variant="outlined" onClick={() => { setEditId(null); setShowMovieTitle(""); setCustomerName(""); setSeats(0); setStatus(""); }}>Limpiar</Button>
            <Button variant="outlined" onClick={() => { load(); loadShows(); }}>Refrescar</Button>
          </Stack>
        </Stack>

        <Table size="small">
          <TableHead>
            <TableRow>
              <TableCell>ID</TableCell>
              <TableCell>Show</TableCell>
              <TableCell>ShowMovieTitle</TableCell>
              <TableCell>CustomerName</TableCell>
              <TableCell>Seat</TableCell>
              <TableCell>Status</TableCell>
              <TableCell align="right">Acciones</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {items.map((v) => (
              <TableRow key={v.id}>
                <TableCell>{v.id}</TableCell>
                <TableCell>{v.show_movie_title ?? v.show_id}</TableCell>
                <TableCell>{v.customer_name}</TableCell>
                <TableCell>{v.seats}</TableCell>
                <TableCell>{v.status}</TableCell>
                <TableCell align="right">
                  <IconButton onClick={() => startEdit(v)}><EditIcon /></IconButton>
                  <IconButton onClick={() => remove(v.id)}><DeleteIcon /></IconButton>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </Paper>
    </Container>
  );
}