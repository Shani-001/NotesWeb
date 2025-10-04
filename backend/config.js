import dotenv from "dotenv";
dotenv.config()

const JWT_USER_PASSWORD = process.env.JWT_USER_PASSWORD;
const JWT_ADMIN_PASSWORD = process.env.JWT_ADMIN_PASSWORD;
const STRIPE_SECRET_KEY ="sk_test_51SCM8rJMQOBE2NHqK9NPcJUx2DyVXBvyizfOcfOEzhwf1I22A8BCA1prpaZzBaAkp9nWFKrHa2erDhUBCoNHsv4e00IaB1w0uL"
export default{
    JWT_USER_PASSWORD,
    JWT_ADMIN_PASSWORD,
    STRIPE_SECRET_KEY
}

