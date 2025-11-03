import Button from "@mui/material/Button";
import FormControl from "@mui/material/FormControl";
import InputLabel from "@mui/material/InputLabel";
import ListItemText from "@mui/material/ListItemText";
import MenuItem from "@mui/material/MenuItem";
import Select from "@mui/material/Select";
import React from "react";
import { useDispatch, useSelector } from "react-redux";
import Card from "../../components/Card";
import ProfiloAbilitaDb from "../../db/ProfiloAbilita";
import {
  resetAllAbilita,
  setAbilita,
  setListBonusAbilita,
  setProfiloAbilitaSelezionato,
  setAbilitaStoricoProfessione,
} from "../../redux/slices/abilitaSlice";
import { setPuntiAbilitaEta } from "../../redux/slices/etaSlice";
import AbilitaTable from "./AbilitaTable";

function AbilitaComponent() {
  const {
    abilita,
    profiloAbilitaSelezionato,
    listBonusAbilita,
    abilitaStoricoProfessione,
    abilitaStoricoTarocco,
  } = useSelector((state) => state.abilita);
  const { puntiAbilitaEta } = useSelector((state) => state.eta);
  const dispatch = useDispatch();

  const getNumericGrade = (grade) => {
    if (typeof grade === "number") {
      return grade;
    }
    const parsed = Number(grade);
    return Number.isFinite(parsed) ? parsed : null;
  };

  const canReset = React.useMemo(() => {
    const hasAbilityDiff = abilita.some((ability) => {
      const baseGradeValue =
        ability.gradoBase !== undefined ? ability.gradoBase : ability.grado;
      const currentGrade = getNumericGrade(ability.grado);
      const baseGrade = getNumericGrade(baseGradeValue);

      if (currentGrade !== null && baseGrade !== null) {
        return currentGrade !== baseGrade;
      }

      return ability.grado !== baseGradeValue;
    });
    console.log(hasAbilityDiff);

    if (hasAbilityDiff) {
      return true;
    }

    if (profiloAbilitaSelezionato) {
      const profilo = ProfiloAbilitaDb.find(
        (pa) => pa.id === profiloAbilitaSelezionato
      );
      if (profilo) {
        return listBonusAbilita.length !== profilo.arrayBonus.length;
      }
    }

    return listBonusAbilita.length > 0;
  }, [abilita, listBonusAbilita, profiloAbilitaSelezionato]);

  const handleChangeProfiloAbilita = (event) => {
    const profiloAbilita = ProfiloAbilitaDb.find(
      (pa) => pa.id === event.target.value
    );
    dispatch(resetAllAbilita());

    abilitaStoricoTarocco.length > abilitaStoricoProfessione.length
      ? dispatch(setAbilita(abilitaStoricoTarocco))
      : dispatch(setAbilita(abilitaStoricoProfessione));

    dispatch(setProfiloAbilitaSelezionato(profiloAbilita.id));
    dispatch(setListBonusAbilita(profiloAbilita.arrayBonus));
  };

  const handleResetAbilita = () => {
    if (!canReset) {
      return;
    }

    let spentPoints = 0;
    let shouldUpdateAbilities = false;

    const abilitaReset = abilita.map((ability) => {
      const baseGradeValue =
        ability.gradoBase !== undefined ? ability.gradoBase : ability.grado;
      const currentGrade = getNumericGrade(ability.grado);
      const baseGrade = getNumericGrade(baseGradeValue);

      if (currentGrade !== null && baseGrade !== null) {
        if (currentGrade !== baseGrade) {
          shouldUpdateAbilities = true;
        }
        spentPoints += Math.max(0, currentGrade - baseGrade);
        return { ...ability, grado: baseGrade };
      }

      if (ability.grado !== baseGradeValue) {
        shouldUpdateAbilities = true;
      }

      return { ...ability, grado: baseGradeValue };
    });

    const profilo = profiloAbilitaSelezionato
      ? ProfiloAbilitaDb.find((pa) => pa.id === profiloAbilitaSelezionato)
      : null;

    const shouldResetBonus =
      profilo && listBonusAbilita.length !== profilo.arrayBonus.length;

    if (shouldUpdateAbilities) {
      dispatch(setAbilita(abilitaReset));
      dispatch(setAbilitaStoricoProfessione());
    }

    if (spentPoints > 0) {
      dispatch(setPuntiAbilitaEta(puntiAbilitaEta + spentPoints));
    }

    if (shouldResetBonus) {
      dispatch(setListBonusAbilita(profilo.arrayBonus));
    } else if (!profilo && listBonusAbilita.length > 0) {
      dispatch(setListBonusAbilita([]));
    }
  };

  return (
    <Card headerText="Abilità">
      <FormControl fullWidth sx={{ marginBottom: "8px" }}>
        <InputLabel id="label-input-select-abilitaprofiloscelta">
          Seleziona il profilo Abilità
        </InputLabel>
        <Select
          id="select-abilitaprofiloscelta"
          labelId="label-input-select-abilitaprofiloscelta"
          defaultValue=""
          value={profiloAbilitaSelezionato}
          label="Seleziona il profilo Abilità"
          onChange={handleChangeProfiloAbilita}
        >
          {ProfiloAbilitaDb.map((pa) => (
            <MenuItem value={pa.id} key={pa.id}>
              <ListItemText primary={pa.nome} secondary={pa.descrizione} />
            </MenuItem>
          ))}
        </Select>
      </FormControl>
      <Button
        sx={{ marginBottom: "8px" }}
        size="small"
        variant="outlined"
        onClick={handleResetAbilita}
        disabled={!canReset}
      >
        Reset Abilità
      </Button>
      <AbilitaTable
        abilita={abilita}
        listBonusAbilita={listBonusAbilita}
        profiloAbilitaSelezionato={profiloAbilitaSelezionato}
      />
    </Card>
  );
}

export default AbilitaComponent;
