// CJ AI's daily question limit per signed-in user. One place for the default, so the chat route
// and the admin dashboard always agree.
export const CJ_DAILY_LIMIT = Number(process.env.CJ_DAILY_LIMIT ?? 40);

/** Free questions for a visitor who is not signed in, per day. Signing in raises this to CJ_DAILY_LIMIT. */
export const CJ_VISITOR_DAILY_LIMIT = Number(process.env.CJ_VISITOR_DAILY_LIMIT ?? 3);
