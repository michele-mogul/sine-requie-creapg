import { createSlice } from "@reduxjs/toolkit";
import AbilitaDb from "../../db/Abilita";

const enrichAbility = (ability) => ({
  ...ability,
  gradoBase:
    ability.gradoBase !== undefined ? ability.gradoBase : ability.grado,
  professioneCount:
    ability.professioneCount !== undefined
      ? ability.professioneCount
      : ability.professione
      ? 1
      : 0,
});

const cloneAndEnrichAbilities = (abilities) =>
  abilities.map((ability) => enrichAbility({ ...ability }));

const prestampate = AbilitaDb.filter((ab) => ab.prestampata === true);

const initialState = {
  abilita: cloneAndEnrichAbilities(prestampate),
  abilitaStoricoTarocco: cloneAndEnrichAbilities(prestampate),
  abilitaStoricoProfessione: cloneAndEnrichAbilities(prestampate),
  profiloAbilitaSelezionato: "",
  listBonusAbilita: [],
  abilitaScelteTaroccoPassato: "",
};

export const abilitaSlice = createSlice({
  name: "abilita",
  initialState: initialState,
  reducers: {
    setAbilita: (state, { payload }) => {
      state.abilita = cloneAndEnrichAbilities(payload);
    },

    addAbilita: (state, { payload }) => {
      state.abilita.push(enrichAbility(payload));
    },

    setAbilitaScelteTaroccoPassato: (state, { payload }) => {
      state.abilitaScelteTaroccoPassato = payload;
    },

    updateAbilita: (state, { payload }) => {
      const enriched = enrichAbility(payload);
      state.abilita = state.abilita.map((ab) =>
        ab.id === enriched.id ? enriched : ab
      );
    },

    saveOrUpdateAbilita: (state, { payload }) => {
      const ability = state.abilita.find((t) => t.id === payload.id);
      ability.grado = ability.grado ?? 0
      if (ability) {
        let abilityCopy = enrichAbility(payload);
        abilityCopy.counterFallimento += 5;
        if (abilityCopy.counterFallimento >= 9) {
          abilityCopy.grado += 1;
          abilityCopy.counterFallimento = abilityCopy.counterFallimento - 9;
        }
        state.abilita = state.abilita.map((ab) =>
          ab.id === payload.id ? abilityCopy : ab
        );
      } else {
        state.abilita.push(enrichAbility(payload));
      }
    },

    setProfiloAbilitaSelezionato: (state, { payload }) => {
      state.profiloAbilitaSelezionato = payload;
    },

    setListBonusAbilita: (state, { payload }) => {
      state.listBonusAbilita = payload;
    },

    removeBonusFromListBonusAbilita: (state, { payload }) => {
      state.listBonusAbilita = state.listBonusAbilita.filter(
        (bn) => bn.id !== payload.id
      );
    },
    resetAbilita: (state, { payload }) => {
      state.abilita = state.abilita.map((ab) =>
        ab.id === payload.id
          ? enrichAbility({ ...AbilitaDb.find((t) => t.id === payload.id) })
          : ab
      );
    },
    resetAllAbilita: (state) => {
      state.abilita = cloneAndEnrichAbilities(prestampate);
    },

    setAbilitaStoricoTarocco: (state) => {
      state.abilitaStoricoTarocco = cloneAndEnrichAbilities(state.abilita);
    },

    setAbilitaStoricoProfessione: (state) => {
      state.abilitaStoricoProfessione = cloneAndEnrichAbilities(state.abilita);
    },

    resetAbilitaScelteTaroccoPassato: (state) => {
      state.abilitaScelteTaroccoPassato = "";
    },
    removeAbilita: (state, { payload }) => {
      state.abilita = state.abilita.filter((ab) => ab.id !== payload);
    },
  },
});

export const {
  setAbilita,
  updateAbilita,
  addAbilita,
  saveOrUpdateAbilita,
  setProfiloAbilitaSelezionato,
  setListBonusAbilita,
  removeBonusFromListBonusAbilita,
  resetAbilita,
  resetAllAbilita,
  setAbilitaStoricoTarocco,
  setAbilitaStoricoProfessione,
  setAbilitaScelteTaroccoPassato,
  resetAbilitaScelteTaroccoPassato,
  removeAbilita,
} = abilitaSlice.actions;

export default abilitaSlice.reducer;
