import { useEffect, useMemo, useState } from "react";
import AddCircleOutlineIcon from "@mui/icons-material/AddCircleOutline";
import RemoveCircleOutline from "@mui/icons-material/RemoveCircleOutline";
import { Tooltip } from "@mui/material";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import Chip from "@mui/material/Chip";
import FormControl from "@mui/material/FormControl";
import Grid from "@mui/material/Grid";
import IconButton from "@mui/material/IconButton";
import InputLabel from "@mui/material/InputLabel";
import List from "@mui/material/List";
import ListItem from "@mui/material/ListItem";
import ListItemText from "@mui/material/ListItemText";
import MenuItem from "@mui/material/MenuItem";
import Paper from "@mui/material/Paper";
import Select from "@mui/material/Select";
import Stack from "@mui/material/Stack";
import Tab from "@mui/material/Tab";
import Tabs from "@mui/material/Tabs";
import Typography from "@mui/material/Typography";
import { useDispatch, useSelector } from "react-redux";
import Card from "../../components/Card";
import MinoriPaper from "../../components/MinoriPaper";
import CaratteristicheProfiles from "../../db/CaratteristicheProfiles";
import { resetAllAbilita } from "../../redux/slices/abilitaSlice";
import {
  addCaratteristicaAggiornata,
  addMinoreEstratto,
  restoreCaratteristicheByTaroccoStorico,
  resetCaratteristiche,
  resetCaratteristicheAggiornate,
  resetMinoriEstratti,
  resetSemiBonus,
  resetSemiMalus,
  setBtnBonusPressed,
  setBtnMalusPressed,
  setCaratteristiche,
  setCaratteristicheUpdateStorico,
  setMinoriEstratti,
  setSemiBonus,
  setSemiMalus,
  updateCaratteristica,
  updateSemiBonus,
  updateSemiMalus,
} from "../../redux/slices/caratteristicheSlice";
import { resetDisturbiMentali } from "../../redux/slices/disturbiMentaliSlice";
import { resetDoni } from "../../redux/slices/doniSlice";
import { resetAllPregiDifetti } from "../../redux/slices/pregiDifettiSlice";
import { resetProfessione } from "../../redux/slices/professioneSlice";
import {
  estraiTaroccoMinore,
  getDescNumeroCarta,
  getDescSemeCarta,
} from "../../utils/random";

const MODE_RANDOM = "random";
const MODE_PROFILES = "profiles";
const MODE_MANUAL = "manual";

const BONUS_DRAW_COUNT = 4;
const MALUS_DRAW_COUNT = 5;

const SUIT_ORDER = ["Cuori", "Quadri", "Fiori", "Picche"];
const SUIT_EMOJI = {
  Cuori: "♥",
  Quadri: "♦",
  Fiori: "♣",
  Picche: "♠",
};

const createEmptySemiTotals = () => [
  { id: "Cuori", valore: 0 },
  { id: "Quadri", valore: 0 },
  { id: "Fiori", valore: 0 },
  { id: "Picche", valore: 0 },
];

const createEmptySelectionArray = (size) => Array(size).fill("");

const createCardFromDefinition = (numeroCarta, semeCarta) => ({
  id: `${numeroCarta}${getDescSemeCarta(semeCarta)}`,
  numeroCarta,
  semeCarta,
  descNumeroCarta: getDescNumeroCarta(numeroCarta),
  descSemeCarta: getDescSemeCarta(semeCarta),
});

const calculateSemiTotals = (cards) => {
  const totals = createEmptySemiTotals();
  cards.forEach((card) => {
    const index = totals.findIndex((entry) => entry.id === card.descSemeCarta);
    if (index !== -1) {
      const points = card.numeroCarta > 10 ? 2 : 1;
      totals[index] = {
        ...totals[index],
        valore: totals[index].valore + points,
      };
    }
  });
  return totals;
};

