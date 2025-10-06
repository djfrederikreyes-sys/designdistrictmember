"use client";
import React, { useMemo, useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Search,
  Star,
  StarOff,
  Globe2,
  Building2,
  Rows,
  Grid2X2,
  Filter,
  X,
  ChevronDown,
} from "lucide-react";

type ItemType = "Udstiller" | "Brand";

export type DirectoryItem = {
  id: string;
  name: string;
  type: ItemType;
  country: string; // fx "Danmark", "Spanien"
  city?: string;
  categories?: string[];
  hall?: string;
  heroUrl?: string;
  url?: string;
  description?: string;
};

/** Data — rettet så:
 *  - "Via Copenhagen" → "Grassoler" (Spanien)
 *  - "Boln" land → "Spanien"
 */
const MOCK_DATA: DirectoryItem[] = [
  // BRANDS
  { id: "b-andreuworld", name: "Andreu World", type: "Brand", country: "Spanien", url: "https://andreuworld.com/en/" },
  { id: "b-sancal", name: "Sancal", type: "Brand", country: "Spanien", url: "http://sancal.com/en/" },
  { id: "b-sellex", name: "Sellex", type: "Brand", country: "Spanien", url: "http://sellex.es/en/" },
  { id: "b-elementdesign", name: "Element Design", type: "Brand", country: "Danmark", url: "https://www.elementdesign.dk/" },
  { id: "b-lapodsfactory", name: "La Pods Factory", type: "Brand", country: "—", url: "https://lapodsfactory.com/?lang=en" },
  { id: "b-sitland", name: "Sitland", type: "Brand", country: "Italien", url: "https://www.sitland.com/en/" },
  { id: "b-Grassoler", name: "Grassoler", type: "Brand", country: "Spanien", url: "https://www.grassoler.com/en/" }, // navn rettet
  { id: "b-frezza", name: "Frezza", type: "Brand", country: "Italien", url: "https://www.frezza.com/en/" },
  { id: "b-boln", name: "Boln", type: "Brand", country: "Spanien", url: "https://boln.eu/en/" }, // land rettet
  { id: "b-vzor", name: "Vzor", type: "Brand", country: "Polen", url: "https://www.vzor.com/" },
  { id: "b-ldseating", name: "LD Seating", type: "Brand", country: "Tjekkiet", url: "https://ldseating.com/en" },
  { id: "b-mute", name: "Mute.", type: "Brand", country: "Polen", url: "https://www.mute.design/" },
  { id: "b-deploeg", name: "De Ploeg", type: "Brand", country: "Holland", url: "https://deploeg.com/en/" },
  { id: "b-ncp", name: "NCP", type: "Brand", country: "Norge", url: "https://ncp.no/" },
  { id: "b-nordicmodern", name: "Nordic Modern", type: "Brand", country: "Danmark", url: "https://nordicmodern.com/" },
  { id: "b-camoleathers", name: "Camo Leathers", type: "Brand", country: "Danmark", url: "https://www.ca-mo.com/" },

  // UDSTILLERE
  { id: "e-momentum", name: "Momentum Møbler", type: "Udstiller", country: "Danmark", url: "https://www.momentummobler.dk/" },
  { id: "e-djust", name: "D-Just", type: "Udstiller", country: "Danmark", url: "https://d-just.dk/" },
  { id: "e-imagecollection", name: "Image Collection", type: "Udstiller", country: "Danmark", url: "https://www.imagecollection.dk/" },
  { id: "e-kito", name: "KITO & Co", type: "Udstiller", country: "Danmark", url: "https://kitoco.dk/" },
  { id: "e-lammhultsbd", name: "Lammhults Biblioteksdesign", type: "Udstiller", country: "Danmark", url: "https://bci.dk/" },
  { id: "e-nordicmodern", name: "Nordic Modern", type: "Udstiller", country: "Danmark", url: "https://nordicmodern.com/" },
  { id: "e-qqdesign", name: "QQ-Design", type: "Udstiller", country: "Danmark", url: "https://qq-design.dk/" },
  { id: "e-moakk", name: "Moakk", type: "Udstiller", country: "Danmark", url: "https://www.moakk.dk/" },
];

const ALL_COUNTRIES = ["Danmark", "Spanien", "Italien", "Polen", "Holland", "Norge", "Tjekkiet", "—"];

function classNames(...xs: (string | false | null | undefined)[]) {
  return xs.filter(Boolean).join(" ");
}
function fuzzyIncludes(hay: string, needle: string) {
  return hay.toLowerCase().includes(needle.trim().toLowerCase());
}

