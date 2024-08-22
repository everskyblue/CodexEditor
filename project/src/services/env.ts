try {
    require('./env.dev');
} catch {
    process.env.API_KEY = "$API_KEY";
    process.env.API_URL = "$API_URL";
    process.env.BUCKET_NAME = "$BUCKET_NAME";
}
