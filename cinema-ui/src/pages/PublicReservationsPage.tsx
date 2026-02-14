import { useEffect, useState } from "react";
import { Container, Paper, Typography, Button, Stack, Table, TableHead, TableRow, TableCell, TableBody } from "@mui/material";
import { type Reservations, listReservationssPublicApi } from "../api/reservations.api";

export default function PublicVehiclesPage() {
  const [items, setItems] = useState<Reservations[]>([]);
  const [error, setError] = useState("");

  const load = async () => {
    try {
      setError("");
      const data = await listReservationssPublicApi();
      setItems(data.results); // DRF paginado
    } catch {
      setError("No se pudo cargar la lista pública. ¿Backend encendido?");
    }
  };

  useEffect(() => { load(); }, []);

  return (
    <Container sx={{ mt: 3 }}>
      <Paper sx={{ p: 3 }}>
        <Stack direction="row" justifyContent="space-between" alignItems="center" sx={{ mb: 2 }}>
          <Typography variant="h5">Lista de Reservaciones (Público)</Typography>
          <Button variant="outlined" onClick={load}>Refrescar</Button>
        </Stack>

        {error && <Typography color="error" sx={{ mb: 2 }}>{error}</Typography>}

        <Table size="small">
          <TableHead>
            <TableRow>
              <TableCell>ID</TableCell>
              <TableCell>Show</TableCell>
              <TableCell>Customer Name</TableCell>
              <TableCell>Seats</TableCell>
              <TableCell>Status</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {items.map((v) => (
              <TableRow key={v.id}>
                <TableCell>{v.id}</TableCell>
                <TableCell>{v.show_id ?? v.show_movie_title}</TableCell>
                <TableCell>{v.customer_name}</TableCell>
                <TableCell>{v.seats}</TableCell>
                <TableCell>{v.status}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </Paper>
    </Container>
  );
}