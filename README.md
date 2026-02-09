# [Escrowed] ~ L3GiTFriends (Premium Friends UI)
Premium friends system for FiveM (QBCore + ox_lib + oxmysql) with a modern NUI, notes, gifts, color customization, and Discord logging.

## Features

- Professional NUI with draggable friends panel
- Online/Offline sections with status dots
- Friend detail panel with notes, gifts, and quick actions
- Per-friend name/blip color selection
- Gift sending with inventory integration (qb-inventory or ox_inventory)
- Gift claiming and history display
- SQL-backed friend relationships and gifts
- Discord webhook logging for gift transfers (sender/recipient + item labels + amount)

<img width="274" height="230" alt="image" src="https://github.com/user-attachments/assets/18f7f748-e29d-4851-a2cd-a6ef6b22a98c" />

## Requirements

- QBCore
- ox_lib
- ox_target
- oxmysql
- qb-inventory or ox_inventory

## Installation

1. Drop the folder into your resources (e.g. `resources/[L3GiT]/L3GiTFriends`).
2. Ensure dependencies are started before this resource.
3. Add to your server config:

```
ensure L3GiTFriends
```

4. Restart the server. The SQL tables are created automatically on first start.

<img width="575" height="361" alt="image" src="https://github.com/user-attachments/assets/cd12bf06-e059-45bb-a8b0-25725f2a1969" />

## Configuration

Edit [config.lua](config.lua):

- `Config.InventoryType` — `qb` or `ox`
- `Config.InventoryImagePath` / `Config.InventoryImageExtension` (icons used in UI)
- `Config.FriendBlipColor` / `Config.FriendBlipDeadColor`
- `Config.FriendDownHealthThreshold`
- `Config.FriendBlipColor` defaults to green for new friends
- `Config.GiftLogWebhook` — Discord webhook URL for gift logs (leave empty to disable)

## Usage

- Press **END** to open the friends UI.
- Add/Remove friends via ox_target.
- Select a friend to view details, notes, and gifts.
- Send gifts from your inventory (multiple items are combined into a single webhook entry) and claim incoming gifts.

<img width="539" height="362" alt="image" src="https://github.com/user-attachments/assets/1ccc38cc-062e-4a10-a2e4-cfb21aea2796" />

## Notes

- Money and black_money are blocked from gifting.
- Color selection is persisted per friend via KVP.
- Gift logs include Discord mention + character names and item labels.

## Webhook Format

When multiple items are sent in one gift, they are combined into a single webhook message:

`Sender ➔ (amount) item, (amount) item ➔ Recipient`

## Support

Contact the author for premium support or custom integrations.




