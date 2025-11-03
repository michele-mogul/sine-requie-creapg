import AddCircleOutlineIcon from "@mui/icons-material/AddCircleOutline";
import CheckCircleOutlineOutlinedIcon from "@mui/icons-material/CheckCircleOutlineOutlined";
import ExpandLessIcon from "@mui/icons-material/ExpandLess";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import Collapse from "@mui/material/Collapse";
import FormControl from "@mui/material/FormControl";
import Grid from "@mui/material/Grid";
import IconButton from "@mui/material/IconButton";
import InputLabel from "@mui/material/InputLabel";
import List from "@mui/material/List";
import ListItem from "@mui/material/ListItem";
import ListItemIcon from "@mui/material/ListItemIcon";
import ListItemText from "@mui/material/ListItemText";
import MenuItem from "@mui/material/MenuItem";
import Select from "@mui/material/Select";
import Stack from "@mui/material/Stack";
import Tab from "@mui/material/Tab";
import Tabs from "@mui/material/Tabs";
import Tooltip from "@mui/material/Tooltip";
import Typography from "@mui/material/Typography";
import { useMemo, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import Card from "../../components/Card";
import MinoriPaper from "../../components/MinoriPaper";
import DifettiDb from "../../db/Difetti";
import PregiDb from "../../db/Pregi";
import { resetAllAbilita, setAbilita } from "../../redux/slices/abilitaSlice";
import { updateCaratteristica } from "../../redux/slices/caratteristicheSlice";
import {
  addDifetto,
  addMinoreEstratto,
  addPregio,
  resetDifetti,
  resetMinoriEstratti,
  resetPregi,
  setNumDifetti,
  setNumPregi,
} from "../../redux/slices/pregiDifettiSlice";
import { resetProfessione } from "../../redux/slices/professioneSlice";
import {
  estraiTaroccoMinore,
  getDescNumeroCarta,
  getDescSemeCarta,
} from "../../utils/random";

const MODE_LIST = "list";
const MODE_RANDOM = "random";
const MODE_CUSTOM = "custom";

function PregiDifettiComponent() {
  const [openDesc, setOpenDesc] = useState({});
  const [viewMode, setViewMode] = useState(MODE_LIST);
  const [manualPregioId, setManualPregioId] = useState("");
  const [manualDifettoId, setManualDifettoId] = useState("");
  const [pendingRapidExtraction, setPendingRapidExtraction] = useState(null);
  const [showPregiCatalog, setShowPregiCatalog] = useState(false);
  const [showDifettiCatalog, setShowDifettiCatalog] = useState(false);

  const { ambientazione } = useSelector((state) => state.generalita);
  const { caratteristiche } = useSelector((state) => state.caratteristiche);
  const { pregi, difetti, minoriEstratti, numDifetti, numPregi } = useSelector(
    (state) => state.pregiDifetti
  );
  const { abilitaStoricoTarocco } = useSelector((state) => state.abilita);
  const dispatch = useDispatch();

  const filteredPregi = useMemo(
    () =>
      PregiDb.filter(
        (t) => !t.ambientazioneRef || t.ambientazioneRef === ambientazione
      ),
    [ambientazione]
  );

  const filteredDifetti = useMemo(() => {
    const ambientList = DifettiDb.filter(
      (t) => ambientazione && t.ambientazioneRef === ambientazione
    );
    const generalList = DifettiDb.filter((t) => !t.ambientazioneRef);
    const merged = [...ambientList, ...generalList];
    const unique = new Map();
    merged.forEach((item) => {
      if (!unique.has(item.id)) {
        unique.set(item.id, item);
      }
    });
    return Array.from(unique.values());
  }, [ambientazione]);

  const applyDifettoEffects = (difetto) => {
    if (difetto?.caratteristicaRef) {
      difetto.caratteristicaRef.forEach((element) => {
        const carat = caratteristiche.find((t) => t.id === element.id);
        if (carat) {
          const caratMod = { ...carat, valore: carat.valore - element.valore };
          dispatch(updateCaratteristica(caratMod));
        }
      });
    }
  };

  const applyPregioEffects = (pregio) => {
    if (pregio?.caratteristicaRef) {
      pregio.caratteristicaRef.forEach((element) => {
        const carat = caratteristiche.find((t) => t.id === element.id);
        if (carat) {
          const caratMod = { ...carat, valore: carat.valore + element.valore };
          dispatch(updateCaratteristica(caratMod));
        }
      });
    }
  };

  const handleSelectDifetto = (
    difetto,
    { outstanding = numDifetti, decrementOutstanding = true } = {}
  ) => {
    if (!difetto || difetti.some((d) => d.id === difetto.id)) {
      return outstanding;
    }
    dispatch(addDifetto(difetto));
    applyDifettoEffects(difetto);
    let updatedOutstanding = outstanding;
    if (decrementOutstanding && outstanding > 0) {
      updatedOutstanding = outstanding - 1;
    }
    dispatch(setNumDifetti(updatedOutstanding));
    return updatedOutstanding;
  };

  const handleSelectPregi = (pregio) => {
    if (!pregio || pregi.some((p) => p.id === pregio.id)) {
      return numDifetti;
    }
    let difettiDaAssegnare = pregio.numeroDifetti;
    if (pregio.difettoRef && !difetti.some((t) => t.id === pregio.difettoRef)) {
      const diff =
        filteredDifetti.find((t) => t.id === pregio.difettoRef) ||
        DifettiDb.find((t) => t.id === pregio.difettoRef);
      if (diff) {
        dispatch(addDifetto(diff));
        applyDifettoEffects(diff);
        difettiDaAssegnare = Math.max(difettiDaAssegnare - 1, 0);
      }
    }
    dispatch(addPregio(pregio));
    dispatch(setNumPregi(numPregi + 1));
    applyPregioEffects(pregio);
    const newOutstanding = numDifetti + difettiDaAssegnare;
    dispatch(setNumDifetti(newOutstanding));
    return newOutstanding;
  };

  const disableButtonPregi = (pregio) =>
    pregi.some((selected) => selected.id === pregio.id);

  const availablePregi = useMemo(
    () => filteredPregi.filter((p) => !pregi.some((sel) => sel.id === p.id)),
    [filteredPregi, pregi]
  );

  const availableDifetti = useMemo(
    () => filteredDifetti.filter((d) => !difetti.some((sel) => sel.id === d.id)),
    [filteredDifetti, difetti]
  );

  const handleRapidExtraction = () => {
    if (!availablePregi.length) {
      return;
    }
    const pregioIndex = Math.floor(Math.random() * availablePregi.length);
    const pregioEstratto = availablePregi[pregioIndex];

    let difettoEstratto = null;
    if (availableDifetti.length) {
      const difettoIndex = Math.floor(Math.random() * availableDifetti.length);
      difettoEstratto = availableDifetti[difettoIndex];
    }

    setPendingRapidExtraction({
      pregio: pregioEstratto,
      difetto: difettoEstratto,
    });
  };

  const applyPendingRapidExtraction = () => {
    if (!pendingRapidExtraction?.pregio) {
      return;
    }
    const outstandingAfterPregio = handleSelectPregi(pendingRapidExtraction.pregio);
    if (pendingRapidExtraction.difetto) {
      handleSelectDifetto(pendingRapidExtraction.difetto, {
        outstanding: outstandingAfterPregio,
        decrementOutstanding: true,
      });
    }
    setPendingRapidExtraction(null);
  };

  const handleOpenDescription = (id, isOpen) => {
    setOpenDesc((prev) => ({ ...prev, [id]: isOpen }));
  };

  const checkIsOpenDesc = (id) => openDesc[id] ?? false;

  const estraiDifetti = () => {
    let numeroEstrazioni = 0;
    let minoriEstrattiInt = [...minoriEstratti];
    let outstanding = numDifetti;
    while (numeroEstrazioni < numDifetti) {
      const cartaEstratta = estraiTaroccoMinore();
      if (!minoriEstrattiInt.find((e) => e.id === cartaEstratta.id)) {
        minoriEstrattiInt.push(cartaEstratta);
        dispatch(addMinoreEstratto(cartaEstratta));
        const difettoEstratto = DifettiDb.find(
          (dif) =>
            dif.carta === cartaEstratta.numeroCarta &&
            dif.seme === cartaEstratta.semeCarta
        );
        if (difettoEstratto) {
          outstanding = handleSelectDifetto(difettoEstratto, {
            outstanding: outstanding,
            decrementOutstanding: true,
          });
        }
        numeroEstrazioni++;
      }
    }
    dispatch(setNumDifetti(0));
  };

  const resetPregiDifetti = () => {
    dispatch(resetProfessione());
    dispatch(resetMinoriEstratti());
    dispatch(setNumPregi(0));
    dispatch(setNumDifetti(0));
    dispatch(resetPregi());
    dispatch(resetDifetti());
    dispatch(resetAllAbilita());
    dispatch(setAbilita(abilitaStoricoTarocco));
    setManualPregioId("");
    setManualDifettoId("");
    setPendingRapidExtraction(null);
  };

  const renderPregioItem = (pregio, { selectable }) => (
    <div key={`pregio_${pregio.id}`}>
      <ListItem
        secondaryAction={
          <>
            {checkIsOpenDesc(pregio.id) ? (
              <IconButton
                edge="end"
                onClick={() => handleOpenDescription(pregio.id, false)}
              >
                <ExpandLessIcon />
              </IconButton>
            ) : (
              <IconButton
                edge="end"
                onClick={() => handleOpenDescription(pregio.id, true)}
              >
                <ListItemIcon>
                  <ExpandMoreIcon />
                </ListItemIcon>
              </IconButton>
            )}
            {selectable && (
              <IconButton
                edge="end"
                disabled={disableButtonPregi(pregio)}
                onClick={() => handleSelectPregi(pregio)}
              >
                {disableButtonPregi(pregio) ? (
                  <CheckCircleOutlineOutlinedIcon />
                ) : (
                  <AddCircleOutlineIcon />
                )}
              </IconButton>
            )}
          </>
        }
      >
        <ListItemText
          primary={pregio.nome}
          secondary={`Numero difetti: ${pregio.numeroDifetti}`}
        />
      </ListItem>
      <Collapse
        in={checkIsOpenDesc(pregio.id)}
        timeout="auto"
        unmountOnExit
      >
        <List component="div" disablePadding>
          <ListItemText sx={{ pl: 4 }} primary={pregio.descrizione} />
        </List>
      </Collapse>
    </div>
  );

  const listItemDifetto = (dif, selection = false) => (
    <div key={`dif_${dif.id}`}>
      <ListItem
        secondaryAction={
          <>
            {checkIsOpenDesc(dif.id) ? (
              <IconButton
                edge="end"
                onClick={() => handleOpenDescription(dif.id, false)}
              >
                <ExpandLessIcon />
              </IconButton>
            ) : (
              <IconButton
                edge="end"
                onClick={() => handleOpenDescription(dif.id, true)}
              >
                <ListItemIcon>
                  <ExpandMoreIcon />
                </ListItemIcon>
              </IconButton>
            )}
            {selection && (
              <IconButton
                edge="end"
                disabled={difetti.some((d) => d.id === dif.id)}
                onClick={() => handleSelectDifetto(dif)}
              >
                {difetti.some((d) => d.id === dif.id) ? (
                  <CheckCircleOutlineOutlinedIcon />
                ) : (
                  <AddCircleOutlineIcon />
                )}
              </IconButton>
            )}
          </>
        }
      >
        <ListItemText primary={dif.nome} />
      </ListItem>
      <Collapse
        in={checkIsOpenDesc(dif.id)}
        timeout="auto"
        unmountOnExit
      >
        <List component="div" disablePadding>
          <ListItemText sx={{ pl: 4 }} primary={dif.descrizione} />
        </List>
      </Collapse>
    </div>
  );

  const renderListMode = () => (
    <>
      <Grid container spacing={1}>
        <Grid item xs>
          {minoriEstratti.length > 0 && (
            <MinoriPaper minoriEstratti={minoriEstratti} />
          )}
        </Grid>
      </Grid>
      <Grid container spacing={2}>
        <Grid item xs>
          {pregi.length > 0 && (
            <>
              <Typography variant="body2" color="text.secondary">
                Pregi selezionati ({pregi.length})
              </Typography>
              <List>
                {pregi.map((pregio) => (
                  <ListItem key={`selected_pregio_${pregio.id}`}>
                    <ListItemText
                      primary={pregio.nome}
                      secondary={pregio.descrizione}
                    />
                  </ListItem>
                ))}
              </List>
            </>
          )}
          <Stack
            direction="row"
            spacing={1}
            alignItems="center"
            justifyContent="space-between"
          >
            <Typography variant="body2" color="text.secondary">
              Catalogo Pregi
            </Typography>
            <IconButton
              size="small"
              aria-label="catalogo pregi"
              onClick={() => setShowPregiCatalog((prev) => !prev)}
            >
              {showPregiCatalog ? <ExpandLessIcon /> : <ExpandMoreIcon />}
            </IconButton>
          </Stack>
          <Collapse in={showPregiCatalog} timeout="auto" unmountOnExit>
            <List component="nav">
              {filteredPregi.map((pr) =>
                renderPregioItem(pr, { selectable: true })
              )}
            </List>
          </Collapse>
        </Grid>
        <Grid item xs>
          <Typography variant="body2" color="text.secondary">
            Difetti selezionati ({difetti.length}) — da assegnare: {numDifetti}
          </Typography>
          {difetti.length > 0 && (
            <List>
              {difetti.map((dif) => (
                <ListItem key={`selected_${dif.id}`}>
                  <ListItemText primary={dif.nome} secondary={dif.descrizione} />
                </ListItem>
              ))}
            </List>
          )}
          <Stack spacing={2} direction="row" flexWrap="wrap" sx={{ mt: 1 }}>
            <Button
              size="small"
              disabled={numDifetti === 0}
              variant="contained"
              onClick={estraiDifetti}
            >
              Estrai Difetto (tarocco)
            </Button>
            <Tooltip title="La modifica comporta il reset dei seguenti campi: Professione, Abilità">
              <Button size="small" variant="contained" onClick={resetPregiDifetti}>
                Reset
              </Button>
            </Tooltip>
          </Stack>
          <Stack
            direction="row"
            spacing={1}
            alignItems="center"
            justifyContent="space-between"
            sx={{ mt: 2 }}
          >
            <Typography variant="body2" color="text.secondary">
              Catalogo Difetti
            </Typography>
            <IconButton
              size="small"
              aria-label="catalogo difetti"
              onClick={() => setShowDifettiCatalog((prev) => !prev)}
            >
              {showDifettiCatalog ? <ExpandLessIcon /> : <ExpandMoreIcon />}
            </IconButton>
          </Stack>
          <Collapse in={showDifettiCatalog} timeout="auto" unmountOnExit>
            {DifettiDb.filter((t) => t.ambientazioneRef === ambientazione)
              .length > 0 && (
              <>
                <Typography variant="caption" color="text.secondary">
                  Difetti specifici per ambientazione
                </Typography>
                <List>
                  {DifettiDb.filter(
                    (t) => t.ambientazioneRef === ambientazione
                  ).map((diff) => listItemDifetto(diff, true))}
                </List>
              </>
            )}
            <Typography variant="caption" color="text.secondary">
              Difetti generali
            </Typography>
            <List>
              {DifettiDb.filter((t) => !t.ambientazioneRef).map((diff) =>
                listItemDifetto(diff, true)
              )}
            </List>
          </Collapse>
        </Grid>
      </Grid>
    </>
  );

  const renderRandomMode = () => (
    <Stack spacing={3}>
      <Stack spacing={2} direction="row" flexWrap="wrap" alignItems="center">
        <Button
          size="small"
          variant="contained"
          onClick={handleRapidExtraction}
          disabled={!availablePregi.length}
        >
          Estrai
        </Button>
        <Button
          size="small"
          variant="contained"
          color="success"
          onClick={applyPendingRapidExtraction}
          disabled={!pendingRapidExtraction}
        >
          Applica estrazione
        </Button>
        {!availablePregi.length && (
          <Typography variant="caption" color="text.secondary">
            Nessun pregio disponibile per l'estrazione.
          </Typography>
        )}
      </Stack>
      {pendingRapidExtraction && (
        <Box>
          <Typography variant="body2" fontWeight="bold">
            Pregio estratto: {pendingRapidExtraction.pregio.nome}
          </Typography>
          <Typography variant="caption" color="text.secondary">
            {pendingRapidExtraction.pregio.descrizione}
          </Typography>
          <Typography variant="body2" fontWeight="bold" sx={{ mt: 1 }}>
            Difetto estratto:
            {pendingRapidExtraction.difetto
              ? ` ${pendingRapidExtraction.difetto.nome}`
              : " nessun difetto disponibile"}
          </Typography>
          {pendingRapidExtraction.difetto && (
            <Typography variant="caption" color="text.secondary">
              {pendingRapidExtraction.difetto.descrizione}
            </Typography>
          )}
        </Box>
      )}
      <Stack direction="row" spacing={2} flexWrap="wrap">
        <Tooltip title="La modifica comporta il reset dei seguenti campi: Professione, Abilità">
          <Button size="small" variant="contained" onClick={resetPregiDifetti}>
            Reset
          </Button>
        </Tooltip>
        <Typography variant="caption" color="text.secondary">
          Pregi selezionati: {pregi.length} | Difetti selezionati: {difetti.length}
        </Typography>
      </Stack>
    </Stack>
  );

  const renderCustomMode = () => (
    <Stack spacing={3}>
      <Box>
        <Typography variant="body2" color="text.secondary">
          Selezione Pregio
        </Typography>
        <Stack direction="row" spacing={2} flexWrap="wrap" alignItems="center">
          <FormControl size="small" sx={{ minWidth: 240 }}>
            <InputLabel id="manual-pregio-label">Pregio</InputLabel>
            <Select
              labelId="manual-pregio-label"
              value={manualPregioId}
              label="Pregio"
              onChange={(event) => setManualPregioId(event.target.value)}
            >
              <MenuItem value="">
                <em>Seleziona pregio</em>
              </MenuItem>
              {availablePregi.map((pregio) => (
                <MenuItem key={pregio.id} value={pregio.id}>
                  {pregio.nome}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
          {manualPregioId && (
            <Typography variant="caption" color="text.secondary">
              {
                filteredPregi.find((p) => p.id === manualPregioId)?.descrizione ||
                ""
              }
            </Typography>
          )}
          <Button
            size="small"
            variant="contained"
            disabled={!manualPregioId}
            onClick={() => {
              const pregio = filteredPregi.find((p) => p.id === manualPregioId);
              handleSelectPregi(pregio);
              setManualPregioId("");
            }}
          >
            Aggiungi Pregio
          </Button>
        </Stack>
      </Box>
      <Box>
        <Typography variant="body2" color="text.secondary">
          Selezione Difetto
        </Typography>
        <Stack direction="row" spacing={2} flexWrap="wrap" alignItems="center">
          <FormControl size="small" sx={{ minWidth: 240 }}>
            <InputLabel id="manual-difetto-label">Difetto</InputLabel>
            <Select
              labelId="manual-difetto-label"
              value={manualDifettoId}
              label="Difetto"
              onChange={(event) => setManualDifettoId(event.target.value)}
            >
              <MenuItem value="">
                <em>Seleziona difetto</em>
              </MenuItem>
              {availableDifetti.map((difetto) => (
                <MenuItem key={difetto.id} value={difetto.id}>
                  {difetto.nome}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
          {manualDifettoId && (
            <Typography variant="caption" color="text.secondary">
              {
                filteredDifetti.find((d) => d.id === manualDifettoId)?.descrizione ||
                ""
              }
            </Typography>
          )}
          <Button
            size="small"
            variant="contained"
            disabled={!manualDifettoId}
            onClick={() => {
              const difetto = filteredDifetti.find((d) => d.id === manualDifettoId);
              handleSelectDifetto(difetto);
              setManualDifettoId("");
            }}
          >
            Aggiungi Difetto
          </Button>
        </Stack>
      </Box>
      <Stack direction="row" spacing={2}>
        <Tooltip title="La modifica comporta il reset dei seguenti campi: Professione, Abilità">
          <Button size="small" variant="contained" onClick={resetPregiDifetti}>
            Reset
          </Button>
        </Tooltip>
      </Stack>
    </Stack>
  );

  return (
    <Card headerText="Pregi e Difetti">
      <Stack spacing={3}>
        <Tabs
          value={viewMode}
          onChange={(event, newValue) => setViewMode(newValue)}
          variant="scrollable"
          scrollButtons="auto"
        >
          <Tab label="Lista" value={MODE_LIST} />
          <Tab label="Estrazione rapida" value={MODE_RANDOM} />
          <Tab label="Selezione personalizzata" value={MODE_CUSTOM} />
        </Tabs>
        {viewMode === MODE_LIST && renderListMode()}
        {viewMode === MODE_RANDOM && renderRandomMode()}
        {viewMode === MODE_CUSTOM && renderCustomMode()}
      </Stack>
    </Card>
  );
}

export default PregiDifettiComponent;
