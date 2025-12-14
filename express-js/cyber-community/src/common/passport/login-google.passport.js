import { Strategy as GoogleStrategy } from "passport-google-oauth20";
// var GoogleStrategy = require("passport-google-oauth20").Strategy;
import passport from "passport";
import { GOOGLE_CLIENT_ID, GOOGLE_CLIENT_SECRECT } from "../constant/app.constant.js";

/**
 * phải chạy trước mọi api xử lý về login google
 */
export const initGoogleStrategy = () => {
    passport.use(
        new GoogleStrategy(
            {
                clientID: GOOGLE_CLIENT_ID,
                clientSecret: GOOGLE_CLIENT_SECRECT,
                callbackURL: "http://localhost:3069/api/auth/google-callback",
            },
            function (accessToken, refreshToken, profile, cb) {
                console.log("GoogleStrategy", { accessToken, refreshToken, profile });

                // thành công
                cb(null, `user`);

                // thất bại
                cb(`err`, null);
            }
        )
    );
};
