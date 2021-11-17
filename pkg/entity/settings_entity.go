package entity

import (
	"github.com/latolukasz/beeorm"
)

type SettingType struct {
	Public  string
	Private string
}

var SettingTypeAll = SettingType{
	Private: "private",
	Public:  "public",
}

const (
	seedsSetting = "seeds"
)

// is an ENUM of static settings required by other parts of the framework
type HitrixSettings struct {
	Seeds string
}

var HitrixSettingAll = HitrixSettings{
	Seeds: seedsSetting,
}

type SettingSeedsValue map[string]int

type SettingsEntity struct {
	beeorm.ORM `orm:"table=settings;redisCache;redisSearch=search_pool;"`
	ID         uint64
	Key        string `orm:"required;unique=Settings_Key;searchable;"`
	Value      string `orm:"required;length=max;"`
	Type       string `orm:"required;enum=entity.SettingTypeAll;searchable"`
	Editable   bool
	Metadata   string `orm:"length=max"`
}
