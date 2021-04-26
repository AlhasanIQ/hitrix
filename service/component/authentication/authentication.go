package authentication

import (
	"errors"
	"fmt"
	"strconv"
	"strings"
	"time"

	"github.com/go-redis/redis/v8"

	"github.com/coretrix/hitrix/pkg/helper"

	"github.com/coretrix/hitrix/service/component/jwt"
	"github.com/coretrix/hitrix/service/component/password"
	"github.com/latolukasz/orm"
)

const (
	separator               = ":"
	tokenListSeparator      = ";"
	accessKeyPrefix         = "ACCESS"
	userListTokenPrefix     = "USER_KEYS"
	maxUserTokenKeysAllowed = 10
)

type AuthProviderEntity interface {
	orm.Entity
	GetUniqueFieldName() string
	GetPassword() string
}
type Authentication struct {
	accessTokenTTL  int
	refreshTokenTTL int
	passwordService *password.Password
	jwtService      *jwt.JWT
	ormService      *orm.Engine
	cacheService    *orm.RedisCache
	secret          string
}

func NewAuthenticationService(
	secret string,
	accessTokenTTL int,
	refreshTokenTTL int,
	ormService *orm.Engine,
	cacheService *orm.RedisCache,
	passwordService *password.Password,
	jwtService *jwt.JWT,
) *Authentication {
	return &Authentication{
		secret:          secret,
		accessTokenTTL:  accessTokenTTL,
		refreshTokenTTL: refreshTokenTTL,
		passwordService: passwordService,
		jwtService:      jwtService,
		ormService:      ormService,
		cacheService:    cacheService,
	}
}

func (t *Authentication) Authenticate(uniqueValue string, password string, entity AuthProviderEntity) (accessToken string, refreshToken string, err error) {
	q := &orm.RedisSearchQuery{}
	q.FilterString(entity.GetUniqueFieldName(), uniqueValue)
	found := t.ormService.RedisSearchOne(entity, q)
	if !found {
		return "", "", errors.New("invalid user/pass")
	}

	if !t.passwordService.VerifyPassword(password, entity.GetPassword()) {
		return "", "", errors.New("invalid user/pass")
	}

	accessKey := t.generateAndStoreAccessKey(entity.GetID(), t.refreshTokenTTL)

	accessToken, err = t.generateTokenPair(entity.GetID(), accessKey, t.accessTokenTTL)
	if err != nil {
		return "", "", err
	}

	refreshToken, err = t.generateTokenPair(entity.GetID(), accessKey, t.refreshTokenTTL)
	if err != nil {
		return "", "", err
	}

	t.addUserTokenKeyList(entity.GetID(), accessKey, "", t.refreshTokenTTL)

	return accessToken, refreshToken, nil
}

func (t *Authentication) VerifyAccessToken(accessToken string, entity orm.Entity) (map[string]string, error) {
	payload, err := t.jwtService.VerifyJWTAndGetPayload(t.secret, accessToken, time.Now().Unix())
	if err != nil {
		return nil, err
	}

	id, err := strconv.ParseUint(payload["sub"], 10, 64)
	if err != nil {
		return nil, err
	}

	accessKey := payload["jti"]

	_, has := t.cacheService.Get(accessKey)
	if !has {
		return nil, errors.New("access key not found")
	}

	found := t.ormService.LoadByID(id, entity)
	if !found {
		return nil, errors.New("user_not_found")
	}

	return payload, nil
}

func (t *Authentication) RefreshToken(refreshToken string) (newAccessToken string, newRefreshToken string, err error) {
	payload, err := t.jwtService.VerifyJWTAndGetPayload(t.secret, refreshToken, time.Now().Unix())
	if err != nil {
		return "", "", err
	}

	id, err := strconv.ParseUint(payload["sub"], 10, 64)
	if err != nil {
		return "", "", err
	}

	//check the access key
	oldAccessKey := payload["jti"]
	_, has := t.cacheService.Get(oldAccessKey)
	if !has {
		return "", "", errors.New("refresh token not valid")
	}

	t.cacheService.Del(oldAccessKey)

	newAccessKey := t.generateAndStoreAccessKey(id, t.accessTokenTTL)

	newAccessToken, err = t.generateTokenPair(id, newAccessKey, t.accessTokenTTL)
	if err != nil {
		return "", "", err
	}

	newRefreshToken, err = t.generateTokenPair(id, newAccessKey, t.refreshTokenTTL)
	if err != nil {
		return "", "", err
	}

	t.addUserTokenKeyList(id, newAccessKey, oldAccessKey, t.refreshTokenTTL)

	return newAccessToken, newRefreshToken, err
}

