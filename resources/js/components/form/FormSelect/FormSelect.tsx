import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import FormLabel from "@/components/form/FormLabel";
import FormSelectItem from "./FormSelectItem.jsx";
import FormSelectValue from "./FormSelectValue.jsx";

interface FormSelectProps {
  name: string;
  label: string;
  items: SelectItem[];
  value: string | null;            // admite null por “Ninguno”
  multiple: boolean;
  canDeselect: boolean;
  placeholder?: string;
  onChange: ChangeSelectEvent;
  errors: Record<string, string> | undefined;
  disabled?: boolean;
  /** Clases en el contenedor externo (ancho responsive, etc.). */
  className?: string;
}

type Selected = SelectItem | SelectItem[] | null;

function getValue(items: SelectItem[], value: string | number | null, multiple: boolean): Selected {
  if (multiple) {
    if (value == null) return [];
    // si value viene como string con múltiples valores separados, adaptar acá si hace falta
    return items.filter((x) => String(value).includes(String(x.value))) ?? [];
  }
  return items.find((x) => String(x.value) === String(value)) ?? null;
}

export default function FormSelect({
  name,
  label,
  items,
  value,
  multiple,
  canDeselect,
  placeholder,
  onChange,
  errors,
  disabled = false,
  className = "",
}: FormSelectProps) {
  const selectRef = useRef<HTMLDivElement | null>(null);
  const searchRef = useRef<HTMLInputElement | null>(null);

  const [isOpen, setIsOpen] = useState(false);
  const [selectedItem, setSelectedItem] = useState<Selected>(null);
  const [selectedIndex, setSelectedIndex] = useState(0);
  const [filteredItems, setFilteredItems] = useState<SelectItem[]>([]);
  const [searchValue, setSearchValue] = useState("");
  const [isClicked, setIsClicked] = useState(false);

  // Lista base que incluye “Ninguno” si corresponde
  const baseItems = useMemo(() => {
    const arr = [...items];
    if (canDeselect) arr.unshift({ value: null, label: "Ninguno" });
    return arr;
  }, [items, canDeselect]);

  // Sync de item seleccionado cuando cambian props
  useEffect(() => {
    setSelectedItem(getValue(baseItems, value ?? null, multiple));
  }, [value, baseItems, multiple]);

  // Reset de filtros cuando cambian items/canDeselect/value/multiple
  useEffect(() => {
    setFilteredItems(baseItems);
    setSelectedIndex(0);
    setSearchValue("");
  }, [baseItems]);

  const resetSearch = useCallback(() => {
    setSearchValue("");
    setFilteredItems(baseItems);
    // posicionar índice en el seleccionado actual (si aplica)
    if (!multiple && selectedItem && !Array.isArray(selectedItem)) {
      const idx = baseItems.findIndex(
        (x) => String(x.value) === String(selectedItem.value)
      );
      setSelectedIndex(idx >= 0 ? idx : 0);
    } else {
      setSelectedIndex(0);
    }
  }, [baseItems, multiple, selectedItem]);

  const onSearchChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const v = e.target.value;
      setSearchValue(v);
      const filtered =
        v.trim() === ""
          ? baseItems
          : baseItems.filter((x) =>
              x.label.toLowerCase().includes(v.toLowerCase())
            );
      setFilteredItems(filtered);

      if (filtered.length > 0) {
        if (!multiple && selectedItem && !Array.isArray(selectedItem)) {
          const idx = filtered.findIndex(
            (x) => String(x.value) === String(selectedItem.value)
          );
          setSelectedIndex(idx >= 0 ? idx : 0);
        } else {
          setSelectedIndex(0);
        }
      }
    },
    [baseItems, multiple, selectedItem]
  );

  const onMouseEvent = useCallback(
    (event: React.MouseEvent<HTMLElement>) => {
      if (disabled) return;

      const target = event.target as HTMLElement;
      if (target?.classList?.contains("remove")) return;

      if (event.type === "mousedown") {
        setIsClicked(true);
      } else {
        setIsOpen((prev) => !prev);
        setTimeout(() => searchRef.current?.focus(), 10);
        setIsClicked(false);
      }
    },
    [disabled]
  );

  const onSelectItem = useCallback(
    (item: SelectItem, index: number) => {
      setIsOpen(false);

      if (multiple) {
        const prev = (Array.isArray(selectedItem) ? selectedItem : []) as SelectItem[];
        const multiValue = item.unique ? [item] : [...prev, item];
        setSelectedItem(multiValue);
        onChange({ target: { id: name ?? label, value: multiValue.map((x) => x.value) } });
        setSelectedIndex(0);
      } else {
        setSelectedItem(item);
        onChange({ target: { id: name ?? label, value: item.value } });
        setSelectedIndex(index);
      }

      resetSearch();
    },
    [label, multiple, name, onChange, resetSearch, selectedItem]
  );

  const onSearchKeyUp = useCallback(
    (e: React.KeyboardEvent<HTMLInputElement>) => {
      const { code } = e;
      if (code === "ArrowDown" || code === "ArrowUp") {
        if (code === "ArrowDown" && selectedIndex < filteredItems.length - 1) {
          setSelectedIndex((i) => i + 1);
        } else if (code === "ArrowUp" && selectedIndex > 0) {
          setSelectedIndex((i) => i - 1);
        }
      } else if (code === "Enter") {
        const item = filteredItems[selectedIndex];
        if (!item) return;

        if (multiple) {
          const prev = (Array.isArray(selectedItem) ? selectedItem : []) as SelectItem[];
          const multiValue = item.unique ? [item] : [...prev, item];
          setSelectedItem(multiValue);
          onChange({ target: { id: name ?? label, value: multiValue.map((x) => x.value) } });
          resetSearch();
        } else {
          setSelectedItem(item);
          onChange({ target: { id: name ?? label, value: item.value } });
        }
        setIsOpen(false);
      }
    },
    [filteredItems, label, multiple, name, onChange, selectedIndex, selectedItem, resetSearch]
  );

  const onSelectFocus = useCallback(
    (_event: React.FocusEvent<HTMLElement>) => {
      if (disabled) return;
      /* No abrir al enfocar (p. ej. Tab): solo clic o teclado explícito. */
    },
    [disabled]
  );

  const onSelectKeyDown = useCallback(
    (e: React.KeyboardEvent<HTMLElement>) => {
      if (disabled) return;
      if (e.key === "Escape") {
        e.preventDefault();
        setIsOpen(false);
        resetSearch();
        return;
      }
      if (e.key === "Enter" || e.key === " " || e.key === "ArrowDown") {
        if (!isOpen) {
          e.preventDefault();
          setIsOpen(true);
          setTimeout(() => searchRef.current?.focus(), 0);
        }
      }
    },
    [disabled, isOpen, resetSearch]
  );

  const onSelectBlur = useCallback((event: React.FocusEvent<HTMLInputElement>) => {
    if (!isClicked && event.relatedTarget) {
      setIsOpen(false);
    }
  }, [isClicked]);

  const onCloseItem = useCallback(
    (item: SelectItem, index?: number) => {
      if (disabled) return;
      const arr = Array.isArray(selectedItem) ? [...selectedItem] : [];
      arr.splice(index ?? 0, 1);
      setSelectedItem(arr);
      onChange({ target: { id: name ?? label, value: arr.map((x) => x.value) } });
      setSelectedIndex(0);
    },
    [disabled, label, name, onChange, selectedItem]
  );

  const canShowItem = useCallback(
    (item: SelectItem) => {
      if (!multiple) return true;
      const arr = (Array.isArray(selectedItem) ? selectedItem : []) as SelectItem[];
      if (arr.find((si) => si.unique)) return false;
      return !arr.find((si) => String(si.value) === String(item.value));
    },
    [multiple, selectedItem]
  );

  // Click outside: handler memoizado + listener cuando está abierto
  const handleClickOutside = useCallback(
    (ev: Event) => {
      const target = ev.target as Node | null;
      if (selectRef.current && target && !selectRef.current.contains(target)) {
        setIsOpen(false);
        resetSearch();
      }
    },
    [resetSearch]
  );

  useEffect(() => {
    if (!isOpen) return;
    // pointerdown (con captura) detecta antes que otros handlers
    document.addEventListener("pointerdown", handleClickOutside, true);
    return () => {
      document.removeEventListener("pointerdown", handleClickOutside, true);
    };
  }, [isOpen, handleClickOutside]);

  return (
    <div ref={selectRef} className={className}>
      <FormLabel name={name} label={label} />

      <fieldset disabled={disabled} className="w-full">
        <div
          onMouseDown={onMouseEvent}
          onMouseUp={onMouseEvent}
          onFocus={onSelectFocus}
          onKeyDown={onSelectKeyDown}
          role="combobox"
          aria-expanded={isOpen}
          aria-haspopup="listbox"
          className={`ts-control tom-select w-full ${multiple ? "multi plugin-remove_button" : "single plugin-dropdown_input"} ${disabled ? "opacity-50 cursor-not-allowed" : ""}`}
          tabIndex={disabled ? -1 : 0}
        >
          <div className={`items ts-input not-full has-items ${isOpen ? "focus input-active dropdown-active" : ""}`}>
            {multiple && Array.isArray(selectedItem) &&
              selectedItem.map((x, i) => (
                <FormSelectValue key={"si-" + x.value} onClose={onCloseItem} item={x} index={i} showClose={!disabled} />
              ))}
            {!multiple && selectedItem && !Array.isArray(selectedItem) && (
              <FormSelectValue item={selectedItem} />
            )}
            {(!selectedItem || (multiple && Array.isArray(selectedItem) && selectedItem.length === 0)) && (
              <FormSelectValue item={{ value: null, label: placeholder ?? `Seleccione ${label}` }} />
            )}
          </div>

          <div
            className={`ts-dropdown multi tom-select w-full plugin-dropdown_input plugin-remove_button ${isOpen ? "is-open" : ""}`}
          >
            <div className="dropdown-input-wrap">
              <input
                ref={searchRef}
                onChange={onSearchChange}
                onKeyUp={onSearchKeyUp}
                onFocus={(event) => event.stopPropagation()}
                onBlur={onSelectBlur}
                value={searchValue}
                type="text"
                autoComplete="off"
                className="dropdown-input"
                placeholder={placeholder ?? `Seleccione ${label}`}
                disabled={disabled}
              />
            </div>
            <div className="ts-dropdown-content">
              {filteredItems.map((x, index) => (
                <div key={"item-" + x.value}>
                  {canShowItem(x) && (
                    <FormSelectItem
                      item={x}
                      active={selectedIndex === index}
                      onSelect={(item) => onSelectItem(item, index)}
                    />
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>
      </fieldset>

      {errors && Object.hasOwn(errors, name) && (
        <div className="pristine-error text-primary-3 mt-2">{errors[name]}</div>
      )}
    </div>
  );
}
