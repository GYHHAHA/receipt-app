"use client";

import { useEffect, useState } from "react";
import { supabase } from "../lib/supabaseClient";
import type { Database } from "../lib/database.types";

type TodoRow = Database["public"]["Tables"]["todos"]["Row"];

export default function Home() {
  const [rows, setRows] = useState<TodoRow[]>([]);
  const [error, setError] = useState("");

  useEffect(() => {
    (async () => {
      const { data, error } = await supabase
        .from("todos")
        .select("*")
        .limit(10);

      if (error) setError(error.message);
      else setRows(data ?? []); // ✅ data 的类型现在是 TodoRow[] | null
    })();
  }, []);

  return (
    <main style={{ padding: 24 }}>
      {error && <pre>{error}</pre>}
      <pre>{JSON.stringify(rows, null, 2)}</pre>
    </main>
  );
}