const getSuitTotalsForDefinitions = (cardDefs) => {
  const cards = cardDefs.map((card) =>
    createCardFromDefinition(card.numeroCarta, card.semeCarta)
  );
  const totals = calculateSemiTotals(cards);
  return totals.reduce((acc, entry) => {
    acc[entry.id] = entry.valore;
    return acc;
  }, {});
};

const formatProfileLabel = (profile) => {
  const bonusTotals = getSuitTotalsForDefinitions(profile.bonusCards);
  const malusTotals = getSuitTotalsForDefinitions(profile.malusCards);
  const summary = SUIT_ORDER.map(
    (suit) =>
      `${SUIT_EMOJI[suit]} +${bonusTotals[suit] ?? 0}/-${malusTotals[suit] ?? 0}`
  ).join(" ");
  const rankPrefix = profile.rank ? `[${profile.rank}] ` : "";
  return `${rankPrefix}${profile.title} — ${summary}`;
};

function CaratteristicheComponent() {
  const {
    caratteristiche,
    caratteristicheTaroccoStorico,
    minoriEstratti,
    semiBonus,
    semiMalus,
    caratteristicheAggiornate,
    btnBonusPressed,
    btnMalusPressed,
  } = useSelector((state) => state.caratteristiche);
  const dispatch = useDispatch();

  const [viewMode, setViewMode] = useState(MODE_RANDOM);
  const [manualBonusSelections, setManualBonusSelections] = useState(() =>
    createEmptySelectionArray(BONUS_DRAW_COUNT)
  );
  const [manualMalusSelections, setManualMalusSelections] = useState(() =>
    createEmptySelectionArray(MALUS_DRAW_COUNT)
  );
  const [manualBonusApplied, setManualBonusApplied] = useState(false);
  const [selectedProfileId, setSelectedProfileId] = useState("");
  const [pendingProfileMalus, setPendingProfileMalus] = useState([]);

  const cardOptions = useMemo(() => {
    const options = [];
    for (let seme = 1; seme <= 4; seme += 1) {
      for (let numero = 1; numero <= 14; numero += 1) {
        const label = `${getDescSemeCarta(seme)} ${getDescNumeroCarta(numero)}`;
        options.push({
          value: `${seme}-${numero}`,
          label,
          semeCarta: seme,
          numeroCarta: numero,
          points: numero > 10 ? 2 : 1,
        });
      }
    }
    return options;
  }, []);

  const selectedProfile = useMemo(
    () => CaratteristicheProfiles.find((profile) => profile.id === selectedProfileId),
    [selectedProfileId]
  );

  const profileLabelMap = useMemo(() => {
    const labels = {};
    CaratteristicheProfiles.forEach((profile) => {
      labels[profile.id] = formatProfileLabel(profile);
    });
    return labels;
  }, []);

  useEffect(() => {
    setSelectedProfileId("");
    setPendingProfileMalus([]);
    setManualBonusSelections(createEmptySelectionArray(BONUS_DRAW_COUNT));
    setManualMalusSelections(createEmptySelectionArray(MALUS_DRAW_COUNT));
    setManualBonusApplied(false);
  }, [viewMode]);

  const visibleButtonBonus = (seme) => isPuntiBonus(seme) > 0;

  const anyMalusAvailable = semiMalus.some((t) => t.valore > 0);

  const hasAvailableCharacteristicForSem = (semeId) =>
    caratteristiche.some(
      (car) =>
        car.seme === semeId &&
        !caratteristicheAggiornate.some((updated) => updated.id === car.id)
    );

  const visibleButtonMalus = (seme) => {
    const sem = semiMalus.find((t) => t.id === seme);
    if (sem?.valore > 0) {
      return true;
    }
    if (!anyMalusAvailable) {
      return false;
    }
    const suitsWithAssignableMalus = semiMalus.some(
      (s) => s.valore > 0 && hasAvailableCharacteristicForSem(s.id)
    );
    if (suitsWithAssignableMalus) {
      return false;
    }
    return true;
  };

  const disableButtonMalus = (cara) =>
    caratteristicheAggiornate.some((t) => cara.id === t.id);

  const handleResetMinoriEstratti = () => {
    dispatch(resetDoni());
    dispatch(resetDisturbiMentali());
    dispatch(resetMinoriEstratti());
    dispatch(resetSemiBonus());
    dispatch(resetSemiMalus());
    dispatch(setBtnMalusPressed(false));
    dispatch(setBtnBonusPressed(false));
    dispatch(resetCaratteristiche());
    dispatch(resetAllAbilita());
    dispatch(resetProfessione());
    dispatch(resetAllPregiDifetti());
    dispatch(resetCaratteristicheAggiornate());
    dispatch(setCaratteristiche(caratteristicheTaroccoStorico));
    dispatch(setCaratteristicheUpdateStorico());
    setManualBonusSelections(createEmptySelectionArray(BONUS_DRAW_COUNT));
    setManualMalusSelections(createEmptySelectionArray(MALUS_DRAW_COUNT));
    setManualBonusApplied(false);
    setSelectedProfileId("");
    setPendingProfileMalus([]);
  };

  const addReduceCaratteristica = (caratt, positive) => {
    let car = { ...caratteristiche.find((t) => t.id === caratt.id) };
    if (positive) {
      car.valore += 1;
    } else {
      car.valore -= 1;
    }
    dispatch(updateCaratteristica(car));
    dispatch(addCaratteristicaAggiornata(car));
    if (positive) {
      let sem = { ...semiBonus.find((t) => t.id === caratt.seme) };
      sem.valore -= 1;
      dispatch(updateSemiBonus(sem));
    } else {
      let sem = semiMalus.find((t) => t.id === caratt.seme);
      if (!sem || sem.valore <= 0) {
        sem = semiMalus.find((t) => t.valore > 0);
      }
      if (!sem || sem.valore <= 0) {
        return;
      }
      const updatedSem = { ...sem, valore: sem.valore - 1 };
      dispatch(updateSemiMalus(updatedSem));
    }
    dispatch(setCaratteristicheUpdateStorico());
    dispatch(resetDoni());
    dispatch(resetDisturbiMentali());
  };

  const visualizzaModificare = (car) => {
    let carVisual = car.valore;
    if (car.modificatore != null) {
      const mod = car.modificatore(car.valore);
      carVisual = `${carVisual} (${mod})`;
    }
    return carVisual;
  };

  const handleEstraiBonusMalus = (bonus) => {
    bonus
      ? dispatch(setBtnBonusPressed(true))
      : dispatch(setBtnMalusPressed(true));
    let numeroEstrazioni = 0;
    const numeroTotaleEstrazioni = bonus ? 3 : 4;
    let minoriEstrattiInt = [...minoriEstratti];
    let updatedSemiBonusMalus = [
      { id: "Cuori", valore: 0 },
      { id: "Quadri", valore: 0 },
      { id: "Fiori", valore: 0 },
      { id: "Picche", valore: 0 },
    ];
    while (numeroEstrazioni <= numeroTotaleEstrazioni) {
      const cartaEstratta = estraiTaroccoMinore();
      if (!minoriEstrattiInt.find((e) => e.id === cartaEstratta.id)) {
        minoriEstrattiInt.push(cartaEstratta);
        dispatch(addMinoreEstratto(cartaEstratta));
        const bonusMalus = cartaEstratta.numeroCarta > 10 ? 2 : 1;
        const cartaEstrattaSeme = cartaEstratta.descSemeCarta;
        let seme = {
          ...updatedSemiBonusMalus.find((t) => t.id === cartaEstrattaSeme),
        };
        seme.valore += bonusMalus;
        updatedSemiBonusMalus = updatedSemiBonusMalus.map((ca) =>
          ca.id === seme.id ? seme : ca
        );
        numeroEstrazioni++;
      }
    }
    bonus
      ? dispatch(setSemiBonus(updatedSemiBonusMalus))
      : dispatch(setSemiMalus(updatedSemiBonusMalus));
  };

  const descPuntiBonusMalus = (seme) => {
    let desc = seme;
    if (btnBonusPressed && isPuntiBonus(seme)) {
      desc = `${seme} (Punti da assegnare: ${getPuntiBonus(seme)})`;
    } else if (btnMalusPressed && isPuntiMalus(seme)) {
      desc = `${seme} (Punti da assegnare: ${getPuntiMalus(seme)})`;
    }
    return desc;
  };

  const isPuntiBonus = (seme) => {
    const sem = semiBonus.find((t) => t.id === seme);
    return sem.valore > 0;
  };

  const isPuntiMalus = (seme) => {
    const sem = semiMalus.find((t) => t.id === seme);
    return sem.valore > 0;
  };

  const getPuntiBonus = (seme) => {
    const sem = semiBonus.find((t) => t.id === seme);
    return sem.valore;
  };

  const getPuntiMalus = (seme) => {
    const sem = semiMalus.find((t) => t.id === seme);
    return sem.valore;
  };

  const checkIfBonusPointArePresent = () => semiBonus.some((t) => t.valore > 0);

  const abilitateBtnMalus = () => {
    let test = true;
    if (btnBonusPressed && !checkIfBonusPointArePresent() && !btnMalusPressed) {
      test = false;
    }
    return test;
  };

  const applyBonusCards = (bonusCardsDefs) => {
    const bonusCards = bonusCardsDefs.map((card) =>
      createCardFromDefinition(card.numeroCarta, card.semeCarta)
    );
    dispatch(setMinoriEstratti(bonusCards));
    dispatch(setSemiBonus(calculateSemiTotals(bonusCards)));
    dispatch(setSemiMalus(createEmptySemiTotals()));
    dispatch(setBtnBonusPressed(bonusCards.length > 0));
    dispatch(setBtnMalusPressed(false));
    dispatch(resetCaratteristicheAggiornate());
    dispatch(restoreCaratteristicheByTaroccoStorico());
    dispatch(setCaratteristicheUpdateStorico());
  };

  const applyMalusCards = (malusCardsDefs) => {
    const malusCards = malusCardsDefs.map((card) =>
      createCardFromDefinition(card.numeroCarta, card.semeCarta)
    );
    const existingWithoutMalus = minoriEstratti.filter(
      (card) => !malusCards.some((malus) => malus.id === card.id)
    );
    const updatedCards = [...existingWithoutMalus, ...malusCards];
    dispatch(setMinoriEstratti(updatedCards));
    dispatch(setSemiMalus(calculateSemiTotals(malusCards)));
    dispatch(setBtnMalusPressed(true));
  };

  const getManualAvailableOptions = (type, index) => {
    const used = new Set();
    manualBonusSelections.forEach((value, idx) => {
      if (value && !(type === "bonus" && idx === index)) {
        used.add(value);
      }
    });
    manualMalusSelections.forEach((value, idx) => {
      if (value && !(type === "malus" && idx === index)) {
        used.add(value);
      }
    });
    return cardOptions.filter((option) => !used.has(option.value));
  };

  const handleManualSelectChange = (type, index, value) => {
    if (type === "bonus") {
      setManualBonusSelections((prev) => {
        const next = [...prev];
        next[index] = value;
        return next;
      });
    } else {
      setManualMalusSelections((prev) => {
        const next = [...prev];
        next[index] = value;
        return next;
      });
    }
  };

  const manualSelectionsCombined = [
    ...manualBonusSelections,
    ...manualMalusSelections,
  ].filter(Boolean);

  const manualHasDuplicates =
    new Set(manualSelectionsCombined).size !== manualSelectionsCombined.length;

  const manualBonusReady =
    manualBonusSelections.every((value) => !!value) && !manualHasDuplicates;
  const manualMalusReady =
    manualMalusSelections.every((value) => !!value) && !manualHasDuplicates;

  const convertValueToDefinition = (value) => {
    const [semeCarta, numeroCarta] = value.split("-").map(Number);
    return { numeroCarta, semeCarta };
  };

  const handleProfileChange = (event) => {
    const profileId = event.target.value;
    setSelectedProfileId(profileId);
    if (!profileId) {
      setPendingProfileMalus([]);
      return;
    }
    const profile = CaratteristicheProfiles.find((p) => p.id === profileId);
    if (profile) {
      applyBonusCards(profile.bonusCards);
      setPendingProfileMalus(profile.malusCards);
      setManualBonusSelections(createEmptySelectionArray(BONUS_DRAW_COUNT));
      setManualMalusSelections(createEmptySelectionArray(MALUS_DRAW_COUNT));
      setManualBonusApplied(false);
    }
  };

  const handleApplyProfileMalus = () => {
    if (!pendingProfileMalus.length || abilitateBtnMalus()) {
      return;
    }
    applyMalusCards(pendingProfileMalus);
    setPendingProfileMalus([]);
  };

  const handleApplyManualBonus = () => {
    if (!manualBonusReady) {
      return;
    }
    const bonusCardsDefs = manualBonusSelections.map(convertValueToDefinition);
    applyBonusCards(bonusCardsDefs);
    setManualBonusApplied(true);
    setManualMalusSelections(createEmptySelectionArray(MALUS_DRAW_COUNT));
  };

  const handleApplyManualMalus = () => {
    if (!manualBonusApplied || !manualMalusReady || abilitateBtnMalus() || btnMalusPressed) {
      return;
    }
    const malusCardsDefs = manualMalusSelections.map(convertValueToDefinition);
    applyMalusCards(malusCardsDefs);
  };

  const resetTooltipTitle =
    "La modifica comporta il reset dei seguenti campi: Professione, Abilità, Caratteristiche, Pregi e Difetti, Doni e Disturbi Mentali";

  const renderResetButton = () => (
    <Tooltip title={resetTooltipTitle}>
      <Button size="small" variant="contained" onClick={handleResetMinoriEstratti}>
        Reset
      </Button>
    </Tooltip>
  );

  const renderRandomControls = () => (
    <Grid container spacing={3}>
      <Grid item xs>
        <Stack spacing={3} direction="row" flexWrap="wrap">
          <Button
            disabled={btnBonusPressed}
            size="small"
            variant="contained"
            onClick={() => handleEstraiBonusMalus(true)}
          >
            Estrai Bonus
          </Button>
          <Button
            disabled={abilitateBtnMalus()}
            size="small"
            variant="contained"
            onClick={() => handleEstraiBonusMalus(false)}
          >
            Estrai Malus
          </Button>
          {renderResetButton()}
        </Stack>
      </Grid>
    </Grid>
  );

  const renderProfileControls = () => {
    const bonusCardsPreview =
      selectedProfile?.bonusCards.map((card) =>
        createCardFromDefinition(card.numeroCarta, card.semeCarta)
      ) ?? [];
    const malusCardsPreview =
      selectedProfile?.malusCards.map((card) =>
        createCardFromDefinition(card.numeroCarta, card.semeCarta)
      ) ?? [];
    return (
      <Stack spacing={2}>
        <Typography variant="body2">
          Scegli un profilo per utilizzare combinazioni di carte coerenti con la
          probabilità standard. Le carte bonus vengono applicate subito; i malus
          sono disponibili quando tutti i bonus sono stati assegnati.
        </Typography>
        <FormControl size="small" sx={{ minWidth: 280 }}>
          <InputLabel id="profile-select-label">Profilo</InputLabel>
          <Select
            labelId="profile-select-label"
            id="profile-select"
            value={selectedProfileId}
            label="Profilo"
            onChange={handleProfileChange}
          >
            <MenuItem value="">
              <em>Seleziona un profilo</em>
            </MenuItem>
            {CaratteristicheProfiles.map((profile) => (
              <MenuItem key={profile.id} value={profile.id}>
                {profileLabelMap[profile.id]}
              </MenuItem>
            ))}
          </Select>
        </FormControl>
        {selectedProfile && (
          <Paper variant="outlined" sx={{ p: 2 }}>
            <Stack spacing={2}>
              <Typography variant="subtitle1">
                {profileLabelMap[selectedProfile.id]}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                {selectedProfile.description}
              </Typography>
              <Box>
                <Typography variant="caption" color="success.main">
                  Carte Bonus
                </Typography>
                <Stack direction="row" spacing={1} flexWrap="wrap">
                  {bonusCardsPreview.map((card) => (
                    <Chip
                      key={`bonus-${selectedProfile.id}-${card.id}`}
                      size="small"
                      color="success"
                      label={`+${card.numeroCarta > 10 ? 2 : 1} ${
                        card.descNumeroCarta
                      } ${card.descSemeCarta}`}
                    />
                  ))}
                </Stack>
              </Box>
              <Box>
                <Typography variant="caption" color="error.main">
                  Carte Malus
                </Typography>
                <Stack direction="row" spacing={1} flexWrap="wrap">
                  {malusCardsPreview.map((card) => (
                    <Chip
                      key={`malus-${selectedProfile.id}-${card.id}`}
                      size="small"
                      color="error"
                      label={`-${card.numeroCarta > 10 ? 2 : 1} ${
                        card.descNumeroCarta
                      } ${card.descSemeCarta}`}
                    />
                  ))}
                </Stack>
              </Box>
              <Stack direction="row" spacing={2} flexWrap="wrap">
                <Button
                  size="small"
                  variant="contained"
                  onClick={handleApplyProfileMalus}
                  disabled={
                    pendingProfileMalus.length === 0 ||
                    abilitateBtnMalus() ||
                    btnMalusPressed
                  }
                >
                  Applica malus del profilo
                </Button>
                {pendingProfileMalus.length > 0 && abilitateBtnMalus() && (
                  <Typography variant="caption" color="text.secondary">
                    Assegna tutti i punti bonus prima di applicare i malus.
                  </Typography>
                )}
              </Stack>
            </Stack>
          </Paper>
        )}
        <Stack direction="row" spacing={2}>
          {renderResetButton()}
        </Stack>
      </Stack>
    );
  };

  const renderManualControls = () => (
    <Stack spacing={2}>
      <Typography variant="body2">
        Seleziona manualmente le carte estratte. Prima applica le carte bonus e,
        una volta assegnati tutti i punti positivi, definisci i malus.
      </Typography>
      <Box>
        <Typography variant="subtitle2">Carte Bonus</Typography>
        <Stack direction="row" spacing={1} flexWrap="wrap">
          {manualBonusSelections.map((value, index) => (
            <FormControl
              key={`manual-bonus-${index}`}
              size="small"
              sx={{ minWidth: 200, mr: 1, mt: 1 }}
            >
              <InputLabel id={`manual-bonus-${index}-label`}>
                Bonus {index + 1}
              </InputLabel>
              <Select
                labelId={`manual-bonus-${index}-label`}
                value={value}
                label={`Bonus ${index + 1}`}
                onChange={(event) =>
                  handleManualSelectChange("bonus", index, event.target.value)
                }
              >
                <MenuItem value="">
                  <em>Seleziona carta</em>
                </MenuItem>
                {getManualAvailableOptions("bonus", index).map((option) => (
                  <MenuItem key={option.value} value={option.value}>
                    {`${option.label} (+${option.points})`}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          ))}
        </Stack>
      </Box>
      <Stack direction="row" spacing={2} flexWrap="wrap">
        <Button
          size="small"
          variant="contained"
          onClick={handleApplyManualBonus}
          disabled={!manualBonusReady}
        >
          Applica bonus
        </Button>
        {!manualBonusReady && (
          <Typography variant="caption" color="text.secondary">
            Seleziona tutte le carte bonus prima di applicarle.
          </Typography>
        )}
      </Stack>
      {manualBonusApplied && (
        <>
          <Box>
            <Typography variant="subtitle2">Carte Malus</Typography>
            <Stack direction="row" spacing={1} flexWrap="wrap">
              {manualMalusSelections.map((value, index) => (
                <FormControl
                  key={`manual-malus-${index}`}
                  size="small"
                  sx={{ minWidth: 200, mr: 1, mt: 1 }}
                >
                  <InputLabel id={`manual-malus-${index}-label`}>
                    Malus {index + 1}
                  </InputLabel>
                  <Select
                    labelId={`manual-malus-${index}-label`}
                    value={value}
                    label={`Malus ${index + 1}`}
                    onChange={(event) =>
                      handleManualSelectChange("malus", index, event.target.value)
                    }
                  >
                    <MenuItem value="">
                      <em>Seleziona carta</em>
                    </MenuItem>
                    {getManualAvailableOptions("malus", index).map((option) => (
                      <MenuItem key={option.value} value={option.value}>
                        {`${option.label} (-${option.points})`}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
              ))}
            </Stack>
          </Box>
          <Stack direction="row" spacing={2} flexWrap="wrap">
            <Button
              size="small"
              variant="contained"
              onClick={handleApplyManualMalus}
              disabled={
                !manualMalusReady || abilitateBtnMalus() || btnMalusPressed
              }
            >
              Applica malus
            </Button>
            {manualMalusReady && abilitateBtnMalus() && (
              <Typography variant="caption" color="text.secondary">
                Assegna tutti i punti bonus prima di applicare i malus.
              </Typography>
            )}
          </Stack>
        </>
      )}
      {manualHasDuplicates && (
        <Typography variant="caption" color="error">
          Ogni carta può essere scelta una sola volta.
        </Typography>
      )}
      <Stack direction="row" spacing={2}>
        {renderResetButton()}
      </Stack>
    </Stack>
  );

  return (
    <Card headerText="Caratteristiche">
      <Stack spacing={3}>
        <Tabs
          value={viewMode}
          onChange={(event, newValue) => setViewMode(newValue)}
          variant="scrollable"
          scrollButtons="auto"
        >
          <Tab label="Estrazione casuale" value={MODE_RANDOM} />
          <Tab label="Profili predefiniti" value={MODE_PROFILES} />
          <Tab label="Selezione manuale" value={MODE_MANUAL} />
        </Tabs>
        {viewMode === MODE_RANDOM && renderRandomControls()}
        {viewMode === MODE_PROFILES && renderProfileControls()}
        {viewMode === MODE_MANUAL && renderManualControls()}
        <Grid container spacing={1}>
          <Grid item xs>
            <MinoriPaper minoriEstratti={minoriEstratti} />
          </Grid>
        </Grid>
        <Grid container spacing={4}>
          <Grid item xs>
            <Typography variant="h5" component="div">
              {descPuntiBonusMalus("Cuori")}
            </Typography>
          </Grid>
          <Grid item xs>
            <Typography variant="h5" component="div">
              {descPuntiBonusMalus("Quadri")}
            </Typography>
          </Grid>
          <Grid item xs>
            <Typography variant="h5" component="div">
              {descPuntiBonusMalus("Fiori")}
            </Typography>
          </Grid>
          <Grid item xs>
            <Typography variant="h5" component="div">
              {descPuntiBonusMalus("Picche")}
            </Typography>
          </Grid>
        </Grid>
        <Grid container spacing={4}>
          <Grid item xs>
            <List>
              {caratteristiche
                .filter((car) => car.seme === "Cuori")
                .map((car) => (
                  <ListItem
                    key={car.id}
                    secondaryAction={
                      <>
                        {visibleButtonBonus(car.seme) && (
                          <IconButton
                            edge="end"
                            onClick={() => addReduceCaratteristica(car, true)}
                          >
                            <AddCircleOutlineIcon />
                          </IconButton>
                        )}
                        {visibleButtonMalus(car.seme) && (
                          <IconButton
                            edge="end"
                            disabled={disableButtonMalus(car)}
                            onClick={() => addReduceCaratteristica(car, false)}
                          >
                            <RemoveCircleOutline />
                          </IconButton>
                        )}
                      </>
                    }
                  >
                    <ListItemText
                      primary={car.nome}
                      secondary={visualizzaModificare(car)}
                    />
                  </ListItem>
                ))}
            </List>
          </Grid>
          <Grid item xs>
            <List>
              {caratteristiche
                .filter((car) => car.seme === "Quadri")
                .map((car) => (
                  <ListItem
                    key={car.id}
                    secondaryAction={
                      <>
                        {visibleButtonBonus(car.seme) && (
                          <IconButton
                            edge="end"
                            onClick={() => addReduceCaratteristica(car, true)}
                          >
                            <AddCircleOutlineIcon />
                          </IconButton>
                        )}
                        {visibleButtonMalus(car.seme) && (
                          <IconButton
                            edge="end"
                            disabled={disableButtonMalus(car)}
                            onClick={() => addReduceCaratteristica(car, false)}
                          >
                            <RemoveCircleOutline />
                          </IconButton>
                        )}
                      </>
                    }
                  >
                    <ListItemText primary={car.nome} secondary={car.valore} />
                  </ListItem>
                ))}
            </List>
          </Grid>
          <Grid item xs>
            <List>
              {caratteristiche
                .filter((car) => car.seme === "Fiori")
                .map((car) => (
                  <ListItem
                    key={car.id}
                    secondaryAction={
                      <>
                        {visibleButtonBonus(car.seme) && (
                          <IconButton
                            edge="end"
                            onClick={() => addReduceCaratteristica(car, true)}
                          >
                            <AddCircleOutlineIcon />
                          </IconButton>
                        )}
                        {visibleButtonMalus(car.seme) && (
                          <IconButton
                            edge="end"
                            disabled={disableButtonMalus(car)}
                            onClick={() => addReduceCaratteristica(car, false)}
                          >
                            <RemoveCircleOutline />
                          </IconButton>
                        )}
                      </>
                    }
                  >
                    <ListItemText
                      primary={car.nome}
                      secondary={visualizzaModificare(car)}
                    />
                  </ListItem>
                ))}
            </List>
          </Grid>
          <Grid item xs>
            <List>
              {caratteristiche
                .filter((car) => car.seme === "Picche")
                .map((car) => (
                  <ListItem
                    key={car.id}
                    secondaryAction={
                      <>
                        {visibleButtonBonus(car.seme) && (
                          <IconButton
                            edge="end"
                            onClick={() => addReduceCaratteristica(car, true)}
                          >
                            <AddCircleOutlineIcon />
                          </IconButton>
                        )}
                        {visibleButtonMalus(car.seme) && (
                          <IconButton
                            edge="end"
                            disabled={disableButtonMalus(car)}
                            onClick={() => addReduceCaratteristica(car, false)}
                          >
                            <RemoveCircleOutline />
                          </IconButton>
                        )}
                      </>
                    }
                  >
                    <ListItemText
                      primary={car.nome}
                      secondary={visualizzaModificare(car)}
                    />
                  </ListItem>
                ))}
            </List>
          </Grid>
        </Grid>
      </Stack>
    </Card>
  );
}

export default CaratteristicheComponent;
