import { apiRequest } from "./client";

export const createNote = (note) =>
  apiRequest("/notes", "POST", note);

export const getNotes = () =>
  apiRequest("/notes");