func (t *Authentication) LogoutCurrentSession(accessKey string) {
	cacheService := t.cacheService

	cacheService.Del(accessKey)

	tokenListKey := generateUserTokenListKey(getUserIdFromAccessKey(accessKey))
	tokenList, has := cacheService.Get(tokenListKey)
	if has {
		var newTokenList = make([]string, 0)
		tokenArr := strings.Split(tokenList, tokenListSeparator)
		if len(tokenArr) != 0 {
			for i := range tokenArr {
				if tokenArr[i] != accessKey {
					newTokenList = append(newTokenList, tokenArr[i])
				}
			}
			if len(newTokenList) != 0 {
				cacheService.Set(tokenListKey, strings.Join(newTokenList, tokenListSeparator), redis.KeepTTL)
			}
		}
	}
}

func (t *Authentication) LogoutAllSessions(id uint64) {
	tokenListKey := generateUserTokenListKey(id)
	cacheService := t.cacheService

	tokenList, has := cacheService.Get(tokenListKey)
	if has && tokenList != "" {
		tokenArr := strings.Split(tokenList, tokenListSeparator)
		if len(tokenArr) != 0 {
			cacheService.Del(tokenArr...)
		}
	}
	cacheService.Del(tokenListKey)
}

func (t *Authentication) generateTokenPair(id uint64, accessKey string, ttl int) (string, error) {
	headers := map[string]string{
		"algo": "HS256",
		"type": "JWT",
	}

	now := time.Now().Unix()

	payload := map[string]string{
		"jti": accessKey,
		"sub": strconv.FormatUint(id, 10),
		"exp": strconv.FormatInt(now+int64(ttl), 10),
		"iat": strconv.FormatInt(now, 10),
	}

	return t.jwtService.EncodeJWT(t.secret, headers, payload)
}

func (t *Authentication) generateAndStoreAccessKey(id uint64, ttl int) string {
	key := generateAccessKey(id)
	t.cacheService.Set(key, "", ttl)
	return key
}

func (t *Authentication) addUserTokenKeyList(id uint64, tokenKey, oldTokenKey string, ttl int) {
	key := generateUserTokenListKey(id)
	cacheService := t.cacheService
	res, has := cacheService.Get(key)
	if !has {
		cacheService.Set(key, tokenKey, ttl)
		return
	}

	currentTokenArr := strings.Split(res, tokenListSeparator)
	if len(currentTokenArr) >= maxUserTokenKeysAllowed {
		cacheService.Del(currentTokenArr[0])
		currentTokenArr = currentTokenArr[1:]
	}

	if oldTokenKey == "" {
		currentTokenArr = append(currentTokenArr, tokenKey)
		cacheService.Set(key, strings.Join(currentTokenArr, tokenListSeparator), ttl)
		return
	}

	var finalTokenArr = make([]string, 0)
	finalTokenArr = append(finalTokenArr, tokenKey)

	if oldTokenKey != "" {
		for i := range currentTokenArr {
			if currentTokenArr[i] != oldTokenKey {
				finalTokenArr = append(finalTokenArr, currentTokenArr[i])
			}
		}
	}
	if len(finalTokenArr) == 0 {
		cacheService.Del(key)
	} else {
		cacheService.Set(key, strings.Join(finalTokenArr, tokenListSeparator), ttl)
	}
}

func generateAccessKey(id uint64) string {
	return fmt.Sprintf("%s%s%d%s%s", accessKeyPrefix, separator, id, separator, helper.GenerateUUID())
}

func getUserIdFromAccessKey(accessKey string) uint64 {
	accessArr := strings.Split(accessKey, separator)
	if len(accessArr) == 3 {
		userIDInt, _ := strconv.ParseInt(accessArr[1], 10, 0)
		return uint64(userIDInt)
	}
	return 0
}

func generateUserTokenListKey(id uint64) string {
	return fmt.Sprintf("%s%s%d", userListTokenPrefix, separator, id)
}
