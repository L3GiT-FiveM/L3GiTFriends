Config = {}

--------------------------------------
-- 3D NAMEPLATE SETTINGS
--------------------------------------
Config.MaxDrawDistance = 75.0
Config.BaseHeight = 1.02
Config.DistanceHeightFactor = 0.010

Config.HeartDict = 'heart'
Config.HeartName = 'heart'
Config.HeartWidthPx = 85
Config.HeartHeightPx = 130
Config.HeartScaleMultiplier = 0.022

Config.NameOffsetX = 0.03
Config.NameOffsetY = 0.02

Config.StackSpacing = 0.12
Config.IgnoreVehiclesInLOS = true

--------------------------------------
-- BLIP SETTINGS
--------------------------------------
Config.MaxBlipDistance = 100000.0
Config.FriendBlipColor = 2
Config.FriendBlipDeadColor = 1
Config.FriendDownHealthThreshold = 101

-- Blip color to RGB mapping (for name text color)
Config.BlipColorMap = {
	[1] = { 255, 0, 0 },
	[2] = { 0, 255, 0 },
	[3] = { 0, 0, 255 },
	[5] = { 255, 255, 0 },
	[6] = { 255, 165, 0 },
	[8] = { 128, 0, 128 },
	[11] = { 0, 255, 255 },
	[17] = { 255, 105, 180 },
	[18] = { 144, 238, 144 },
	[24] = { 139, 0, 0 },
	[27] = { 255, 255, 255 },
	[40] = { 0, 0, 0 },
}

--------------------------------------
-- INVENTORY / GIFTS
--------------------------------------
-- Supported: 'qb' (qb-inventory), 'ox' (ox_inventory)
Config.InventoryType = 'qb'
Config.InventoryImagePath = 'https://cfx-nui-ox_inventory/web/images/'
Config.InventoryImageExtension = '.png'

-- UI refresh intervals (ms)
Config.FriendsUiRefresh = 500
Config.GiftsUiRefresh = 5000

--------------------------------------
-- DISCORD LOGGING
--------------------------------------
-- Set to your Discord webhook URL or leave empty to disable.
Config.GiftLogWebhook = ''
