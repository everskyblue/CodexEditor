//@ts-nocheck
import "./env";
import libRequire from '../lib'
import "core-js-url-browser";

const supabase = libRequire('./supabase.min');
export const client = supabase.createClient(process.env.API_URL, process.env.API_KEY)