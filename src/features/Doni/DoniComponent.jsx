import Button from "@mui/material/Button";
import Card from "../../components/Card";
import FormControl from "@mui/material/FormControl";
import Grid from "@mui/material/Grid";
import IconButton from "@mui/material/IconButton";
import InputLabel from "@mui/material/InputLabel";
import List from "@mui/material/List";
import ListItem from "@mui/material/ListItem";
import ListItemText from "@mui/material/ListItemText";
import MenuItem from "@mui/material/MenuItem";
import Select from "@mui/material/Select";
import Stack from "@mui/material/Stack";
import Typography from "@mui/material/Typography";
import DeleteIcon from "@mui/icons-material/Delete";
import { useMemo, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import MaggioriPaper from "../../components/MaggioriPaper";
import DoniDb from "../../db/Doni";
import TarocchiDb from "../../db/Tarocchi";
import {
  addDoni,
  addMaggioriEstratti,
  removeDono,
  removeMaggioriEstratto,
  resetDoni,
} from "../../redux/slices/doniSlice";
import { carAffinitaOccultaByStore } from "../../utils/caratteristicheMethods";
import { generateRandomNumer } from "../../utils/random";

const DoniComponent = () => {
  const { caratteristiche } = useSelector((state) => state.caratteristiche);
  const { doni, maggioriEstratti } = useSelector((state) => state.doni);
  const dispatch = useDispatch();
  const [selectedDonoId, setSelectedDonoId] = useState("");

  const carAffinita = carAffinitaOccultaByStore(caratteristiche);
  const numeroDoniDisponibili = useMemo(() => {
    if (!carAffinita || typeof carAffinita.modificatore !== "function") {
      return 0;
    }
    const value = Number(carAffinita.modificatore(carAffinita.valore));
    return Number.isNaN(value) ? 0 : value;
  }, [carAffinita]);
  const slotsLeft = Math.max(0, numeroDoniDisponibili - doni.length);

  const tarocchiById = useMemo(() => {
    const map = new Map();
    TarocchiDb.forEach((tarocco) => map.set(tarocco.id, tarocco));
    return map;
  }, []);

  const doniOptions = useMemo(() => {
    return DoniDb.map((dono) => ({
      ...dono,
      tarocco: tarocchiById.get(dono.taroccoRef),
    }))
      .filter((dono) => !doni.some((selected) => selected.id === dono.id))
      .sort((a, b) => {
        const numeroA = a.tarocco?.numero ?? 0;
        const numeroB = b.tarocco?.numero ?? 0;
        return numeroA - numeroB;
      });
  }, [doni, tarocchiById]);

  const handleRandomDono = () => {
    if (slotsLeft <= 0) {
      return;
    }
    const estrattiIds = new Set(doni.map((d) => d.id));
    const maggioriEstrattiIds = new Set(maggioriEstratti.map((m) => m.id));
    let currentCount = doni.length;
    let attempts = 0;
    while (currentCount < numeroDoniDisponibili && attempts < 100) {
      attempts += 1;
      const number = generateRandomNumer(21, 0);
      const tarocco = TarocchiDb.find((t) => t.numero === number);
      if (!tarocco) {
        continue;
      }
      const donoEstratto = DoniDb.find((t) => t.taroccoRef === tarocco.id);
      if (!donoEstratto || estrattiIds.has(donoEstratto.id)) {
        continue;
      }
      estrattiIds.add(donoEstratto.id);
      if (!maggioriEstrattiIds.has(tarocco.id)) {
        dispatch(addMaggioriEstratti(tarocco));
        maggioriEstrattiIds.add(tarocco.id);
      }
      dispatch(addDoni(donoEstratto));
      currentCount += 1;
    }
  };

  const handleSelectDono = (event) => {
    setSelectedDonoId(event.target.value);
  };

  const handleAddSelectedDono = () => {
    if (!selectedDonoId || slotsLeft <= 0) {
      return;
    }
    const dono = DoniDb.find((d) => d.id === selectedDonoId);
    if (!dono || doni.some((d) => d.id === dono.id)) {
      return;
    }
    const tarocco = tarocchiById.get(dono.taroccoRef);
    if (tarocco && !maggioriEstratti.some((m) => m.id === tarocco.id)) {
      dispatch(addMaggioriEstratti(tarocco));
    }
    dispatch(addDoni(dono));
    setSelectedDonoId("");
  };

  const handleRemoveDono = (donoId, taroccoRef) => {
    dispatch(removeDono(donoId));
    if (taroccoRef) {
      dispatch(removeMaggioriEstratto(taroccoRef));
    }
  };

  const handleResetDoni = () => {
    dispatch(resetDoni());
    setSelectedDonoId("");
  };

  return (
    <Card headerText="Doni">
      <Stack spacing={2} direction="row" flexWrap="wrap">
        <FormControl size="small" sx={{ minWidth: 240 }} disabled={slotsLeft <= 0}>
          <InputLabel id="dono-select-label">Seleziona Dono</InputLabel>
          <Select
            labelId="dono-select-label"
            id="dono-select"
            value={selectedDonoId}
            label="Seleziona Dono"
            onChange={handleSelectDono}
          >
            <MenuItem value="">
              <em>Seleziona</em>
            </MenuItem>
            {doniOptions.map((option) => (
              <MenuItem key={option.id} value={option.id}>
                {option.tarocco
                  ? `${option.tarocco.numero} - ${option.tarocco.nome}: ${option.nome}`
                  : option.nome}
              </MenuItem>
            ))}
          </Select>
        </FormControl>
        <Button
          size="small"
          variant="outlined"
          onClick={handleAddSelectedDono}
          disabled={!selectedDonoId || slotsLeft <= 0}
        >
          Aggiungi
        </Button>
        <Button
          size="small"
          variant="contained"
          onClick={handleRandomDono}
          disabled={slotsLeft <= 0}
        >
          Estrai
        </Button>
        <Button
          size="small"
          variant="contained"
          onClick={handleResetDoni}
          disabled={doni.length === 0}
        >
          Reset
        </Button>
      </Stack>
      <Typography variant="caption" color="text.secondary" sx={{ mt: 1 }}>
        Doni selezionati: {doni.length}/{numeroDoniDisponibili}
      </Typography>
      <Grid container spacing={1}>
        <Grid item xs>
          <MaggioriPaper maggioriEstratti={maggioriEstratti} />
        </Grid>
      </Grid>
      <Grid container spacing={3}>
        <Grid item xs>
          <List>
            {doni.map((d) => (
              <ListItem
                key={d.id}
                disablePadding
                secondaryAction={
                  <IconButton
                    edge="end"
                    aria-label="remove-dono"
                    onClick={() => handleRemoveDono(d.id, d.taroccoRef)}
                  >
                    <DeleteIcon />
                  </IconButton>
                }
              >
                <ListItemText primary={d.nome} secondary={d.descrizione} />
              </ListItem>
            ))}
          </List>
        </Grid>
      </Grid>
    </Card>
  );
};

export default DoniComponent;
