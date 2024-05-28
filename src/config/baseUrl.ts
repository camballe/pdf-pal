let BASE_URL = "https://pdfpal.enkambale.com";

switch (process.env.NODE_ENV) {
  case "development":
    BASE_URL = "http://localhost:3000";
    break;

  case "production":
    BASE_URL = "https://pdfpal.enkambale.com";
    break;

  case "test":
    BASE_URL = "http://localhost:3000";
    break;

  default:
    BASE_URL = "https://pdfpal.enkambale.com";
    break;
}

export default BASE_URL;
