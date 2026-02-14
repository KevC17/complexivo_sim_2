import { useEffect, useState } from "react";
import {
  Container, Paper, Typography, TextField, Button, Stack,
  Table, TableHead, TableRow, TableCell, TableBody, IconButton, Alert
} from "@mui/material";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";

import { type Show, listShowsApi, createShowApi, updateShowApi, deleteShowApi } from "../api/show.api";

export default function AdminShowsPage() {
  const [items, setItems] = useState<Show[]>([]);
  const [editId, setEditId] = useState<number | null>(null);
  const [movieTitle, setMovieTitle] = useState("");
  const [room, setRoom] = useState("");
  const [price, setPrice] = useState<number | null>(null);
  const [available_seats, setAvailableSeats] = useState<number | null>(null);
  const [error, setError] = useState("");

  const load = async () => {
    try {
      setError("");
      const data = await listShowsApi();
      setItems(data.results); // DRF paginado
    } catch {
      setError("No se pudo cargar show. ¿Login? ¿Token admin?");
    }
  };

  useEffect(() => { load(); }, []);

  const save = async () => {
    try {
      setError("");
      if (!movieTitle.trim()) return setError("MovieTitle requerido");

      if (editId) await updateShowApi(editId, movieTitle.trim(), room.trim(), Number(price), Number(available_seats));
      else await createShowApi(movieTitle.trim(), room.trim(), Number(price), Number(available_seats));

      setMovieTitle("");
      setRoom("");
      setPrice(0);
      setAvailableSeats(0);
      setEditId(null);
      await load();
    } catch {
      setError("No se pudo guardar marca. ¿Token admin?");
    }
  };

  const startEdit = (m: Show) => {
    setEditId(m.id);
    setMovieTitle(m.movie_title);
    setRoom(m.room);
    setPrice(m.price);
    setAvailableSeats(m.available_seats);
  };

  const remove = async (id: number) => {
    try {
      setError("");
      await deleteShowApi(id);
      await load();
    } catch {
      setError("No se pudo eliminar marca. ¿Vehículos asociados? ¿Token admin?");
    }
  };

  return (
    <Container sx={{ mt: 3 }}>
      <Paper sx={{ p: 3 }}>
        <Typography variant="h5" sx={{ mb: 2 }}>Admin Shows (Privado)</Typography>

        {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}

        <Stack direction={{ xs: "column", sm: "row" }} spacing={2} sx={{ mb: 2 }}>
          <TextField label="MovieTitle" value={movieTitle} onChange={(e) => setMovieTitle(e.target.value)} fullWidth />
          <TextField label="Room" value={room} onChange={(e) => setRoom(e.target.value)} fullWidth />
          <TextField label="Price" value={price} onChange={(e) => setPrice(Number(e.target.value))} fullWidth />
          <TextField label="AvailableSeats" value={available_seats} onChange={(e) => setAvailableSeats(Number(e.target.value))} fullWidth />
          <Button variant="contained" onClick={save}>{editId ? "Actualizar" : "Crear"}</Button>
          <Button variant="outlined" onClick={() => { setMovieTitle(""); setEditId(null); }}>Limpiar</Button>
          <Button variant="outlined" onClick={load}>Refrescar</Button>
        </Stack>

        <Table size="small">
          <TableHead>
            <TableRow>
              <TableCell>ID</TableCell>
              <TableCell>MovieTitle</TableCell>
              <TableCell>Room</TableCell>
              <TableCell>Price</TableCell>
              <TableCell>AvailableSeats</TableCell>
              <TableCell align="right">Acciones</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {items.map((m) => (
              <TableRow key={m.id}>
                <TableCell>{m.id}</TableCell>
                <TableCell>{m.movie_title}</TableCell>
                <TableCell>{m.room}</TableCell>
                <TableCell>{m.price}</TableCell>
                <TableCell>{m.available_seats}</TableCell>
                <TableCell align="right">
                  <IconButton onClick={() => startEdit(m)}><EditIcon /></IconButton>
                  <IconButton onClick={() => remove(m.id)}><DeleteIcon /></IconButton>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </Paper>
    </Container>
  );
}