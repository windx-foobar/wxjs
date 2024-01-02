export default defineEventHandler(async (event) => {
  throw createError({
    statusCode: 400,
    message: 'Create new user allow only via certificate'
  });
});
