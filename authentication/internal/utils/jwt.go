package utils

import (
	"time"

	"github.com/golang-jwt/jwt"
)

// Function to generate JWT
func GenerateJWT(userID string, email string, jwtKey []byte) (string, error) {
    token := jwt.NewWithClaims(jwt.SigningMethodHS256, jwt.MapClaims{
        "userId": userID,
        "email":   email,
        "exp":     time.Now().Add(24 * time.Hour).Unix(),
    })

    tokenString, err := token.SignedString(jwtKey)
    if err != nil {
        return "", err
    }

    return tokenString, nil
}
