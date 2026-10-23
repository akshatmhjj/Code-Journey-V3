// CJ AI's daily question limit per signed-in user. One place for the default, so the chat route
// and the admin dashboard always agree.
export const CJ_DAILY_LIMIT = Number(process.env.CJ_DAILY_LIMIT ?? 40);
