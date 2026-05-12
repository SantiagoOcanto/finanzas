import { useState, useCallback } from "react";
import { aplicarMascaraMonto } from "../utils";

export function useMontoMask(inicial = "") {
  const [valor, setValor] = useState(inicial);

  const onChange = useCallback((e) => {
    setValor(aplicarMascaraMonto(e.target.value));
  }, []);

  const reset = useCallback(() => setValor(""), []);

  const setValorExterno = useCallback((num) => {
    setValor(aplicarMascaraMonto(String(Math.round(num * 100))));
  }, []);

  return { valor, onChange, reset, setValorExterno };
}