function Segmented({
  value,
  onChange,
  options,
}: {
  value: string;
  onChange: (v: string) => void;
  options: { label: string; value: string }[];
}) {
  return (
    <div className="inline-flex items-center rounded-2xl bg-zinc-100 p-1 dark:bg-zinc-800">
      {options.map((opt) => (
        <button
          key={opt.value}
          onClick={() => onChange(opt.value)}
          className={classNames(
            "relative px-4 py-2 text-sm font-medium rounded-xl transition",
            value === opt.value
              ? "bg-white shadow-sm dark:bg-zinc-900"
              : "text-zinc-600 hover:text-zinc-900 dark:text-zinc-300 dark:hover:text-white"
          )}
        >
          {opt.label}
        </button>
      ))}
    </div>
  );
}

function Dropdown({
  label,
  value,
  setValue,
  items,
}: {
  label: string;
  value?: string;
  setValue: (v?: string) => void;
  items: string[];
}) {
  const [open, setOpen] = useState(false);
  return (
    <div className="relative">
      <button
        onClick={() => setOpen((o) => !o)}
        className="inline-flex items-center gap-2 rounded-xl border border-zinc-300 dark:border-zinc-700 px-3 py-2 text-sm hover:bg-zinc-50 dark:hover:bg-zinc-800"
      >
        <ChevronDown className="h-4 w-4" />
        <span className="opacity-70">{label}:</span>
        <span className="font-medium">{value ?? "Alle"}</span>
      </button>
      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, y: -4 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -4 }}
            className="absolute z-20 mt-2 w-48 rounded-xl border border-zinc-200 dark:border-zinc-700 bg-white dark:bg-zinc-900 shadow-lg"
          >
            <button
              className="w-full text-left px-3 py-2 text-sm hover:bg-zinc-50 dark:hover:bg-zinc-800"
              onClick={() => {
                setValue(undefined);
                setOpen(false);
              }}
            >
              Alle
            </button>
            <div className="max-h-64 overflow-auto">
              {items.map((it) => (
                <button
                  key={it}
                  className="w-full text-left px-3 py-2 text-sm hover:bg-zinc-50 dark:hover:bg-zinc-800"
                  onClick={() => {
                    setValue(it);
                    setOpen(false);
                  }}
                >
                  {it}
                </button>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

function DirectoryCard({
  item,
  favorite,
  toggleFavorite,
}: {
  item: DirectoryItem;
  favorite: boolean;
  toggleFavorite: (id: string) => void;
}) {
  return (
    <motion.article
      layout
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -8 }}
      className="group relative overflow-hidden rounded-2xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900"
    >
      <div className="p-4 flex flex-col gap-3">
        {/* Header row */}
        <div className="flex items-start justify-between gap-3">
          <div className="min-w-0">
            <h3 className="truncate text-base font-semibold">{item.name}</h3>
            <div className="mt-0.5 flex items-center gap-2 text-xs text-zinc-500">
              <span className="inline-flex items-center gap-1">
                <Globe2 className="h-3.5 w-3.5" /> {item.country}
                {item.city ? `, ${item.city}` : ""}
              </span>
              <span className="inline-flex items-center gap-1">
                <Building2 className="h-3.5 w-3.5" /> {item.type}
              </span>
            </div>
          </div>

          <button
            onClick={() => toggleFavorite(item.id)}
            className="p-2 rounded-lg border border-zinc-200 hover:bg-zinc-50 dark:border-zinc-700 dark:hover:bg-zinc-800"
            aria-label={favorite ? "Fjern favorit" : "Tilføj favorit"}
          >
            {favorite ? <Star className="h-4 w-4 fill-current" /> : <StarOff className="h-4 w-4" />}
          </button>
        </div>

        {item.description && (
          <p className="line-clamp-2 text-sm text-zinc-600 dark:text-zinc-300">{item.description}</p>
        )}

        {item.url && (
          <div className="pt-2">
            <a
              href={item.url}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex text-sm font-medium underline underline-offset-4"
            >
              Besøg website
            </a>
          </div>
        )}
      </div>
    </motion.article>
  );
}

export default function DesignDistrictDirectory() {
  const [mode, setMode] = useState<"Udstillere" | "Brands">("Udstillere");
  const [query, setQuery] = useState("");
  const [country, setCountry] = useState<string | undefined>();
  const [layout, setLayout] = useState<"grid" | "rows">("grid");
  const [favorites, setFavorites] = useState<string[]>(() => {
    if (typeof window === "undefined") return [];
    try {
      return JSON.parse(localStorage.getItem("ddcph:favorites") || "[]");
    } catch {
      return [];
    }
  });

  useEffect(() => {
    if (typeof window === "undefined") return;
    localStorage.setItem("ddcph:favorites", JSON.stringify(favorites));
  }, [favorites]);

  const toggleFavorite = (id: string) => {
    setFavorites((prev) => (prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]));
  };

  const items = useMemo(() => {
    return MOCK_DATA
      .filter((it) => (mode === "Udstillere" ? it.type === "Udstiller" : it.type === "Brand"))
      .filter((it) => (country ? it.country === country : true))
      .filter((it) =>
        query
          ? fuzzyIncludes(it.name, query) ||
            fuzzyIncludes(it.country, query) ||
            fuzzyIncludes(it.city || "", query)
          : true
      )
      .sort((a, b) => a.name.localeCompare(b.name));
  }, [mode, country, query]);

  const count = items.length;

  return (
    <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-8">
      <div className="flex flex-col gap-6 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold tracking-tight">Design District CPH</h1>
          <p className="mt-2 text-zinc-600 dark:text-zinc-300 max-w-2xl">
            En oversigt over brands & udstillere på Design District CPH.
          </p>
        </div>
        <Segmented
          value={mode}
          onChange={(v) => setMode(v === "Udstillere" ? "Udstillere" : "Brands")}
          options={[
            { label: "Udstillere", value: "Udstillere" },
            { label: "Brands", value: "Brands" },
          ]}
        />
      </div>

      <div className="mt-6 grid grid-cols-1 gap-3 md:grid-cols-12">
        <div className="md:col-span-5">
          <label className="sr-only" htmlFor="search">
            Søg
          </label>
          <div className="flex items-center gap-2 rounded-xl border border-zinc-300 dark:border-zinc-700 px-3 py-2">
            <Search className="h-4 w-4 opacity-60" />
            <input
              id="search"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Søg efter navn eller land…"
              className="w-full bg-transparent outline-none text-sm"
            />
          </div>
        </div>
        <div className="md:col-span-7">
          <div className="flex flex-wrap items-center gap-2">
            <Dropdown label="Land" value={country} setValue={setCountry} items={ALL_COUNTRIES} />
            {(country || query) && (
              <button
                onClick={() => {
                  setCountry(undefined);
                  setQuery("");
                }}
                className="inline-flex items-center gap-2 rounded-xl border border-zinc-300 dark:border-zinc-700 px-3 py-2 text-sm hover:bg-zinc-50 dark:hover:bg-zinc-800"
              >
                <X className="h-4 w-4" /> Nulstil
              </button>
            )}
            <span className="ml-auto inline-flex items-center gap-2 rounded-xl border border-zinc-300 dark:border-zinc-700 px-3 py-2 text-sm">
              Visning:
              <button
                onClick={() => setLayout("grid")}
                className={classNames(
                  "p-1 rounded-md",
                  layout === "grid" ? "bg-zinc-100 dark:bg-zinc-800" : "hover:bg-zinc-50 dark:hover:bg-zinc-800"
                )}
                aria-label="Grid"
              >
                <Grid2X2 className="h-4 w-4" />
              </button>
              <button
                onClick={() => setLayout("rows")}
                className={classNames(
                  "p-1 rounded-md",
                  layout === "rows" ? "bg-zinc-100 dark:bg-zinc-800" : "hover:bg-zinc-50 dark:hover:bg-zinc-800"
                )}
                aria-label="Rows"
              >
                <Rows className="h-4 w-4" />
              </button>
            </span>
          </div>
        </div>
      </div>

      <div className="mt-4 flex items-center justify-between text-sm text-zinc-600 dark:text-zinc-400">
        <div>{count === 0 ? "Ingen resultater" : `${count} ${count === 1 ? "resultat" : "resultater"}`}</div>
        <div className="flex items-center gap-2">
          <Filter className="h-4 w-4" />
          <span className="opacity-70">Favoritér kort for din ruteplan</span>
        </div>
      </div>

      <div
        className={classNames(
          "mt-4 gap-4",
          layout === "grid" ? "grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3" : "grid grid-cols-1"
        )}
      >
        <AnimatePresence mode="popLayout">
          {items.map((it) => (
            <DirectoryCard
              key={it.id}
              item={it}
              favorite={favorites.includes(it.id)}
              toggleFavorite={toggleFavorite}
            />
          ))}
        </AnimatePresence>
      </div>
    </div>
  );
}
