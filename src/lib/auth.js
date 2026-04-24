import { supabase } from "./supabase";

// SIGNUP
export const signUpUser = async (name, email, password) => {
  const { data, error } = await supabase.auth.signUp({
    email,
    password,
    options: {
      data: { full_name: name },
    },
  });

  if (error) {
    console.log("SIGNUP ERROR:", error.message);
    return { error };
  }

  console.log("USER CREATED:", data.user);

  // 🔥 Insert into profiles
  const { error: profileError } = await supabase
    .from("profiles")
    .insert([
      {
        id: data.user.id,
        full_name: name,
        email: email,
      },
    ]);

  if (profileError) {
    console.log("PROFILE ERROR:", profileError.message);
  } else {
    console.log("PROFILE CREATED SUCCESS");
  }

  return { data };
};

// LOGIN
export const loginUser = async (email, password) => {
  const { data, error } = await supabase.auth.signInWithPassword({
    email,
    password,
  });

  console.log("LOGIN ERROR:", error);

  return { data, error };
};

// LOGOUT
export const logoutUser = async () => {
  await supabase.auth.signOut();
};