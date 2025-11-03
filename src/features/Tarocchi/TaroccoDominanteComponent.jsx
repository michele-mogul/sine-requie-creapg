import Button from "@mui/material/Button";
import FormControl from "@mui/material/FormControl";
import Grid from "@mui/material/Grid";
import InputLabel from "@mui/material/InputLabel";
import MenuItem from "@mui/material/MenuItem";
import Select from "@mui/material/Select";
import Stack from "@mui/material/Stack";
import { useMemo } from "react";
import { useDispatch, useSelector } from "react-redux";
import Card from "../../components/Card";
import IconTooltip from "../../components/IconTooltip";
import TarocchiDb from "../../db/Tarocchi";
import {
  resetCaratteristiche,
  resetCaratteristicheTaroccoStorico,
  restoreCaratteristicheByStorico,
  setCaratteristicheTaroccoStorico,
  updateCaratteristica,
} from "../../redux/slices/caratteristicheSlice";
import { resetDisturbiMentali } from "../../redux/slices/disturbiMentaliSlice";
import { resetDoni } from "../../redux/slices/doniSlice";
import { setTaroccoDominante } from "../../redux/slices/taroccoSlice";
import { generateRandomNumer } from "../../utils/random";
import TaroccoPaper from "./TaroccoPaper";

function TarocchiDominante() {
  const { taroccoDominante } = useSelector((state) => state.tarocco);
  const { caratteristicheStorico } = useSelector(
    (state) => state.caratteristiche
  );

  const dispatch = useDispatch();
  const tarocchiOptions = useMemo(
    () => [...TarocchiDb].sort((a, b) => a.numero - b.numero),
    []
  );
  const selectedTaroccoNumero =
    typeof taroccoDominante?.numero === "number" ? taroccoDominante.numero : "";

  const applyTaroccoDominante = (tarocco) => {
    if (!tarocco) {
      return;
    }
    dispatch(setTaroccoDominante(tarocco));
    const listCaratteristicheByTarocco = tarocco.caratteristicaRef;
    dispatch(resetDoni());
    dispatch(resetDisturbiMentali());
    dispatch(resetCaratteristiche());
    dispatch(restoreCaratteristicheByStorico());
    listCaratteristicheByTarocco.forEach((element) => {
      const carat = caratteristicheStorico.find((ca) => ca.id === element.id);
      let caratMod = { ...carat };
      if (Math.sign(element.valore)) {
        caratMod.valore = caratMod.valore + element.valore;
      } else {
        caratMod.valore = caratMod.valore - element.valore;
      }
      dispatch(updateCaratteristica(caratMod));
    });
    dispatch(resetCaratteristicheTaroccoStorico());
    dispatch(setCaratteristicheTaroccoStorico());
  };

  const handleRandomTaroccoDominante = () => {
    const number = generateRandomNumer(21, 0);
    const tarocco = TarocchiDb.find((t) => t.numero === number);
    applyTaroccoDominante(tarocco);
  };

  const handleSelectTaroccoDominante = (event) => {
    const numero = Number(event.target.value);
    if (Number.isNaN(numero)) {
      return;
    }
    const tarocco = tarocchiOptions.find((t) => t.numero === numero);
    applyTaroccoDominante(tarocco);
  };

  return (
    <Card headerText="Tarocco Dominante">
      <Stack spacing={2} direction="row">
        <FormControl size="small" sx={{ minWidth: 220 }}>
          <InputLabel id="tarocco-dominante-select-label">
            Seleziona
          </InputLabel>
          <Select
            labelId="tarocco-dominante-select-label"
            id="tarocco-dominante-select"
            value={selectedTaroccoNumero}
            label="Seleziona"
            onChange={handleSelectTaroccoDominante}
          >
            <MenuItem value="" disabled>
              <em>Seleziona tarocco</em>
            </MenuItem>
            {tarocchiOptions.map((tarocco) => (
              <MenuItem key={tarocco.id} value={tarocco.numero}>
                {tarocco.numero} - {tarocco.nome}
              </MenuItem>
            ))}
          </Select>
        </FormControl>
        <>
          <Button
            size="small"
            variant="contained"
            onClick={handleRandomTaroccoDominante}
          >
            Estrai
          </Button>
          <IconTooltip
            type={"info"}
            message={
              "La modifica comporta il reset dei seguenti campi: Caratteristiche"
            }
          />
        </>
      </Stack>
      <Grid container spacing={3}>
        <Grid item xs>
          <TaroccoPaper tarocco={taroccoDominante} />
        </Grid>
      </Grid>
    </Card>
  );
}

export default TarocchiDominante;
