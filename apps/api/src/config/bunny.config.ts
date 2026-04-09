export default () => ({
  apiKey: process.env.BUNNY_STREAM_API_KEY || '',
  libraryId: process.env.BUNNY_STREAM_LIBRARY_ID || '',
});
