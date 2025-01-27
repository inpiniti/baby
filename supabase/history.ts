import { supabase } from "./supabaseClient";
import dayjs from "dayjs";

const get = async () => {
  const { data, error } = await supabase
    .schema("baby")
    .from("history")
    .select("*")
    .order("date", { ascending: false });

  if (error) {
    throw new Error(
      `Error fetching data from Supabase : ${JSON.stringify(error)}`
    );
  }

  return data;
};

const post = async ({
  date = dayjs().format("YYYY-MM-DD HH:mm:ss"),
  type = "분유",
  amount = 0,
}) => {
  const { error } = await supabase.schema("baby").from("history").upsert({
    date,
    type,
    amount,
  });

  if (error) {
    throw new Error(
      `Error fetching data from Supabase : ${JSON.stringify(error)}`
    );
  }
};

export default {
  get,
  post,
};
