fx_version 'cerulean'
game 'gta5'

name 'L3GiTFriends'
author 'L3GiT'
description 'Premium Friend system w/ UI, waypoint, gifting & friend blips'
version '2.5'

lua54 'yes'

shared_script '@ox_lib/init.lua'
shared_script 'config.lua'

client_scripts {
    'client/draw.lua',
    'client/blips.lua',
    'client/main.lua',
}

ui_page 'html/index.html'

server_scripts {
    '@oxmysql/lib/MySQL.lua',
    'server/main.lua',
}

dependency 'oxmysql'

files {
    'html/index.html',
    'html/style.css',
    'html/app.js',
}

escrow_ignore {
	"config.lua"
}
dependency '/assetpacks'