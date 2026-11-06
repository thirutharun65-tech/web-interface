import { useEffect, useMemo, useState } from "react";
import Header from "../components/Header";
import CategorySelector from "../components/CategorySelector";
import ConversionInput from "../components/ConversionInput";
import SwapButton from "../components/SwapButton";
import ResultDisplay from "../components/ResultDisplay";
import History from "../components/History";
import Favorites from "../components/Favorites";
import QuickConversions from "../components/QuickConversions";
import SearchUnits from "../components/SearchUnits";
import Toast from "../components/Toast";
import { categories } from "../data/units";
import { convert, validateInput, nonNegativeCategories } from "../utils/converter";
import { formatNumber } from "../utils/formatter";
import {
  getHistory,
  addHistoryEntry,
  clearHistory,
  getFavorites,
  setFavorites as persistFavorites,
  getTheme,
  setTheme as persistTheme,
  getPrecision,
  setPrecision as persistPrecision,
} from "../utils/storage";
import { defaultFavorites } from "../data/units";

export default function Converter() {
  const [category, setCategory] = useState("length");
  const [fromUnit, setFromUnit] = useState("meter");
  const [toUnit, setToUnit] = useState("kilometer");

  // Both fields are editable. `activeField` tracks which one the user is
  // currently typing into — that field's raw text is the source of truth,
  // and the other field is derived from it.
  const [rawFrom, setRawFrom] = useState("100");
  const [rawTo, setRawTo] = useState("");
  const [activeField, setActiveField] = useState("from");

  const [precision, setPrecision] = useState(2);
  const [theme, setTheme] = useState("light");
  const [history, setHistory] = useState([]);
  const [favorites, setFavoritesState] = useState([]);
  const [toastMessage, setToastMessage] = useState("");

  // Load persisted state on mount
  useEffect(() => {
    setHistory(getHistory());
    const storedFavorites = getFavorites();
    setFavoritesState(storedFavorites === null ? defaultFavorites : storedFavorites);
    setTheme(getTheme());
    setPrecision(getPrecision());
  }, []);

  // Apply theme to document
  useEffect(() => {
    document.documentElement.setAttribute("data-theme", theme);
    persistTheme(theme);
  }, [theme]);

  useEffect(() => {
    persistPrecision(precision);
  }, [precision]);

  // Toast auto-dismiss
  useEffect(() => {
    if (!toastMessage) return undefined;
    const timer = window.setTimeout(() => setToastMessage(""), 2200);
    return () => window.clearTimeout(timer);
  }, [toastMessage]);

  const currentCategory = categories[category];
  const allowNegative = !nonNegativeCategories.has(category);

  const isFromActive = activeField === "from";
  const activeRaw = isFromActive ? rawFrom : rawTo;
  const activeUnit = isFromActive ? fromUnit : toUnit;
  const passiveUnit = isFromActive ? toUnit : fromUnit;

  const validation = useMemo(
    () => validateInput(activeRaw, { allowNegative }),
    [activeRaw, allowNegative]
  );

  // The value of the field the user is NOT currently typing into
  const computedPassive = useMemo(() => {
    if (activeRaw === "" || !validation.valid) return null;
    return convert(category, activeUnit, passiveUnit, activeRaw);
  }, [category, activeUnit, passiveUnit, activeRaw, validation.valid]);

  const passiveDisplay =
    activeRaw === ""
      ? ""
      : validation.error
      ? "—"
      : computedPassive === null
      ? "—"
      : formatNumber(computedPassive, precision);

  const displayFrom = isFromActive ? rawFrom : passiveDisplay;
  const displayTo = isFromActive ? passiveDisplay : rawTo;

  // Save a history entry once the active value settles (debounced)
  useEffect(() => {
    if (computedPassive === null) return;
    const handle = window.setTimeout(() => {
      const fromSymbol = currentCategory.units[fromUnit]?.symbol ?? fromUnit;
      const toSymbol = currentCategory.units[toUnit]?.symbol ?? toUnit;
      const fromNumber = isFromActive ? Number(activeRaw) : computedPassive;
      const toNumber = isFromActive ? computedPassive : Number(activeRaw);
      const summary = `${formatNumber(fromNumber, precision)} ${fromSymbol} → ${formatNumber(toNumber, precision)} ${toSymbol}`;
      const updated = addHistoryEntry({
        category,
        fromUnit,
        toUnit,
        value: isFromActive ? activeRaw : formatNumber(computedPassive, 8),
        summary,
      });
      setHistory(updated);
    }, 900);
    return () => window.clearTimeout(handle);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [computedPassive]);

  const handleCategoryChange = (key) => {
    setCategory(key);
    const unitKeys = Object.keys(categories[key].units);
    setFromUnit(unitKeys[0]);
    setToUnit(unitKeys[1] ?? unitKeys[0]);
    setRawFrom("1");
    setRawTo("");
    setActiveField("from");
  };

  const handleSwap = () => {
    // Whatever is currently shown in each box moves to the other box,
    // paired with its own unit, and direction reverses.
    const nextRawFrom = displayTo;
    const nextRawTo = displayFrom;
    setFromUnit(toUnit);
    setToUnit(fromUnit);
    setRawFrom(nextRawFrom === "—" ? "" : nextRawFrom);
    setRawTo(nextRawTo === "—" ? "" : nextRawTo);
    setActiveField("from");
  };

  const handleFromChange = (text) => {
    setRawFrom(text);
    setActiveField("from");
  };

  const handleToChange = (text) => {
    setRawTo(text);
    setActiveField("to");
  };

  const handleCopy = async () => {
    if (computedPassive === null) return;
    const fromLabel = currentCategory.units[fromUnit]?.label ?? fromUnit;
    const toLabel = currentCategory.units[toUnit]?.label ?? toUnit;
    const fromNumber = isFromActive ? Number(activeRaw) : computedPassive;
    const toNumber = isFromActive ? computedPassive : Number(activeRaw);
    const text = `${formatNumber(fromNumber, precision)} ${fromLabel.toLowerCase()}s = ${formatNumber(toNumber, precision)} ${toLabel.toLowerCase()}s`;
    try {
      await navigator.clipboard.writeText(text);
      setToastMessage("Result copied");
    } catch (err) {
      console.error("Clipboard write failed:", err);
      setToastMessage("Couldn't copy — please copy manually");
    }
  };

  const isFavorite = favorites.some(
    (f) => f.category === category && f.from === fromUnit && f.to === toUnit
  );

  const handleToggleFavorite = () => {
    let updated;
    if (isFavorite) {
      updated = favorites.filter(
        (f) => !(f.category === category && f.from === fromUnit && f.to === toUnit)
      );
    } else {
      updated = [...favorites, { category, from: fromUnit, to: toUnit }];
    }
    setFavoritesState(updated);
    persistFavorites(updated);
    setToastMessage(isFavorite ? "Removed from favorites" : "Added to favorites");
  };

  const handleQuickSelect = (qc) => {
    setCategory(qc.category);
    setFromUnit(qc.from);
    setToUnit(qc.to);
    setRawFrom(String(qc.value));
    setRawTo("");
    setActiveField("from");
  };

  const handleFavoriteSelect = (fav) => {
    setCategory(fav.category);
    setFromUnit(fav.from);
    setToUnit(fav.to);
    setActiveField("from");
  };

  const handleHistorySelect = (entry) => {
    setCategory(entry.category);
    setFromUnit(entry.fromUnit);
    setToUnit(entry.toUnit);
    setRawFrom(entry.value);
    setRawTo("");
    setActiveField("from");
  };

  const handleSearchPick = (unit) => {
    setCategory(unit.categoryKey);
    const unitKeys = Object.keys(categories[unit.categoryKey].units);
    setFromUnit(unit.unitKey);
    setToUnit(unitKeys.find((k) => k !== unit.unitKey) ?? unit.unitKey);
    setActiveField("from");
  };

  const handleClearHistory = () => {
    setHistory(clearHistory());
  };

  const resultText =
    activeRaw === ""
      ? "Enter a value above"
      : validation.error
      ? "—"
      : computedPassive === null
      ? "—"
      : formatNumber(computedPassive, precision);

  const equationText =
    activeRaw !== "" && validation.valid && computedPassive !== null
      ? `${formatNumber(Number(activeRaw), precision)} ${currentCategory.units[activeUnit]?.symbol ?? ""} = ${formatNumber(computedPassive, precision)} ${currentCategory.units[passiveUnit]?.symbol ?? ""}`
      : null;

  return (
    <div className="app-shell">
      <Header theme={theme} onToggleTheme={() => setTheme(theme === "dark" ? "light" : "dark")} />
      <div className="ruler" aria-hidden="true" />

      <div className="layout">
        <aside className="sidebar">
          <CategorySelector activeCategory={category} onSelect={handleCategoryChange} />
        </aside>

        <main className="main-panel">
          <p className="section-eyebrow">Unit Converter</p>
          <h1 className="panel-title">{currentCategory.label}</h1>
          <p className="panel-subtitle">
            Convert any unit instantly — type into either box, no submit button needed.
          </p>

          <SearchUnits onPick={handleSearchPick} />

          <section className="converter-card" aria-label="Unit converter">
            <div className="convert-grid">
              <ConversionInput
                id="from"
                label="From"
                units={currentCategory.units}
                unitValue={fromUnit}
                onUnitChange={setFromUnit}
                numberValue={displayFrom}
                onNumberChange={handleFromChange}
                editable
                error={isFromActive ? validation.error : null}
              />

              <SwapButton onSwap={handleSwap} />

              <ConversionInput
                id="to"
                label="To"
                units={currentCategory.units}
                unitValue={toUnit}
                onUnitChange={setToUnit}
                numberValue={displayTo}
                onNumberChange={handleToChange}
                editable
                error={!isFromActive ? validation.error : null}
              />
            </div>

            <ResultDisplay
              equationText={equationText}
              resultText={resultText}
              precision={precision}
              onPrecisionChange={setPrecision}
              onCopy={handleCopy}
              onToggleFavorite={handleToggleFavorite}
              isFavorite={isFavorite}
              disabled={computedPassive === null}
            />
          </section>

          <QuickConversions onSelect={handleQuickSelect} />
        </main>

        <aside className="side-panel">
          <Favorites favorites={favorites} onSelect={handleFavoriteSelect} />
          <History history={history} onSelect={handleHistorySelect} onClear={handleClearHistory} />
        </aside>
      </div>

      <Toast message={toastMessage} />
    </div>
  );
}
